# Python Backend Documentation - 3YUGA Editor

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [File Breakdown](#file-breakdown)
4. [Workflow & Architecture](#workflow--architecture)
5. [Open Source Libraries](#open-source-libraries)
6. [API Endpoints](#api-endpoints)
7. [Core Features](#core-features)
8. [Data Flow](#data-flow)
9. [Installation & Setup](#installation--setup)
10. [Configuration](#configuration)

---

## Overview

The Python backend is a Flask-based REST API server that provides advanced image processing capabilities for the 3YUGA Editor frontend. It handles background removal, OCR (Optical Character Recognition), text extraction, object segmentation, and image editing features using state-of-the-art AI models.

### Key Capabilities:
- ✅ **Background Removal**: AI-powered background removal using multiple deep learning models
- ✅ **OCR Processing**: Extract text from images with perspective rectification
- ✅ **Text Masking**: Clean text regions from images for editing
- ✅ **Object Segmentation**: Detect and segment objects in images
- ✅ **Text Integration**: Render edited text back onto images

---

## Project Structure

```
RembgBackend/
├── server.py                 # Main Flask application & API endpoints
├── image_processing.py       # OCR, text extraction, image manipulation
├── sam_segmentation.py       # SAM (Segment Anything Model) integration
├── requirements.txt          # Python dependencies
└── BACKGROUND_REMOVAL_DOCUMENTATION.md  # Background removal docs
```

---

## File Breakdown

### 1. `server.py` - Main Flask Application

**Purpose**: Core Flask server with all API endpoints and request handling.

**Key Components**:

#### **Flask App Setup**
```python
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests
```

#### **Session Pooling System**
- **Location**: Lines 80-107
- **Purpose**: Cache loaded AI models in memory for performance
- **Implementation**:
  - Global dictionary `_sessions` stores loaded models
  - Thread-safe access using `threading.Lock()`
  - Models are loaded once and reused across requests
  - Pre-initialization at server startup

```python
_sessions = {}  # Dictionary: {model_name: loaded_model}
_session_lock = threading.Lock()

def get_session(model_name='isnet-general-use'):
    """Get or create a rembg session for the specified model."""
    with _session_lock:
        if model_name not in _sessions:
            _sessions[model_name] = new_session(model_name)
        return _sessions[model_name]
```

#### **Tesseract OCR Configuration**
- **Location**: Lines 24-78
- **Purpose**: Configure Tesseract OCR for text extraction
- **Features**:
  - Auto-detects Tesseract installation path (Windows/Linux/Mac)
  - Validates installation
  - Handles missing Tesseract gracefully

#### **API Endpoints**:

1. **`GET /`** - Health check
   - Returns: `{"message": "Rembg API is running"}`

2. **`POST /remove-bg`** - Background Removal
   - **Purpose**: Remove background from images using AI models
   - **Input**: FormData with `image` file
   - **Parameters**:
     - `model`: Model type (`'auto'`, `'isnet-general-use'`, `'u2net_human_seg'`, etc.)
     - `alpha_matting`: Enable edge refinement (`'true'`/`'false'`)
     - `alpha_matting_foreground_threshold`: Foreground detection (0-255)
     - `alpha_matting_background_threshold`: Background detection (0-255)
     - `alpha_matting_erode_size`: Edge smoothing intensity
   - **Output**: PNG image with transparent background
   - **Workflow**:
     1. Receive image file
     2. Convert to RGBA format
     3. Select AI model (auto-detect or manual)
     4. Get cached model session
     5. Run background removal
     6. Apply alpha matting (if enabled)
     7. Return PNG blob

3. **`POST /make-editable`** - Make Image Editable (OCR + Text Masking)
   - **Purpose**: Extract text from image and create editable version
   - **Input**: FormData with `image` file
   - **Parameters**:
     - `text_clean_method`: Method to clean text regions (`'fill'` or `'blur'`)
   - **Output**: JSON with:
     - `baseImage`: Base64 data URL of cleaned image
     - `objects`: Array of Fabric.js-compatible text objects
     - `imageSize`: Original image dimensions
     - `text`: OCR text data
   - **Workflow**:
     1. Receive image file
     2. Run OCR with perspective rectification
     3. Clean text regions from image
     4. Group words into lines
     5. Build Fabric.js text objects
     6. Return cleaned image + text objects

4. **`POST /integrate-text`** - Integrate Edited Text
   - **Purpose**: Render edited text back onto the image
   - **Input**: FormData with `image` file + `textEdits` JSON
   - **Output**: JSON with integrated image as base64 data URL
   - **Workflow**:
     1. Receive original image
     2. Parse text edits JSON
     3. Load system fonts
     4. Render each text edit onto image
     5. Return integrated image

---

### 2. `image_processing.py` - Image Processing Functions

**Purpose**: Contains all image manipulation, OCR, and text processing functions.

#### **Key Functions**:

##### **OCR Functions**:

1. **`extract_text_with_ocr(image, tesseract_available)`**
   - **Purpose**: Extract text from image using Tesseract OCR
   - **Process**:
     - Preprocess image (denoise, enhance contrast, sharpen)
     - Run Tesseract OCR
     - Extract word-level data with bounding boxes
     - Filter by confidence threshold (>30%)
   - **Returns**: Dictionary with `words` array and `full_text` string

2. **`preprocess_image_for_ocr(image)`**
   - **Purpose**: Optimize image for better OCR accuracy
   - **Steps**:
     - Convert to grayscale
     - Denoise using `cv2.fastNlMeansDenoising`
     - Enhance contrast using CLAHE (Contrast Limited Adaptive Histogram Equalization)
     - Sharpen image
     - Scale up if too small (<300px)
   - **Returns**: Preprocessed PIL Image and scale factor

##### **Text Masking Functions**:

3. **`erase_text_regions(image, words, method='fill')`**
   - **Purpose**: Remove text regions from image without affecting background
   - **Methods**:
     - `'fill'`: Fill with average color of region
     - `'blur'`: Apply Gaussian blur to region
     - `'inpaint'`: Use inpainting algorithm to fill region
   - **Returns**: Cleaned PIL Image

##### **Text Grouping Functions**:

4. **`group_words_into_lines(words, y_tolerance_ratio=0.5)`**
   - **Purpose**: Group OCR words into lines based on vertical proximity
   - **Algorithm**:
     - Calculate vertical tolerance based on word height
     - Group words with similar Y coordinates
     - Sort words within lines by X coordinate
     - Sort lines by Y coordinate
   - **Returns**: Array of lines (each line is array of word dicts)
5. **`build_fabric_text_objects_from_lines(image, lines)`**
   - **Purpose**: Convert OCR lines to Fabric.js-compatible text objects
   - **Process**:
     - Combine words in each line into single text string
     - Calculate bounding box for entire line
     - Estimate font size from word heights
     - Estimate text color from image pixels
   - **Returns**: Array of Fabric.js text object dictionaries

##### **Document Rectification Functions**:

6. **`detect_document_quad(image)`**
   - **Purpose**: Detect 4-point quadrilateral for document/page
   - **Process**:
     - Convert to grayscale
     - Apply Gaussian blur
     - Edge detection (Canny)
     - Find contours
     - Find largest 4-point convex contour
     - Order points (top-left, top-right, bottom-right, bottom-left)
   - **Returns**: 4-point numpy array or None

7. **`rectify_image_for_ocr(image)`**
   - **Purpose**: Apply perspective correction for better OCR
   - **Process**:
     - Detect document quad
     - Calculate homography matrix
     - Warp image to top-down view
     - Calculate inverse homography for mapping back
   - **Returns**: (rectified_image, H, H_inv)

8. **`ocr_with_rectification(image, tesseract_available)`**
   - **Purpose**: Run OCR on rectified image and map results back
   - **Process**:
     - Rectify image if document detected
     - Run OCR on rectified image
     - Map bounding boxes back to original image space
   - **Returns**: (text_data_dict, H, H_inv)

##### **Object Detection Functions**:

9. **`segment_objects_with_methods(image, get_session_func)`**
   - **Purpose**: Detect objects in image using multiple methods
   - **Methods**:
     - Edge detection (Canny + contours)
     - Color segmentation (HSV color ranges)
   - **Returns**: Array of detected objects

10. **`detect_objects_by_edges(image)`**
    - **Purpose**: Detect objects using edge detection
    - **Process**:
      - Convert to grayscale
      - Apply Canny edge detection
      - Find contours
      - Filter by area (>500 pixels)
      - Create bounding boxes
    - **Returns**: Array of edge-detected objects

11. **`detect_objects_by_color(image)`**
    - **Purpose**: Detect objects by color segmentation
    - **Process**:
      - Convert to HSV color space
      - Define color ranges (red, blue, green)
      - Create masks for each color
      - Find contours in each mask
      - Filter by area (>1000 pixels)
    - **Returns**: Array of color-detected objects

##### **Color Estimation**:

12. **`estimate_text_color_near_bbox(image, bbox)`**
    - **Purpose**: Estimate text color from image pixels
    - **Process**:
      - Extract region of interest (bbox)
      - Calculate median color (robust to outliers)
      - Convert RGB to hex color string
    - **Returns**: Hex color string (e.g., `'#000000'`)

---

### 3. `sam_segmentation.py` - SAM Model Integration

**Purpose**: Integration with Segment Anything Model (SAM) for advanced segmentation.

#### **Key Functions**:

1. **`remove_background_mask(image, get_session, model='isnet-general-use')`**
   - **Purpose**: Extract foreground mask using rembg models
   - **Process**:
     - Get model session
     - Run background removal
     - Extract alpha channel
     - Binarize mask (0/255)
   - **Returns**: Binary numpy array mask or None

2. **`get_sam_mask(image, get_session)`**
   - **Purpose**: Get segmentation mask using SAM model
   - **Returns**: Binary mask or None

**Note**: SAM integration is prepared but currently uses rembg's SAM wrapper. Full SAM implementation would require additional setup.

---

### 4. `requirements.txt` - Dependencies

Lists all Python packages required:

```
flask              # Web framework
flask-cors         # CORS support
rembg              # Background removal AI library
Pillow             # Image processing
opencv-python      # Computer vision operations
numpy              # Numerical operations
pytesseract        # OCR wrapper for Tesseract
scikit-learn       # Machine learning utilities
```

---

## Workflow & Architecture

### Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  EditorContext.tsx / Canvas.jsx                             │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP POST
                          │ FormData
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              FLASK SERVER (server.py)                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Request Validation & File Handling                │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Image Preprocessing (PIL)                           │    │
│  │  - Convert to RGBA                                   │    │
│  │  - Format validation                                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Model Selection & Session Pooling                  │    │
│  │  - Auto-detect model type                           │    │
│  │  - Get cached model session                         │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Processing (Based on Endpoint)                     │    │
│  │  ┌──────────────────┐  ┌──────────────────────┐    │    │
│  │  │ /remove-bg       │  │ /make-editable       │    │    │
│  │  │ - rembg.remove() │  │ - OCR processing     │    │    │
│  │  │ - Alpha matting  │  │ - Text masking       │    │    │
│  │  └──────────────────┘  │ - Text grouping      │    │    │
│  │                        └──────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Response Encoding                                   │    │
│  │  - PNG encoding (remove-bg)                          │    │
│  │  - Base64 encoding (make-editable)                  │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                          │
                          │ HTTP Response
                          │ (Image or JSON)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  - Load image on canvas                                     │
│  - Update layers                                            │
│  - Save to history                                          │
└─────────────────────────────────────────────────────────────┘
```

### Processing Pipeline

#### **Background Removal Pipeline**:
```
1. Image Upload → 2. Format Conversion → 3. Model Selection
   ↓
4. AI Inference → 5. Alpha Matting → 6. PNG Encoding → 7. Response
```

#### **OCR & Text Masking Pipeline**:
```
1. Image Upload → 2. Document Rectification → 3. OCR Processing
   ↓
4. Text Region Detection → 5. Text Masking/Cleaning
   ↓
6. Word Grouping → 7. Fabric Object Creation → 8. JSON Response
```

---

## Open Source Libraries

### Core Libraries

#### **1. Flask** (`flask`)
- **Purpose**: Web framework for building REST API
- **Version**: Latest stable
- **Usage**: Main server application, routing, request handling
- **License**: BSD-3-Clause
- **Website**: https://flask.palletsprojects.com/

#### **2. Flask-CORS** (`flask-cors`)
- **Purpose**: Enable Cross-Origin Resource Sharing
- **Usage**: Allow frontend (React) to make API requests
- **License**: MIT
- **Website**: https://flask-cors.readthedocs.io/

#### **3. rembg** (`rembg`)
- **Purpose**: Background removal using AI models
- **Models Supported**:
  - `isnet-general-use`: Best general-purpose model (ISNet)
  - `u2net_human_seg`: Optimized for people/portraits
  - `u2net`: General purpose (older)
  - `u2netp`: Lightweight version
  - `silueta`: Silhouette extraction
  - `sam`: Segment Anything Model
- **License**: MIT
- **Website**: https://github.com/danielgatis/rembg
- **Model Repository**: https://github.com/levindabhi/cloth-segmentation

#### **4. Pillow (PIL)** (`Pillow`)
- **Purpose**: Image processing and manipulation
- **Usage**: Image loading, format conversion, saving, drawing
- **License**: HPND (Historical Permission Notice and Disclaimer)
- **Website**: https://pillow.readthedocs.io/

#### **5. OpenCV** (`opencv-python`)
- **Purpose**: Computer vision operations
- **Usage**: 
  - Image preprocessing (denoising, contrast enhancement)
  - Edge detection (Canny)
  - Contour detection
  - Color space conversion (RGB ↔ HSV)
  - Image inpainting
  - Perspective transformation
- **License**: Apache 2.0
- **Website**: https://opencv.org/

#### **6. NumPy** (`numpy`)
- **Purpose**: Numerical computing and array operations
- **Usage**: 
  - Image array manipulation
  - Matrix operations (homography)
  - Mathematical calculations
- **License**: BSD-3-Clause
- **Website**: https://numpy.org/

#### **7. pytesseract** (`pytesseract`)
- **Purpose**: Python wrapper for Tesseract OCR engine
- **Usage**: Text extraction from images
- **Requirements**: Tesseract OCR must be installed separately
- **License**: Apache 2.0
- **Website**: https://github.com/madmaze/pytesseract
- **Tesseract**: https://github.com/tesseract-ocr/tesseract

#### **8. scikit-learn** (`scikit-learn`)
- **Purpose**: Machine learning utilities
- **Usage**: Additional ML utilities (if needed for advanced features)
- **License**: BSD-3-Clause
- **Website**: https://scikit-learn.org/

---

## API Endpoints

### 1. `GET /`
**Health Check Endpoint**
- **Purpose**: Verify server is running
- **Response**: `{"message": "Rembg API is running"}`
- **Status Code**: 200

### 2. `POST /remove-bg`
**Background Removal Endpoint**

**Request**:
- **Method**: POST
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `image`: Image file (required)
  - `model`: Model type (optional, default: `'auto'`)
    - Options: `'auto'`, `'isnet-general-use'`, `'u2net_human_seg'`, `'u2net'`, `'u2netp'`, `'silueta'`, `'sam'`
  - `alpha_matting`: Enable alpha matting (optional, default: `'false'`)
  - `alpha_matting_foreground_threshold`: Foreground threshold 0-255 (optional, default: `240`)
  - `alpha_matting_background_threshold`: Background threshold 0-255 (optional, default: `10`)
  - `alpha_matting_erode_size`: Erosion size in pixels (optional, default: `10`)

**Response**:
- **Content-Type**: `image/png`
- **Body**: PNG image with transparent background

**Error Responses**:
- `400`: No image uploaded
- `500`: Processing error

### 3. `POST /make-editable`
**Make Image Editable (OCR + Text Masking)**

**Request**:
- **Method**: POST
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `image`: Image file (required)
  - `text_clean_method`: Cleaning method (optional, default: `'fill'`)
    - Options: `'fill'` (average color), `'blur'` (Gaussian blur)

**Response**:
```json
{
  "baseImage": "data:image/png;base64,...",
  "objects": [
    {
      "type": "textbox",
      "text": "Extracted text",
      "left": 100,
      "top": 50,
      "width": 200,
      "fontSize": 24,
      "fill": "#000000",
      "fontFamily": "Arial",
      "name": "Text: Extracted text"
    }
  ],
  "imageSize": {
    "width": 1920,
    "height": 1080
  },
  "text": {
    "words": [...],
    "full_text": "..."
  },
  "homographyApplied": true
}
```

**Error Responses**:
- `400`: No image uploaded
- `500`: Processing error

### 4. `POST /integrate-text`
**Integrate Edited Text onto Image**

**Request**:
- **Method**: POST
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `image`: Original image file (required)
  - `textEdits`: JSON array of text edits (required)
    ```json
    [
      {
        "text": "Edited text",
        "bbox": {"x": 100, "y": 50, "width": 200, "height": 32},
        "fill": "#000000",
        "fontFamily": "Arial",
        "fontSize": 24,
        "fontWeight": "normal",
        "opacity": 1.0
      }
    ]
    ```

**Response**:
```json
{
  "integratedImage": "data:image/png;base64,...",
  "imageSize": {
    "width": 1920,
    "height": 1080
  },
  "textCount": 5
}
```

**Error Responses**:
- `400`: No image uploaded or invalid JSON
- `500`: Processing error

---

## Core Features

### 1. Background Removal
- **AI Models**: Multiple deep learning models for different use cases
- **Auto-Detection**: Automatically selects best model based on image characteristics
- **Alpha Matting**: Edge refinement for smooth, professional results
- **Session Pooling**: Cached models for faster processing

### 2. OCR Processing
- **Tesseract Integration**: Industry-standard OCR engine
- **Perspective Rectification**: Automatically corrects document perspective
- **Preprocessing**: Image enhancement for better OCR accuracy
- **Confidence Filtering**: Only extracts high-confidence text (>30%)

### 3. Text Masking
- **Multiple Methods**: Fill, blur, or inpaint text regions
- **Precise Detection**: Uses OCR bounding boxes for accurate masking
- **Background Preservation**: Only affects text regions, preserves background

### 4. Text Grouping
- **Line Detection**: Groups words into lines based on vertical proximity
- **Fabric.js Integration**: Creates compatible text objects for frontend
- **Color Estimation**: Automatically detects text color from image

### 5. Object Segmentation
- **Edge Detection**: Detects objects using Canny edge detection
- **Color Segmentation**: Detects objects by color ranges
- **Bounding Boxes**: Returns precise object locations

---

## Data Flow

### Background Removal Flow
```
Frontend
  ↓ (Export canvas as PNG)
  ↓ (Convert to Blob)
  ↓ (Create FormData)
  ↓ POST /remove-bg
Backend
  ↓ (Load image)
  ↓ (Select model)
  ↓ (Get session from pool)
  ↓ (Run AI inference)
  ↓ (Apply alpha matting)
  ↓ (Encode as PNG)
  ↓ Return PNG blob
Frontend
  ↓ (Load image URL)
  ↓ (Create Fabric Image)
  ↓ (Replace on canvas)
```

### OCR & Text Masking Flow
```
Frontend
  ↓ (Export image)
  ↓ POST /make-editable
Backend
  ↓ (Load image)
  ↓ (Detect document quad)
  ↓ (Rectify perspective)
  ↓ (Run OCR)
  ↓ (Map bboxes to original)
  ↓ (Group words into lines)
  ↓ (Erase text regions)
  ↓ (Build Fabric objects)
  ↓ Return JSON
Frontend
  ↓ (Load cleaned image)
  ↓ (Create text objects)
  ↓ (Display on canvas)
```

### Text Integration Flow
```
Frontend
  ↓ (Export image + text edits)
  ↓ POST /integrate-text
Backend
  ↓ (Load image)
  ↓ (Parse text edits)
  ↓ (Load fonts)
  ↓ (Render each text)
  ↓ (Encode as PNG)
  ↓ Return base64 image
Frontend
  ↓ (Load integrated image)
  ↓ (Display on canvas)
```

---

## Installation & Setup

### Prerequisites
1. **Python 3.8+**
2. **Tesseract OCR** (for OCR features)
   - Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki
   - Linux: `sudo apt-get install tesseract-ocr`
   - Mac: `brew install tesseract`

### Installation Steps

1. **Navigate to backend directory**:
   ```bash
   cd RembgBackend
   ```

2. **Create virtual environment** (recommended):
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Verify Tesseract installation**:
   ```bash
   tesseract --version
   ```

5. **Run server**:
   ```bash
   python server.py
   ```

6. **Server will start on**: `http://0.0.0.0:5000`

### First Run
- Server will automatically download AI models on first use
- Models are cached in: `~/.u2net/` (Linux/Mac) or `C:\Users\<username>\.u2net\` (Windows)
- First request may take 3-8 seconds (model loading)
- Subsequent requests: 1-3 seconds (cached models)

---

## Configuration

### Environment Variables
Currently, no environment variables are required. All configuration is done through:
- Code constants
- Request parameters
- Tesseract path auto-detection

### Model Configuration
Models are configured in `server.py`:
- **Default model**: `'isnet-general-use'`
- **Pre-initialized models**: `['isnet-general-use', 'u2net_human_seg', 'u2net']`
- **Model storage**: Cached in user home directory

### Tesseract Configuration
Tesseract path is auto-detected on Windows:
- Common paths are checked
- Falls back to PATH if not found
- Linux/Mac: Assumes Tesseract is in PATH

### Server Configuration
- **Host**: `0.0.0.0` (accepts connections from any IP)
- **Port**: `5000`
- **Debug Mode**: `True` (for development)
- **Threading**: `True` (handles concurrent requests)

---

## Performance Optimization

### Session Pooling
- **Benefit**: 3-5x faster processing after first request
- **Memory**: ~500MB per model (3 models = ~1.5GB)
- **Thread-Safe**: Handles concurrent requests safely

### Model Pre-initialization
- Models are loaded at server startup
- Prevents first-request delay
- Downloads models if not cached

### Image Preprocessing
- Optimized for OCR accuracy
- CLAHE for contrast enhancement
- Denoising for better text recognition
- Scaling for small images

---

## Error Handling

### Common Errors

1. **Tesseract Not Found**
   - **Symptom**: OCR features disabled
   - **Solution**: Install Tesseract OCR
   - **Log**: Warning message in server logs

2. **Model Download Failed**
   - **Symptom**: Model initialization error
   - **Solution**: Check internet connection, retry
   - **Log**: Error in server logs

3. **Image Processing Failed**
   - **Symptom**: 500 error response
   - **Solution**: Check image format, size
   - **Log**: Error traceback in server logs

4. **Memory Error**
   - **Symptom**: Server crashes or hangs
   - **Solution**: Resize large images before processing
   - **Prevention**: Limit concurrent requests

---

## Testing

### Manual Testing

1. **Test Background Removal**:
   ```bash
   curl -X POST http://localhost:5000/remove-bg \
     -F "image=@test_image.jpg" \
     -F "model=auto" \
     -F "alpha_matting=true" \
     -o output.png
   ```

2. **Test OCR**:
   ```bash
   curl -X POST http://localhost:5000/make-editable \
     -F "image=@test_image.jpg" \
     -F "text_clean_method=fill" \
     -o response.json
   ```

### Health Check
```bash
curl http://localhost:5000/
```

---

## Future Enhancements

### Potential Improvements:
1. **GPU Acceleration**: Use CUDA/OpenCL for faster processing
2. **Async Processing**: Use Celery for background jobs
3. **Image Caching**: Cache processed images
4. **Rate Limiting**: Prevent abuse
5. **API Authentication**: Secure endpoints
6. **Batch Processing**: Process multiple images
7. **Advanced Segmentation**: Full SAM integration
8. **Language Detection**: Auto-detect text language for OCR

---

## License & Credits

### Open Source Licenses:
- **Flask**: BSD-3-Clause
- **rembg**: MIT
- **Pillow**: HPND
- **OpenCV**: Apache 2.0
- **NumPy**: BSD-3-Clause
- **pytesseract**: Apache 2.0
- **Tesseract OCR**: Apache 2.0

### Model Credits:
- **ISNet**: https://github.com/xuebinqin/ISNet
- **U2Net**: https://github.com/xuebinqin/U-2-Net
- **SAM**: Meta AI Research

---

## Support & Troubleshooting

### Logs
- Server logs all operations with INFO/ERROR levels
- Check console output for detailed error messages
- Tesseract warnings are logged if not found

### Debugging
- Enable Flask debug mode: `app.run(debug=True)`
- Check browser Network tab for request/response
- Verify Tesseract installation: `tesseract --version`

### Common Issues
1. **Port 5000 already in use**: Change port in `server.py`
2. **Tesseract not found**: Install Tesseract OCR
3. **Models not downloading**: Check internet connection
4. **CORS errors**: Verify `flask-cors` is installed

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Maintainer**: 3YUGA Development Team

