# transformer-mental-risk
A hybrid transformer-based framework for early detection of mental health risks from social media text. Combines contextual embeddings (BERT, RoBERTa) with traditional classifiers (Random Forest, LR) to classify emotional states like depression and anxiety. Includes severity assessment and personalized resource recommendations using generative AI.
## Features

- **Mental Health Classification**: Detects depression vs normal emotional states
- **Confidence Scoring**: Provides prediction confidence levels
- **AI-Powered Recommendations**: Generates personalized mental health resources using Cohere API
- **Web Interface**: Clean, responsive UI for text analysis
- **Real-time Analysis**: Instant emotion detection and recommendations

## Tech Stack

- **Backend**: Flask, Python
- **ML Models**: BERT embeddings, Random Forest, SVM
- **AI Integration**: Cohere API for recommendations
- **Frontend**: HTML, CSS, JavaScript
- **Dependencies**: sentence-transformers, scikit-learn, nltk

## Setup

1. **Clone repository**
```bash
git clone <repo-url>
cd transformer-mental-risk
```
2. **Create virtual environment**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```
3. **Install dependencies**
```bash
pip install -r requirements.txt
```
4. **Set environment variables**
```bash
# Create .env file
COHERE_API_KEY=your_cohere_api_key_here
```
5. **Run application**
```bash
cd app/backend
python app.py
```
6. **Access application**
```bash
 Open http://localhost:5000 in your browser
```
##Usage:
-Enter text in the input field

-Click "Analyze Mental State"

-View emotional state classification

-Read AI-generated recommendations

##Models
Text Preprocessing: NLTK tokenization, stemming, stopword removal

Feature Extraction: BERT embedding(All-MiniLM-L6-v2) + Random Forest 

Classification: Final Classifier ensemble

Output: Binary classification (0=Normal,1=Depression) with confidence scores

##API Endpoints:

GET / - Serve web interface

POST /analyze - Analyze text and return results

GET /health - Health check endpoint

##License
MIT License
