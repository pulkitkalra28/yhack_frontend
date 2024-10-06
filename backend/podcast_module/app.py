from flask import Flask, request, jsonify
import os
import fitz  # PyMuPDF
import openai
import glob
from openai import OpenAI
import openai
from gtts import gTTS
from pydub import AudioSegment
from pod import extract_text_from_pdf, get_conversation, text_to_speech_gtts
from brainrot import extract_text_from_pdf_brainrot, modify_video, openai_sequence_response


openai.api_key = os.getenv("OPENAI_API_KEY")


# Create the Flask app
app = Flask(__name__)

# Define the upload folder and allowed extensions
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create upload directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    """Check if the uploaded file is allowed based on its extension."""
    print("Checking for right extension of the file ...")
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/createPodcast', methods=['POST'])
def upload_file():
    """Handle the file upload and processing."""
    print("Received upload request")  # Log when the endpoint is hit
    
    # Log request headers for debugging
    print(f"Request Headers: {request.headers}")
    
    if 'file' not in request.files:
        print("No file part in the request")  # Debugging
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    print(f"File object received: {file}")  # Log the file object details

    if file.filename == '':
        print("No file selected for uploading")  # Debugging
        return jsonify({"error": "No file selected for uploading"}), 400

    if file and allowed_file(file.filename):
        # Log the filename and save path
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        print(f"Saving file to: {file_path}")  # Debugging
        file.save(file_path)
        fn = file.filename.split('.')[0]

        pdf_files = glob.glob(os.path.join(app.config['UPLOAD_FOLDER'], "*.pdf"))
        text  = extract_text_from_pdf(pdf_files[0])
        conversation_text = get_conversation(text)
        conversation_text = conversation_text.replace("*","")
        print(conversation_text)
        text_to_speech_gtts(conversation_text,output_file=f"../../public/output/audio/{fn}"+".mp3")
        # Return a success message with file details
        return jsonify({"message": f"File {file.filename} successfully uploaded","success":true, "fileName":f"{fn}"+".mp3", "file_path": file_path}), 200
    else:
        print("File type not allowed")  # Debugging
        return jsonify({"error": "Allowed file types are pdf"}), 400


@app.route('/createVideo', methods=['POST'])
def upload_file2():
    """Handle the file upload and processing."""
    print("[brainrot module] => Received upload request")  # Log when the endpoint is hit
    
    # Log request headers for debugging
    print(f"Request Headers: {request.headers}")
    
    if 'file' not in request.files:
        print("[brainrot module] => No file part in the request")  # Debugging
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    print(f"[brainrot module] => File object received: {file}")  # Log the file object details

    if file.filename == '':
        print("[brainrot module] => No file selected for uploading")  # Debugging
        return jsonify({"error": "No file selected for uploading"}), 400

    if file and allowed_file(file.filename):

        pdf_files = glob.glob(os.path.join(app.config['UPLOAD_FOLDER'], "*.pdf"))
        text  = extract_text_from_pdf_brainrot(pdf_files[0])
        captions_for_brainrot = openai_sequence_response(text)
        modify_video(video_file="../brainrot_module/sludge1.mp4", data=captions_for_brainrot,output_file_path="../../public/output/video/output_brainrot.mp4")
        # Return a success message with file details
        return jsonify({"success": True, "fileName":"output_brainrot.mp4"}), 200
    else:
        print("File type not allowed")  # Debugging
        return jsonify({"success": False, "error": "Allowed file types are pdf"}), 400

if __name__ == '__main__':
    # Enable CORS for development purposes
    from flask_cors import CORS
    CORS(app)

    # Run the app with debug mode to see logs
    app.run(debug=True,host='0.0.0.0', port=5000)
