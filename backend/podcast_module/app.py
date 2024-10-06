from flask import Flask, request, jsonify
import json
import os
import fitz  
import openai
import glob
from openai import OpenAI
from gtts import gTTS
from pydub import AudioSegment
from pod import extract_text_from_pdf, get_conversation, text_to_speech_gtts
from brainrot import extract_text_from_pdf_brainrot, modify_video, openai_sequence_response
from flash_card_code import extract_text_from_pdf_flashcard, generate_questions_and_answers 

openai.api_key = os.getenv("OPENAI_API_KEY")

client = openai.OpenAI()


app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    """Check if the uploaded file is allowed based on its extension."""
    print("Checking for right extension of the file ...")
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/createPodcast', methods=['POST'])
def upload_file():
    """Handle the file upload and processing."""
    print("Received upload request")  
    
    
    print(f"Request Headers: {request.headers}")
    
    if 'file' not in request.files:
        print("No file part in the request")  
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    print(f"File object received: {file}")  # Log the file object details

    if file.filename == '':
        print("No file selected for uploading")  
        return jsonify({"error": "No file selected for uploading"}), 400

    if file and allowed_file(file.filename):
        # Log the filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        print(f"Saving file to: {file_path}")  
        file.save(file_path)
        fn = file.filename.split('.')[0]

        pdf_files = glob.glob(os.path.join(app.config['UPLOAD_FOLDER'], "*.pdf"))
        text  = extract_text_from_pdf(pdf_files[0])
        conversation_text = get_conversation(text)
        conversation_text = conversation_text.replace("*","")
        print(conversation_text)
        text_to_speech_gtts(conversation_text,output_file=f"../../public/output/audio/{fn}"+".mp3")
        fn = fn+'.mp3'
        prompt_message = f"Generate a JSON object with the following fields: 'fileName'. The fileName should be '{fn}'."
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an assistant that generates structured JSON responses."},
                
                {"role": "user", "content": prompt_message}
            ],
        temperature=0.7,
        response_format={ "type": "json_object" }
        )
        completion = response.choices[0].message.content
        print(completion,type(completion),type(response))
        return completion #response.choices[0].message.content
    else:
        print("File type not allowed")  # Debugging
        return {"error": "Allowed file types are pdf"}


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

@app.route('/createFlashCards', methods=['POST'])
def upload_file3():
    """Handle the file upload and processing."""
    print("[brainrot module] => Received upload request")  
    print(f"Request Headers: {request.headers}")
    
    if 'file' not in request.files:
        print("[brainrot module] => No file part in the request")  
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    print(f"[brainrot module] => File object received: {file}")  # Log the file object details

    if file.filename == '':
        print("[brainrot module] => No file selected for uploading")  
        return jsonify({"error": "No file selected for uploading"}), 400

    if file and allowed_file(file.filename):

        pdf_files = glob.glob(os.path.join(app.config['UPLOAD_FOLDER'], "*.pdf"))
        text  = extract_text_from_pdf_flashcard(pdf_files[0])
        q_and_a_json = generate_questions_and_answers(text)
        return q_and_a_json
        return jsonify({"success": True, "fileName":"output_brainrot.mp4"}), 200
    else:
        print("File type not allowed")  
        return jsonify({"success": False, "error": "Allowed file types are pdf"}), 400


if __name__ == '__main__':
    from flask_cors import CORS
    CORS(app)

    app.run(debug=True,host='0.0.0.0', port=5001)
