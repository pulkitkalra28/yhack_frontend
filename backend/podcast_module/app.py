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

        pdf_files = glob.glob(os.path.join(app.config['UPLOAD_FOLDER'], "*.pdf"))
        text  = extract_text_from_pdf(pdf_files[0])
        conversation_text = get_conversation(text)
        conversation_text = conversation_text.replace("*","")
        print(conversation_text)
        text_to_speech_gtts(conversation_text,output_file='output/pod.mp3')
        # Return a success message with file details
        return jsonify({"message": f"File {file.filename} successfully uploaded", "file_path": file_path}), 200
    else:
        print("File type not allowed")  # Debugging
        return jsonify({"error": "Allowed file types are pdf"}), 400


#def extract_text_from_pdf(file_path):
#    print('extracting text from pdf')
#    doc = fitz.open(file_path)  # Open the PDF file
#    text = ""
#    for page_num in range(doc.page_count):
#        page = doc.load_page(page_num)
#        text += page.get_text("text")  # Extract text from each page
#    print('text extraction done')
#    return text


#def get_conversation(text):
#    print('converting text to conversational podcast format')
#    client = OpenAI()
#
#    prompt = f"""
#Convert the following text into a podcast conversation with a host and a guest:
#
#{text}

#Format it as a conversation with clearly marked speaker labels such as "Host:" and "Guest:".
#"""
#
#    # Correctly formatted API call
#    response = client.chat.completions.create(
#        model="gpt-4o",  # Use "gpt-4" or another model you have access to
#        messages=[
#            {"role": "system", "content": "You are an expert podcast host."},
#            {"role": "user", "content": prompt}
#        ],
#        temperature=0.7,
#        max_tokens=2048,
#        top_p=1,
#        frequency_penalty=0,
#        presence_penalty=0
#    )
#    conversation_text = response.choices[0].message.content  
#    print('conversation text generated')
#    return conversation_text

#def text_to_speech_gtts(conversation_text, output_file="output.mp3"):
#    print('TTS Started ...')
#    # Split the conversation by speaker labels
#    lines = conversation_text.split('\n')
#    podcast_audio = AudioSegment.silent(duration=100)  # Initialize with a short silence
#    c = 0
#    for line in lines:
#        print(f"{c} - processed")
#        c+=1
#        if line.startswith("Host:"):
#            # Convert host lines to audio
#            host_text = line.replace("Host:", "").strip()  # Clean up the label
#            host_tts = gTTS(text=host_text, lang='en')
#            host_tts.save("host.mp3")
#            host_audio = AudioSegment.from_mp3("host.mp3")
#            podcast_audio += host_audio + AudioSegment.silent(duration=500)  # Add slight pause
#
#        elif line.startswith("Guest:"):
#            # Convert guest lines to audio with a different voice/accent
#            guest_text = line.replace("Guest:", "").strip()  # Clean up the label
#            guest_tts = gTTS(text=guest_text, lang='en', tld='co.uk')  # Change accent
#            guest_tts.save("guest.mp3")
#            guest_audio = AudioSegment.from_mp3("guest.mp3")
#            podcast_audio += guest_audio + AudioSegment.silent(duration=500)  # Add slight pause

#    podcast_audio.export(output_file, format="mp3")
#    print('TTS DONE, File Saved')
#    # Clean up temporary files
#    return output_file

if __name__ == '__main__':
    # Enable CORS for development purposes
    from flask_cors import CORS
    CORS(app)

    # Run the app with debug mode to see logs
    app.run(debug=True,host='0.0.0.0', port=5000)
