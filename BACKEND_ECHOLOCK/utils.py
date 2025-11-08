import pickle
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC

def load_model():
    try:
        with open('ECHOLOCK.pkl', 'rb') as file:
            model = pickle.load(file)
        print("ECHOLOCK.pkl loaded successfully.")
        return model
    except Exception as e:
        print(f"Error loading new model: {str(e)}")
        return None

def predict_url(model, url_string):
    try:
        # The model is a pipeline, so it takes the raw URL string in a list
        prediction = model.predict([url_string])[0]
        probabilities = model.predict_proba([url_string])[0]
        
        # This model predicts 0 for 'normal' and 1 for 'phishing'
        prediction_label = 'normal' if prediction == 0 else 'phishing'
        
        # Get the confidence of the predicted class
        confidence = probabilities[prediction] * 100
        
        result = {
            'prediction': prediction_label,
            'confidence': round(confidence, 2),
            'probabilities': {
                'normal': round(probabilities[0] * 100, 2),
                'phishing': round(probabilities[1] * 100, 2)
            }
        }
        return result

    except Exception as e:
        print(f"Prediction error with new model: {str(e)}")
        return {'prediction': 'error', 'confidence': 0}