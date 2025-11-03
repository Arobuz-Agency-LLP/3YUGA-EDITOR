import cv2
import numpy as np
from PIL import Image
import logging

logger = logging.getLogger(__name__)

def extract_text_with_ocr(image, tesseract_available):
    """Extract text from image using OCR"""
    if not tesseract_available:
        return {"words": [], "full_text": ""}
    
    try:
        import pytesseract
        
        # Preprocess image for better OCR
        processed_img, scale_factor = preprocess_image_for_ocr(image)
        
        # Get detailed OCR data
        data = pytesseract.image_to_data(processed_img, output_type=pytesseract.Output.DICT)
        
        words = []
        for i in range(len(data['text'])):
            text = data['text'][i].strip()
            if text and int(data['conf'][i]) > 30:  # Confidence threshold
                # Adjust coordinates for scaling
                x = int(data['left'][i] / scale_factor)
                y = int(data['top'][i] / scale_factor)
                w = int(data['width'][i] / scale_factor)
                h = int(data['height'][i] / scale_factor)
                
                words.append({
                    'text': text,
                    'confidence': int(data['conf'][i]),
                    'bbox': {'x': x, 'y': y, 'width': w, 'height': h}
                })
        
        full_text = pytesseract.image_to_string(processed_img)
        
        return {
            "words": words,
            "full_text": full_text.strip()
        }
        
    except Exception as e:
        logger.error(f'OCR extraction error: {e}')
        return {"words": [], "full_text": ""}

def segment_objects_with_methods(image, get_session_func):
    """Segment objects using multiple methods"""
    objects = []
    
    try:
        # Method 1: Edge detection
        edge_objects = detect_objects_by_edges(image)
        objects.extend(edge_objects)
        
        # Method 2: Color segmentation
        color_objects = detect_objects_by_color(image)
        objects.extend(color_objects)
        
        logger.info(f'Found {len(objects)} objects total')
        
    except Exception as e:
        logger.error(f'Object segmentation error: {e}')
    
    return objects

def detect_objects_by_edges(image):
    """Detect objects using edge detection"""
    try:
        img_array = np.array(image)
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        
        # Edge detection
        edges = cv2.Canny(gray, 50, 150)
        
        # Find contours
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        objects = []
        for i, contour in enumerate(contours):
            area = cv2.contourArea(contour)
            if area > 500:  # Filter small objects
                x, y, w, h = cv2.boundingRect(contour)
                objects.append({
                    'type': 'edge_object',
                    'bbox': {'x': x, 'y': y, 'width': w, 'height': h},
                    'confidence': min(0.8, area / 10000)
                })
        
        return objects[:10]  # Limit to 10 objects
        
    except Exception as e:
        logger.error(f'Edge detection error: {e}')
        return []

def detect_objects_by_color(image):
    """Detect objects using color segmentation"""
    try:
        img_array = np.array(image)
        hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)
        
        # Define color ranges for common objects
        color_ranges = [
            # Red objects
            ([0, 50, 50], [10, 255, 255]),
            ([170, 50, 50], [180, 255, 255]),
            # Blue objects
            ([100, 50, 50], [130, 255, 255]),
            # Green objects
            ([40, 50, 50], [80, 255, 255]),
        ]
        
        objects = []
        for i, (lower, upper) in enumerate(color_ranges):
            mask = cv2.inRange(hsv, np.array(lower), np.array(upper))
            contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            for contour in contours:
                area = cv2.contourArea(contour)
                if area > 1000:  # Filter small areas
                    x, y, w, h = cv2.boundingRect(contour)
                    objects.append({
                        'type': 'color_object',
                        'bbox': {'x': x, 'y': y, 'width': w, 'height': h},
                        'confidence': min(0.7, area / 15000)
                    })
        
        return objects[:5]  # Limit to 5 color objects
        
    except Exception as e:
        logger.error(f'Color detection error: {e}')
        return []

def preprocess_image_for_ocr(image):
    """Preprocess image to improve OCR accuracy"""
    try:
        img_array = np.array(image.convert('RGB'))
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        
        # Denoise
        denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
        
        # Enhance contrast
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(denoised)
        
        # Sharpen
        kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
        sharpened = cv2.filter2D(enhanced, -1, kernel)
        
        # Scale if too small
        height, width = sharpened.shape
        scale_factor = 1.0
        if height < 300 or width < 300:
            scale = max(300 / height, 300 / width)
            new_width = int(width * scale)
            new_height = int(height * scale)
            sharpened = cv2.resize(sharpened, (new_width, new_height), interpolation=cv2.INTER_CUBIC)
            scale_factor = new_height / height
        
        return Image.fromarray(sharpened), scale_factor
    except Exception as e:
        logger.warning(f'Image preprocessing error: {e}')
        return image.convert('L'), 1.0


# --- Smart Text Replacement Mask ---
def erase_text_regions(image: Image.Image, words, method: str = "fill") -> Image.Image:
    """Erase/clean detected text regions without affecting the rest of the image.

    Args:
        image: PIL.Image in RGB mode (coordinates relate to this image size)
        words: iterable of dicts with structure { 'bbox': {x,y,width,height}, 'text': str, ... }
        method: 'fill' (average color) or 'blur' (Gaussian blur)

    Returns:
        PIL.Image with text regions replaced/blurred
    """
    try:
        img = np.array(image.convert('RGB'))
        h, w, _ = img.shape
        # Prepare mask for inpainting if needed
        mask = np.zeros((h, w), dtype=np.uint8)
        for wobj in words or []:
            bbox = wobj.get('bbox') or {}
            x = int(max(0, bbox.get('x', 0)))
            y = int(max(0, bbox.get('y', 0)))
            bw = int(max(1, bbox.get('width', 0)))
            bh = int(max(1, bbox.get('height', 0)))
            x2 = min(w, x + bw)
            y2 = min(h, y + bh)
            if x >= x2 or y >= y2:
                continue
            roi = img[y:y2, x:x2]
            if method == 'blur':
                # Ensure odd kernel sizes and within ROI bounds
                k = 15 if min(roi.shape[0], roi.shape[1]) >= 15 else max(3, (min(roi.shape[0], roi.shape[1]) // 2) * 2 + 1)
                img[y:y2, x:x2] = cv2.GaussianBlur(roi, (k, k), 0)
            elif method == 'inpaint':
                mask[y:y2, x:x2] = 255
            else:
                avg_color = cv2.mean(roi)[:3]
                img[y:y2, x:x2] = avg_color
        if method == 'inpaint':
            # Slightly dilate to cover edges
            kernel = np.ones((3,3), np.uint8)
            dilated = cv2.dilate(mask, kernel, iterations=1)
            inpainted = cv2.inpaint(img, dilated, 3, cv2.INPAINT_TELEA)
            return Image.fromarray(inpainted)
        return Image.fromarray(img)
    except Exception as e:
        logger.error(f'erase_text_regions error: {e}')
        return image


# --- Helpers for Canva-like text reconstruction ---
def group_words_into_lines(words, y_tolerance_ratio: float = 0.5):
    """Group OCR word boxes into lines based on vertical proximity.

    Returns list of lines, each line is a list of word dicts sorted by x.
    """
    if not words:
        return []
    lines = []
    for word in words:
        bbox = word.get('bbox', {})
        y = bbox.get('y', 0)
        h = max(1, bbox.get('height', 1))
        tol = h * y_tolerance_ratio
        placed = False
        for line in lines:
            base_y = line[0].get('bbox', {}).get('y', 0)
            if abs(y - base_y) <= tol:
                line.append(word)
                placed = True
                break
        if not placed:
            lines.append([word])
    # sort words within lines and sort lines by y
    for line in lines:
        line.sort(key=lambda w: w.get('bbox', {}).get('x', 0))
    lines.sort(key=lambda l: l[0].get('bbox', {}).get('y', 0))
    return lines


def estimate_text_color_near_bbox(image: Image.Image, bbox: dict) -> str:
    """Estimate foreground text color by sampling inside bbox and around edges.

    Returns hex color string.
    """
    try:
        img = np.array(image.convert('RGB'))
        h, w, _ = img.shape
        x = int(max(0, bbox.get('x', 0)))
        y = int(max(0, bbox.get('y', 0)))
        bw = int(max(1, bbox.get('width', 1)))
        bh = int(max(1, bbox.get('height', 1)))
        x2 = min(w, x + bw)
        y2 = min(h, y + bh)
        # core region (likely text)
        core = img[y:y2, x:x2]
        if core.size == 0:
            return '#000000'
        # Use median to be robust
        med = np.median(core.reshape(-1, 3), axis=0)
        r, g, b = int(med[0]), int(med[1]), int(med[2])
        return '#%02x%02x%02x' % (r, g, b)
    except Exception:
        return '#000000'


def build_fabric_text_objects_from_lines(image: Image.Image, lines):
    """Create Fabric.js-ready textbox objects for each line with styling."""
    objects = []
    for line in lines:
        if not line:
            continue
        text = ' '.join([w.get('text', '') for w in line]).strip()
        if not text:
            continue
        first = line[0]['bbox']
        last = line[-1]['bbox']
        min_x = int(first.get('x', 0))
        max_x = int(last.get('x', 0) + last.get('width', 0))
        min_y = int(min(w['bbox'].get('y', 0) for w in line))
        max_h = int(max(w['bbox'].get('height', 16) for w in line))
        font_size = max(12, int(round(max_h * 0.9)))
        # estimate color from the combined line bbox
        color = estimate_text_color_near_bbox(image, {
            'x': min_x,
            'y': min_y,
            'width': max(1, max_x - min_x),
            'height': max_h
        })
        objects.append({
            'type': 'textbox',
            'text': text,
            'left': min_x,
            'top': min_y,
            'width': max(60, max_x - min_x),
            'fontSize': font_size,
            'fill': color,
            'fontFamily': 'Arial',
            'name': f'Text: {text[:30]}'
        })
    return objects


# --- Document rectification (perspective correction) ---
def _order_quad_points(pts: np.ndarray) -> np.ndarray:
    # pts shape (4,2)
    rect = np.zeros((4, 2), dtype='float32')
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]  # top-left
    rect[2] = pts[np.argmax(s)]  # bottom-right
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]  # top-right
    rect[3] = pts[np.argmax(diff)]  # bottom-left
    return rect


def detect_document_quad(image: Image.Image):
    """Detect a 4-point contour for the main document/page if present.
    Returns (quad_pts or None).
    """
    try:
        img = np.array(image.convert('RGB'))
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        gray = cv2.GaussianBlur(gray, (5, 5), 0)
        edges = cv2.Canny(gray, 50, 150)
        edges = cv2.dilate(edges, np.ones((3, 3), np.uint8), iterations=1)
        contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
        h, w = gray.shape
        page_area = h * w
        best = None
        best_area = 0
        for cnt in contours:
            peri = cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, 0.02 * peri, True)
            if len(approx) == 4 and cv2.isContourConvex(approx):
                area = cv2.contourArea(approx)
                if area > 0.2 * page_area and area > best_area:
                    best = approx.reshape(-1, 2)
                    best_area = area
        if best is None:
            return None
        return _order_quad_points(best)
    except Exception as e:
        logger.warning(f'detect_document_quad failed: {e}')
        return None


def rectify_image_for_ocr(image: Image.Image):
    """If a document quad is detected, warp to a rectified top-down view.
    Returns (rectified_image, H, H_inv). If not possible, returns (image, None, None).
    """
    quad = detect_document_quad(image)
    if quad is None:
        return image, None, None
    try:
        img = np.array(image.convert('RGB'))
        (tl, tr, br, bl) = quad
        width_top = np.linalg.norm(tr - tl)
        width_bottom = np.linalg.norm(br - bl)
        max_width = int(max(width_top, width_bottom))
        height_left = np.linalg.norm(bl - tl)
        height_right = np.linalg.norm(br - tr)
        max_height = int(max(height_left, height_right))
        dst = np.array([[0, 0], [max_width - 1, 0], [max_width - 1, max_height - 1], [0, max_height - 1]], dtype='float32')
        H = cv2.getPerspectiveTransform(quad.astype('float32'), dst)
        warped = cv2.warpPerspective(img, H, (max_width, max_height), flags=cv2.INTER_CUBIC)
        H_inv = np.linalg.inv(H)
        return Image.fromarray(warped), H, H_inv
    except Exception as e:
        logger.warning(f'rectify_image_for_ocr failed: {e}')
        return image, None, None


def _apply_homography_to_bbox(bbox: dict, H_inv: np.ndarray) -> dict:
    """Map a rectified bbox back to original image using inverse homography.
    We map 4 corners then return a tight axis-aligned box.
    """
    x = bbox.get('x', 0)
    y = bbox.get('y', 0)
    w = bbox.get('width', 1)
    h = bbox.get('height', 1)
    pts = np.array([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], dtype='float32').reshape(-1, 1, 2)
    mapped = cv2.perspectiveTransform(pts, H_inv).reshape(-1, 2)
    min_x = int(np.clip(np.min(mapped[:, 0]), 0, None))
    min_y = int(np.clip(np.min(mapped[:, 1]), 0, None))
    max_x = int(np.clip(np.max(mapped[:, 0]), 0, None))
    max_y = int(np.clip(np.max(mapped[:, 1]), 0, None))
    return {'x': min_x, 'y': min_y, 'width': max(1, max_x - min_x), 'height': max(1, max_y - min_y)}


def ocr_with_rectification(image: Image.Image, tesseract_available: bool):
    """Run OCR on a rectified view (if possible) and map results back.
    Returns dict with 'words' and 'full_text'.
    """
    rectified, H, H_inv = rectify_image_for_ocr(image)
    data = extract_text_with_ocr(rectified, tesseract_available)
    if H_inv is None:
        return data, None, None
    # Map each bbox back
    mapped_words = []
    for w in data.get('words', []):
        bbox = _apply_homography_to_bbox(w.get('bbox', {}), H_inv)
        mapped_words.append({
            'text': w.get('text', ''),
            'confidence': w.get('confidence', 0),
            'bbox': bbox
        })
    return {'words': mapped_words, 'full_text': data.get('full_text', '')}, H, H_inv