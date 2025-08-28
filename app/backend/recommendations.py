import os
from dotenv import load_dotenv
from inference import predict_emotion
from langchain_community.llms import Cohere
from langchain.prompts import PromptTemplate
import warnings

warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=DeprecationWarning)


load_dotenv()


class MentalHealthRecommendationSystem:
    def __init__(self, cohere_api_key: str):
        self.llm = Cohere(cohere_api_key=cohere_api_key, temperature=0.6)

        self.prompt_template = PromptTemplate(
            input_variables=[
                "input_text",
                "prediction",
                "probabilities",
                "response_type",
            ],
            template="""
User input: "{input_text}"
System analysis:
- Predicted emotion/mental state: {prediction}
- Model confidence: {probabilities}

Now act as a supportive mental health assistant.
Provide:
{response_type}

Keep response short, empathetic, and actionable.
If suggesting a helpline, include the Indian helpline (Vandrevala Foundation: 9999 666 555).
""",
        )

        self.chain = self.prompt_template | self.llm

    def generate_response(self, user_text: str) -> dict:
        """Run model inference + generate GenAI recommendations"""
        result = predict_emotion(user_text)

        prediction_text = "Depressed" if result["prediction"] == 1 else "Not Depressed"

        if result["prediction"] == 1:

            response_type = """- A short empathetic note
- 2 simple grounding or coping techniques (like deep breathing, journaling)
- A reminder that help is available with the Indian helpline: Vandrevala Foundation: 9999 666 555"""
        else:

            response_type = "- A short positive and encouraging message."

        ai_response = self.chain.invoke(
            {
                "input_text": result["input"],
                "prediction": prediction_text,
                "probabilities": result["probabilities"],
                "response_type": response_type,
            }
        )

        return {
            "model_analysis": result,
            "ai_response": ai_response.strip(),
        }


# if __name__ == "__main__":
#     API_KEY = os.getenv("COHERE_API_KEY")
#     if not API_KEY:
#         print("Error: COHERE_API_KEY not found in .env file")
#         exit()

#     system = MentalHealthRecommendationSystem(API_KEY)

#     depressed_case = "I feel hopeless and sad all the time."
#     not_depressed_case = "I'm feeling good and motivated today!"

#     print("\n=== DEPRESSED CASE (high conf) ===")
#     print(system.generate_response(depressed_case)["ai_response"])

#     print("\n=== NOT DEPRESSED CASE ===")
#     print(system.generate_response(not_depressed_case)["ai_response"])
