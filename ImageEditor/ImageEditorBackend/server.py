from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from rembg import remove, new_session
from PIL import Image
from image_processing import extract_text_with_ocr as ocr_extract, segment_objects_with_methods as segment_objects
from image_processing import erase_text_regions, group_words_into_lines, build_fabric_text_objects_from_lines
from image_processing import ocr_with_rectification
import io
import threading
import logging
import cv2
import numpy as np
import base64

app = Flask(__name__)
CORS(app)  # Allow requests from your Fabric.js frontend

# Configure logging to see what's happening
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    import pytesseract
    TESSERACT_AVAILABLE = True
    
    # Configure Tesseract path for Windows (if not in PATH)
    import sys
    import os
    if sys.platform == 'win32':
        # Common installation paths for Tesseract on Windows
        possible_paths = [
            r'C:\Program Files\Tesseract-OCR\tesseract.exe',
            r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
            r'C:\Users\{}\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'.format(os.getenv('USERNAME', '')),
            r'C:\Program Files\Python*\Lib\site-packages\pytesseract\tesseract.exe',
        ]
        
        # Also check if tesseract is already in PATH
        tesseract_found = False
        try:
            pytesseract.get_tesseract_version()
            tesseract_found = True
            logger.info("Tesseract found in PATH")
        except Exception:
            # Not in PATH, try to find it
            for path in possible_paths:
                if os.path.exists(path):
                    pytesseract.pytesseract.tesseract_cmd = path
                    logger.info(f"Tesseract found at: {path}")
                    tesseract_found = True
                    break
        
        if not tesseract_found:
            logger.warning("Tesseract OCR not found. Please install it from: https://github.com/UB-Mannheim/tesseract/wiki")
            logger.warning("Or add it to your PATH environment variable.")
            TESSERACT_AVAILABLE = False
        else:
            try:
                # Test if it works
                pytesseract.get_tesseract_version()
                logger.info("Tesseract OCR configured successfully")
            except Exception as e:
                logger.error(f"Tesseract configuration error: {e}")
                TESSERACT_AVAILABLE = False
    else:
        # For Linux/Mac, assume it's in PATH
        try:
            pytesseract.get_tesseract_version()
            logger.info("Tesseract OCR found in PATH")
        except Exception as e:
            logger.warning(f"Tesseract OCR not found in PATH: {e}")
            TESSERACT_AVAILABLE = False
            
except ImportError:
    TESSERACT_AVAILABLE = False
    logger.warning("pytesseract not available. OCR features will be disabled.")

# Session pooling for better performance - reuse models instead of recreating
_sessions = {}
_session_lock = threading.Lock()

def get_session(model_name='isnet-general-use'):
    """Get or create a rembg session for the specified model."""
    with _session_lock:
        if model_name not in _sessions:
            logger.info(f'Initializing model: {model_name} ')
            # Use ISNet General Use model for better precision (more accurate than u2net)
            # Alternative models: 'u2net', 'u2net_human_seg', 'u2netp', 'silueta', 'isnet-general-use', 'sam'
            _sessions[model_name] = new_session(model_name)
            logger.info(f'Model {model_name} initialized successfully')
        return _sessions[model_name]

def initialize_models():
    """Pre-initialize all models at startup to download them once."""
    logger.info('Pre-initializing models (downloading if needed)...')
    models_to_init = ['isnet-general-use', 'u2net_human_seg', 'u2net']
    
    for model in models_to_init:
        try:
            logger.info(f'Loading model: {model}')
            get_session(model)
        except Exception as e:
            logger.error(f'Failed to initialize model {model}: {e}')
    
    logger.info('Model initialization complete')

@app.route('/')
def home():
    return jsonify({"message": "Rembg API is running"})

@app.route('/remove-bg', methods=['POST'])
def remove_bg():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    try:
        image_file = request.files['image']
        
        # Preserve original image format and quality
        input_image = Image.open(image_file.stream)
        # Convert to RGBA if not already (ensures alpha channel support)
        if input_image.mode != 'RGBA':
            input_image = input_image.convert('RGBA')
        
        # Get model type from request (optional parameter)
        model_type = request.form.get('model', 'isnet-general-use').lower()
        
        # this auto detects ki if its image of person or not and selects best model
        if model_type == 'auto':
            # Simple heuristic: if width/height ratio suggests portrait and image is medium-large
            width, height = input_image.size
            aspect_ratio = width / height if height > 0 else 1
            is_portrait_oriented = aspect_ratio < 0.75 or aspect_ratio > 1.33
            is_large = width > 512 or height > 512
            
            if is_portrait_oriented and is_large:
                model_type = 'u2net_human_seg'  # Better for portraits/people
            else:
                model_type = 'isnet-general-use'  # Best general-purpose model
        
        # Validate model type
        valid_models = ['u2net', 'u2net_human_seg', 'u2netp', 'silueta', 'isnet-general-use', 'sam']
        if model_type not in valid_models:
            model_type = 'isnet-general-use'  # Default to best general model
        
        # Get session for the selected model (already cached if initialized at startup)
        session = get_session(model_type)
        
        # Get alpha matting parameters for better edge refinement (optional)
        alpha_matting = request.form.get('alpha_matting', 'false').lower() == 'true'
        alpha_matting_foreground_threshold = int(request.form.get('alpha_matting_foreground_threshold', '240'))
        alpha_matting_background_threshold = int(request.form.get('alpha_matting_background_threshold', '10'))
        alpha_matting_erode_size = int(request.form.get('alpha_matting_erode_size', '10'))
        
        # Remove background with optional alpha matting for smoother edges
        if alpha_matting:
            output_image = remove(
                input_image,
                session=session,
                alpha_matting=True,
                alpha_matting_foreground_threshold=alpha_matting_foreground_threshold,
                alpha_matting_background_threshold=alpha_matting_background_threshold,
                alpha_matting_erode_size=alpha_matting_erode_size
            )
        else:
            # Standard removal - still high quality
            output_image = remove(input_image, session=session)
        
        # Save output image to memory with maximum quality
        img_bytes = io.BytesIO()
        # Use PNG for lossless quality (preserves alpha channel perfectly)
        output_image.save(img_bytes, format='PNG', optimize=False)
        img_bytes.seek(0)

        # Return the processed image
        return send_file(img_bytes, mimetype='image/png')
        
    except Exception as e:
        logger.error(f'Error processing image: {e}')
        return jsonify({'error': f'Failed to process image: {str(e)}'}), 500

# (moved OCR and segmentation helpers to image_processing.py and sam_segmentation.py)

@app.route('/make-editable', methods=['POST'])
def make_editable():
    """Smart Text Replacement Mask

    - Run OCR to detect text and their bounding boxes
    - Clean text areas in the base image (fill average color or blur)
    - Return cleaned base image (as base64 data URL) and Fabric-compatible text objects
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    try:
        image_file = request.files['image']
        input_image = Image.open(image_file.stream)
        
        # Convert to RGB if needed
        if input_image.mode != 'RGB':
            input_image = input_image.convert('RGB')
        
        logger.info(f'Processing image for editing: {input_image.size}')

        # 1) OCR with perspective rectification (maps bboxes back to original space)
        text_data, H, H_inv = ocr_with_rectification(input_image, TESSERACT_AVAILABLE)
        words = text_data.get('words', [])
        logger.info(f'Found {len(words)} text elements')

        # 2) Clean only the text regions (no background removal)
        method = request.form.get('text_clean_method', 'fill')  # 'fill' or 'blur'
        cleaned_image = erase_text_regions(input_image, words, method=method)

        # 3) Convert cleaned image to base64 data URL
        img_bytes = io.BytesIO()
        cleaned_image.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        base64_data = base64.b64encode(img_bytes.read()).decode('utf-8')
        base_image_data_url = f'data:image/png;base64,{base64_data}'

        # 4) Group words into lines and build Fabric-compatible text objects
        lines = group_words_into_lines(words)
        fabric_objects = build_fabric_text_objects_from_lines(input_image, lines)

        response = {
            'baseImage': base_image_data_url,
            'objects': fabric_objects,
            'imageSize': {
                'width': int(input_image.size[0]),
                'height': int(input_image.size[1])
            },
            'text': text_data,
            'homographyApplied': H_inv is not None
        }

        return jsonify(response)
        
    except Exception as e:
        logger.error(f'Error making image editable: {e}')
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to process image: {str(e)}'}), 500

if __name__ == '__main__':
    logger.info('Starting Rembg backend server...')
    initialize_models()
    try:
        logger.info('Initializing SAM model for segmentation...')
        get_session('sam')
        logger.info('SAM model initialized successfully')
    except Exception as e:
        logger.warning(f'Could not initialize SAM model: {e}. Will use fallback segmentation.')
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
