import os
import fitz  # PyMuPDF
import openai
import glob
from openai import OpenAI
from gtts import gTTS
from pydub import AudioSegment

def extract_text_from_pdf(file_path):
    print('extracting text from pdf')
    doc = fitz.open(file_path)  # Open the PDF file
    text = ""
    for page_num in range(doc.page_count):
        page = doc.load_page(page_num)
        text += page.get_text("text")  # Extract text from each page
    print('text extraction done')
    return text


def get_conversation(text):
    print('converting text to conversational podcast format')
    client = OpenAI()

    prompt = f"""
Convert the following text into a podcast conversation with a host and a guest:

{text}

Format it as a conversation with clearly marked speaker labels such as "Host:" and "Guest:". The content should be an engaging, natural conversation where the host and guest actively exchange ideas, ask thought-provoking questions, express emotions. Eachdialogue turn should be labeled with "Host:" or "Guest:" to clearly identiy the speaker.
"""

    response = client.chat.completions.create(
        model="gpt-4o",  
        messages=[
            {"role": "system", "content": "You are an expert podcast host."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=2048,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    conversation_text = response.choices[0].message.content
    print('conversation text generated')
    return conversation_text


def text_to_speech_gtts(conversation_text, output_file):
    print('TTS Started ...')
    lines = conversation_text.split('\n') # Split the conversation by speaker labels
    podcast_audio = AudioSegment.silent(duration=100)  # Initialize with a short silence
    c = 0
    for line in lines:
        print(f"{c} - processed")
        c+=1
        if line.startswith("Host:"):
            # Convert host lines to audio
            host_text = line.replace("Host:", "").strip()  
            host_tts = gTTS(text=host_text, lang='en')
            host_tts.save("host.mp3")
            host_audio = AudioSegment.from_mp3("host.mp3")
            podcast_audio += host_audio + AudioSegment.silent(duration=500)  # slight pause

        elif line.startswith("Guest:"):
            # Convert guest lines to audio with a different voice/accent
            guest_text = line.replace("Guest:", "").strip()  
            guest_tts = gTTS(text=guest_text, lang='en', tld='co.uk')  # Change accent for guest voice
            guest_tts.save("guest.mp3")
            guest_audio = AudioSegment.from_mp3("guest.mp3")
            podcast_audio += guest_audio + AudioSegment.silent(duration=500)  # slight pause

    podcast_audio.export(output_file, format="mp3")
    print('TTS DONE, File Saved')
    return output_file
