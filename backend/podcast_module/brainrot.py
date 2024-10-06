import pymupdf4llm
import traceback
from openai import OpenAI
from moviepy.editor import *

model_name = "gpt-4o-mini"
client = OpenAI()

# Function to split the long string into chunks of 5 words
def split_text_into_chunks(text, chunk_size=5):
    words = text.split()
    return [' '.join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]

# Function to format each chunk into 3 lines
def format_chunk_into_lines(chunk, line_length=3):
    words = chunk.split()
    lines = [' '.join(words[i:i + line_length]) for i in range(0, len(words), line_length)]
    return '\n'.join(lines)


def modify_video(video_file, data,output_file_path):
    # Split the text into chunks of 5 words each
    text_chunks = split_text_into_chunks(data, chunk_size=5)
    formatted_chunks = [format_chunk_into_lines(chunk, line_length=2) for chunk in text_chunks]

    # Load the video
    video = VideoFileClip(video_file)

    # Create text clips for each chunk
    text_clips = []
    duration_per_chunk = 2  # Duration for each text chunk (in seconds)
    for i, chunk in enumerate(formatted_chunks):
        txt_clip_shadow = TextClip(chunk, fontsize=30, color='black', font="Arial-Bold") \
            .set_duration(duration_per_chunk) \
            .set_position(('center', 'center'))  # Position the shadow at the center

        txt_clip = TextClip(chunk, fontsize=30, color='green', font="Arial-Bold") \
            .set_duration(duration_per_chunk) \
            .set_position(lambda t: ('center', video.h // 1 - 5))  # Adjust the main text slightly above the shadow

        # Set the start time for each clip
        txt_clip = txt_clip.set_start(i * duration_per_chunk)
        txt_clip_shadow = txt_clip_shadow.set_start(i * duration_per_chunk)

        # Add both shadow and main text clip to the list
        text_clips.append(txt_clip_shadow)
        text_clips.append(txt_clip)

    # Calculate the total duration required for the video based on the number of text chunks
    total_duration = len(formatted_chunks) * duration_per_chunk

    video = video.subclip(0, total_duration)

    final_clip = CompositeVideoClip([video] + text_clips)


    final_clip.write_videofile(output_file_path, fps=video.fps)

def openai_sequence_response(extracted_text):
    prompt_list = [
                    {"role": "system", "content": "You are a teacher with capabilities to make young students learn in a concise manner."},
                    
                    {"role": "system", "content": "Please read and go through the notes given below and try to summarize it. It should not be more than 100-120 words and must contain all that's needed to know - key takeaways. Make it easy to understand and interesting."}
                ]
    prompt_list.append(
        {"role": "user", "content":extracted_text}
    )
    try:
        response = client.chat.completions.create(
            model=model_name,
            messages=prompt_list
        )

        response_text = response.choices[0].message.content
        return response_text

    except Exception as e:
        print(f"Error generating text: {e}")
        print(traceback.format_exc())
        return None

def extract_text_from_pdf_brainrot(pdf_file):
    return pymupdf4llm.to_markdown(pdf_file)

  

"""
if __name__ == "__main__":
    print("hello")
    pdf_file = "notes.pdf"
    video_file = "sludge1.mp4"
    #md_text = pymupdf4llm.to_markdown(pdf_file)
    #add_prompt(md_text)
    #api_response = openai_sequence_response()
    #print(api_response)

    api_response="Moore's Law, proposed by Gordon Moore in 1965, predicts that the number of components in integrated circuits (ICs) will double approximately every two years, fostering the semiconductor industry's exponential growth. This observation, based on early data, has driven innovation and consumer expectations for faster, cheaper technology. The invention of the transistor and advancements in production techniques, like planar technology, enable this miniaturization. Despite discussions around its eventual limits due to physics and economics, Moore's Law remains a powerful metaphor for technological progress across industries, indicating human ingenuity's role in continuous improvement. The future may still offer remarkable capabilities, potentially extending the Law’s impact through emerging technologies and partnerships."
    modify_video(video_file=video_file, data=api_response)
"""

    

