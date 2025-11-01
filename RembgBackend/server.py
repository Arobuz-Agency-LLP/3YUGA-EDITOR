from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from rembg import remove, new_session
from PIL import Image
import io
import threading
import logging

app = Flask(__name__)
CORS(app)  # Allow requests from your Fabric.js frontend

# Configure logging to see what's happening
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

if __name__ == '__main__':
    # Initialize all models at startup (downloads happen here, not on API calls)
    logger.info('Starting Rembg backend server...')
    initialize_models()
    
    app.run(host='0.0.0.0', port=5000, threaded=True)
