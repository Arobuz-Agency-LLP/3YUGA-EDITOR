from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from rembg import remove, new_session
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Allow requests from your Fabric.js frontend

@app.route('/')
def home():
    return jsonify({"message": "Rembg API is running"})

@app.route('/remove-bg', methods=['POST'])
def remove_bg():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    try:
        image_file = request.files['image']
        input_image = Image.open(image_file.stream)
        
        # Create rembg session
        session = new_session('u2net')
        
        # Remove background
        output_image = remove(input_image, session=session)

        # Save output image to memory
        img_bytes = io.BytesIO()
        output_image.save(img_bytes, format='PNG')
        img_bytes.seek(0)

        # Return the processed image
        return send_file(img_bytes, mimetype='image/png')
        
    except Exception as e:
        return jsonify({'error': f'Failed to process image: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
