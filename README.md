
# Lemme Learn More

**Lemme Learn More** is a web application designed to help students efficiently digest information in an engaging manner. The platform provides three modules (APIs) that take a PDF upload from the user, summarizing the content in creative ways. This is especially targeted at students with limited time to learn a lot of things and aims to make learning more digestible.

## Modules

### 1. Podcast Generator
This module converts the PDF into an engaging podcast. It extracts text using `pypdf2` and utilizes the OpenAI Chat Completions API to create a podcast-like transcript featuring an interesting conversation between guests. The final output is synthesized using Google Text-to-Speech (TTS) and provided as an MP3 file to the user.

### 2. YT Shorts/Reels/TikTok Generator
This module generates short, trendy video clips summarizing the PDF content. Text is extracted using the `pymupdf4llm` library, broken into 2-second chunks, and embedded into a dynamic video background. This "brain rot" content taps into the short attention span of younger generations, turning educational material into engaging, fast-paced clips.

### 3. Flashcards Generator
The flashcard generator extracts key information from the PDF and generates a JSON file of flashcards using OpenAI's Chat Completions API. The frontend (built in React) then renders these as interactive flashcards for studying.

## Technologies Used

- **Frontend:** React.js
- **Backend:** Flask
- **APIs/Libraries:**
  - `pypdf2` (for PDF text extraction)
  - OpenAI Chat Completions API (for text generation)
  - Google TTS (for text-to-speech)
  - `pymupdf4llm` (for extracting summarized data from PDFs)
  - `moviepy` (for video generation)

## Getting Started

### Prerequisites

- **Frontend:**
  - You will need Node.js and npm to run the frontend.

- **Backend:**
  - You will need Python 3.8+, ImageMagick, and FFmpeg installed on your system. You can refer to their official documentation for installation instructions.
  
### Installation

#### Frontend:
1. Navigate to the `frontend` directory.
2. Install the required packages:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run start
   ```

#### Backend:
1. Navigate to the `backend` directory.
2. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask app:
   ```bash
   python3 app.py
   ```

If the Flask app doesn’t start, you may be missing some packages. Feel free to open an issue or contribute.

### Known Issues

- **MoviePy Policy Error:**
  If you encounter an error related to MoviePy, such as `policy not allowed "@*"`, you will need to edit the `policy.xml` file in the ImageMagick installation directory. Simply comment out the line containing `@*`.

- **ImageMagick Dependency:**
  Remember that MoviePy requires ImageMagick to be installed on your system. 

### Fetch.ai integration

The repository has attempted to create fetch.ai AI Agent and connect with mailbox. Sure, it works on the Alpana testnet, but we have not deployed it to main chain. It is for POC purpose and fetch.ai agentverse fit our use case properly.

## Contributions

We welcome contributions! If you'd like to improve this project, feel free to open a pull request or submit an issue.

---

Once both the frontend and backend are running, you can explore and interact with the platform to generate podcasts, videos, and flashcards from your PDFs.

