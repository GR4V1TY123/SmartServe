import pandas as pd
from prophet import Prophet
import json
import os

def generate_forecast_json(model, future, dish_name):
    # Predict future values
    forecast = model.predict(future)
    selected = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(7)
    selected['weekday'] = selected['ds'].dt.day_name()  # Add weekday name

    result = []
    for _, row in selected.iterrows():
        predicted = round(row['yhat'])
        lower = round(row['yhat_lower'])
        upper = round(row['yhat_upper'])
        buffer = round((upper - predicted) * 0.5)
        recommended = predicted + buffer

        confidence_gap = upper - lower
        if confidence_gap < 15:
            confidence = "high"
        elif confidence_gap < 30:
            confidence = "medium"
        else:
            confidence = "low"

        result.append({
            "dish": dish_name,
            "date": str(row['ds'].date()),
            "weekday": row['weekday'],
            "predicted": predicted,
            "min": lower,
            "max": upper,
            "recommended_servings": recommended,
            "confidence": confidence
        })

    return result


def train_and_forecast_all():
    # --- Safe Path Handling ---
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(BASE_DIR, "canteen_sales_data.csv")

    # --- Load Dataset ---
    data = pd.read_csv(csv_path)
    data.columns = ['dish_name', 'ds', 'y']

    data['ds'] = pd.to_datetime(data['ds'], format="%d-%m-%Y")
    data['day_of_week'] = data['ds'].dt.dayofweek  # 0=Mon, 6=Sun

    dishes = data['dish_name'].unique()
    all_results = []

    for dish in dishes:
        dish_data = data[data['dish_name'] == dish][['ds', 'y', 'day_of_week']]

        if len(dish_data) < 5:
            print(f"Skipping {dish} due to insufficient data...")
            continue

        # --- Prophet Model Setup ---
        model = Prophet()
        model.add_regressor('day_of_week')

        # --- Fit Model ---
        model.fit(dish_data)

        # --- Create future dataframe (next 7 days) ---
        future = model.make_future_dataframe(periods=7)
        future['day_of_week'] = future['ds'].dt.dayofweek

        # --- Generate forecast JSON ---
        result = generate_forecast_json(model, future, dish)
        all_results.extend(result)

    # Return clean JSON output
    return json.dumps(all_results, indent=4)


if __name__ == "__main__":
    output = train_and_forecast_all()
    print(output)
