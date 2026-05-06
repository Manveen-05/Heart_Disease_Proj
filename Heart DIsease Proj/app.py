import os
import sys
import subprocess

# Dynamically install required packages if they are missing
try:
    import streamlit as st
    import pandas as pd
    import numpy as np
    import joblib
    import sklearn
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "streamlit", "pandas", "numpy", "scikit-learn", "joblib"])
    import streamlit as st
    import pandas as pd
    import numpy as np
    import joblib
import pickle
import pandas as pd
import numpy as np
import joblib

# Load the models using joblib
model = joblib.load("KNN_heart.pkl")
scaler = joblib.load("scaler.pkl")
features = joblib.load("features.pkl")

st.title("Heart Disease Prediction App")
st.write("Enter the following details to predict the presence of heart disease.")

# Input fields
col1, col2 = st.columns(2)

with col1:
    age = st.number_input("Age", min_value=1, max_value=120, value=50)
    cp = st.selectbox("Chest Pain Type (cp)", options=[0, 1, 2, 3])
    chol = st.number_input("Serum Cholestoral in mg/dl (chol)", min_value=100, max_value=600, value=200)
    restecg = st.selectbox("Resting Electrocardiographic Results (restecg)", options=[0, 1, 2])
    exang = st.selectbox("Exercise Induced Angina (exang)", options=[0, 1], format_func=lambda x: "Yes (1)" if x == 1 else "No (0)")
    slope = st.selectbox("Slope of the peak exercise ST segment (slope)", options=[0, 1, 2])
    thal = st.selectbox("Thal", options=[0, 1, 2, 3])

with col2:
    sex = st.selectbox("Sex", options=[0, 1], format_func=lambda x: "Male (1)" if x == 1 else "Female (0)")
    trestbps = st.number_input("Resting Blood Pressure (trestbps)", min_value=50, max_value=250, value=120)
    fbs = st.selectbox("Fasting Blood Sugar > 120 mg/dl (fbs)", options=[0, 1], format_func=lambda x: "Yes (1)" if x == 1 else "No (0)")
    thalach = st.number_input("Maximum Heart Rate Achieved (thalach)", min_value=60, max_value=250, value=150)
    oldpeak = st.number_input("ST depression induced by exercise (oldpeak)", min_value=0.0, max_value=10.0, value=1.0, step=0.1)
    ca = st.selectbox("Number of major vessels (ca)", options=[0, 1, 2, 3, 4])

if st.button("Predict"):
    input_data = pd.DataFrame([[age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal]], columns=features)
    
    try:
        scaled_data = scaler.transform(input_data)
        prediction = model.predict(scaled_data)
        
        st.subheader("Results")
        if prediction[0] == 1:
            st.error("Prediction: The model predicts a **high risk** of Heart Disease.")
        else:
            st.success("Prediction: The model predicts a **low risk** of Heart Disease.")
    except Exception as e:
        st.error(f"An error occurred during prediction: {e}")
