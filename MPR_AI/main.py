from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai_model.model import train_and_forecast_all
import json
from datetime import date

app = FastAPI(
    title="Food Demand Forecasting API",
    description="Predicts future food demand for canteen dishes using Prophet.",
    version="1.0.0"
)

# Enable CORS so frontend (React/Supabase) can call it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict to your frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "✅ Food Demand Forecasting API running successfully"}

@app.get("/predict")
def predict_demand():
    """Endpoint to train Prophet models and return next 7-day forecast"""
    results = train_and_forecast_all()
    
    # Convert JSON string to Python dict if needed
    if isinstance(results, str):
        results = json.loads(results)
    
    return {"forecast": results}
