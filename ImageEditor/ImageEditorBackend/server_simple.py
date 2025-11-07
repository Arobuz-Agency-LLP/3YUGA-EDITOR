from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Simple Flask server is running"})

@app.route('/test', methods=['GET', 'POST'])
def test():
    return jsonify({"status": "success", "message": "Server is working"})

if __name__ == '__main__':
    logger.info('Starting simple Flask server...')
    app.run(debug=True, host='0.0.0.0', port=5001)