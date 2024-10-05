import PyPDF2
import openai
import json

api_key = "sk-CMEqONGTbQgU3S4BpLi4__jWZ-dwFKbJ7BUNPbum8VT3BlbkFJFAYZhJx7Kykn-UstMavLiE_WPBv99w41lXR35_sJ8A"
client = openai.OpenAI(api_key=api_key)
model_name = "gpt-4o-mini"

upload_file = "notes.pdf"

def extract_text_from_pdf(pdf_path):
    # Open and read the PDF file
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text



def generate_questions_and_answers(text):
    # Use OpenAI API to generate Q&A from the text
    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": "You are a helpful assistant who creates questions and answers from the provided text and convert it into json. If its a research paper focus on generating questions and answers based on the key findings, methods, and future work of the research paper, If its a classroom notes focus on generating student-friendly questions and answers from the classroom notes and for others and all focus on generating engaging and meaningful question and answers from provided text and convert into json.The key in the json should be 'flashcards'. Please provide key id as well."},
             
            {"role": "user", "content": f"Generate questions and answers from the following text:\n\n{text} and convert it into json"}
        ],
        temperature=0.7,
        response_format={ "type": "json_object" }
    )
    
    # Extract Q&A pairs from the response
    completion = response.choices[0].message.content
    print(completion)
    return completion

def save_json_to_file(json_data, output_file_path):
    # Write the JSON data to a file
    with open(output_file_path, 'w') as json_file:
        json_file.write(json_data)
        # json.dump(json_data, json_file)
    print(f"JSON data successfully saved to {output_file_path}")






if __name__ == "__main__":
    text = extract_text_from_pdf(upload_file)
    q_and_a_text = generate_questions_and_answers(text)
    #create_flashcards_json(q_and_a_text, "output.json")
    print("Flashcards JSON file created")
    output_file_path = 'output.json'
    save_json_to_file(q_and_a_text, "output.json")
