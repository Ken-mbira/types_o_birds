from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from fastbook import *

ALLOWED_FILE_EXTENSIONS = ['jpg', 'jpeg', 'png']

app = Flask(__name__)
CORS(app, resources={'/*': {'origins': 'http://localhost:5500'}})

# Load your custom model (for now, just assuming it's loaded)
try:
    learn_inf = load_learner('model.pkl')
except FileNotFoundError:
    app.logger.error("No trained model found. Please train and save the model to 'model.pkl'")
    exit(1)

@app.route('/', methods=['GET'])
@cross_origin(origins=['*'])
def hello_world():
    return "Hello World!"

@app.route('/post-image', methods=['POST'])
@cross_origin(origins=['*'])
def post_image():
    # Get the uploaded file
    file = request.files.get('file')

    # Check if a file was uploaded
    if not file:
        return jsonify({'error': 'No file provided'}), 400

    # Validate the file type
    extension = file.filename.split('.')[-1]
    if extension.lower() not in ALLOWED_FILE_EXTENSIONS:
        return jsonify({'error': f'Only {", ".join(ALLOWED_FILE_EXTENSIONS)} images are allowed'}), 400

    # Save the image to a temporary location
    temp_dir = '/tmp/'
    img_file = f'{temp_dir}{file.filename}'
    file.save(img_file)

    try:
        pred, pred_idx, probs = learn_inf.predict(img_file)

        return jsonify({
            'result': pred,
            'probability': float(probs[pred_idx])
        })

    except Exception as e:
        app.logger.error(f"Error processing image: {e}")
        return jsonify({'error': 'Failed to process the image'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)