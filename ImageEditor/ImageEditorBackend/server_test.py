from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from rembg import remove, new_session
from PIL import Image
import io
import logging
import os

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Background Removal API is running"})

@app.route('/remove-bg', methods=['POST'])
def remove_bg():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    try:
        image_file = request.files['image']
        input_image = Image.open(image_file.stream)
        
        if input_image.mode != 'RGBA':
            input_image = input_image.convert('RGBA')
        
        # Use default model for testing
        output_image = remove(input_image)
        
        img_bytes = io.BytesIO()
        output_image.save(img_bytes, format='PNG')
        img_bytes.seek(0)

        return send_file(img_bytes, mimetype='image/png')
        
    except Exception as e:
        logger.error(f'Error: {e}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=False, host='0.0.0.0', port=port)