from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
from inference import predict_emotion
from recommendations import MentalHealthRecommendationSystem
import os

app = Flask(
    __name__,
    template_folder="../frontend/public",
    static_folder="../frontend/public",
    static_url_path="",
)
CORS(app)
rec_system = MentalHealthRecommendationSystem(os.getenv("COHERE_API_KEY", "dummy-key"))


@app.route("/")
def home():
    """Serve the frontend"""
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze_emotion():
    """API endpoint to analyze text and return emotion detection results"""
    try:
        data = request.get_json()

        if not data or "text" not in data:
            return jsonify({"error": "No text provided", "success": False}), 400

        input_text = data["text"].strip()

        if not input_text:
            return jsonify({"error": "Empty text provided", "success": False}), 400

        # Get emotion prediction and AI recommendations
        result = rec_system.generate_response(input_text)

        return jsonify(
            {
                "prediction": result["model_analysis"]["prediction"],
                "confidence": result["model_analysis"]["confidence"],
                "probabilities": result["model_analysis"]["probabilities"],
                "ai_response": result["ai_response"],
            }
        )

    except Exception as e:
        return (
            jsonify({"error": f"Internal server error: {str(e)}", "success": False}),
            500,
        )


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
