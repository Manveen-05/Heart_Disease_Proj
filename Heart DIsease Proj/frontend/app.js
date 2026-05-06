// Update range slider display values
function updateValue(id, val) {
    document.getElementById(id + '-val').textContent = val;
}

// Generate background particles
function createParticles() {
    const container = document.body;
    for (let i = 0; i < 40; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // Random size between 0.2vw and 1vw
        const size = (Math.random() * 0.8 + 0.2) + 'vw';
        // Random horizontal start and end positions
        const leftIni = (Math.random() * 20 - 10) + 'vw';
        const leftEnd = (Math.random() * 20 - 10) + 'vw';
        const left = Math.random() * 100 + 'vw';
        // Random animation duration between 10s and 25s
        const animDuration = (10 + Math.random() * 15) + 's';
        // Random animation delay
        const animDelay = '-' + (Math.random() * 10) + 's';
        
        // Sometimes make them white instead of primary for variety
        if (Math.random() > 0.7) {
            snowflake.style.background = 'white';
            snowflake.style.opacity = '0.1';
            snowflake.style.boxShadow = 'none';
        }
        
        snowflake.style.setProperty('--size', size);
        snowflake.style.setProperty('--left-ini', leftIni);
        snowflake.style.setProperty('--left-end', leftEnd);
        snowflake.style.left = left;
        snowflake.style.animation = `snowfall ${animDuration} linear infinite`;
        snowflake.style.animationDelay = animDelay;
        
        // Add slight blur to some for depth
        if (i % 5 === 0) {
            snowflake.style.filter = 'blur(2px)';
        }
        
        container.appendChild(snowflake);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    
    const form = document.getElementById('predictionForm');
    const predictBtn = document.getElementById('predictBtn');
    const btnText = predictBtn.querySelector('.btn-text');
    const btnLoader = document.getElementById('btnLoader');
    
    const resultCard = document.getElementById('resultCard');
    const closeResultBtn = document.getElementById('closeResultBtn');
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultDesc = document.getElementById('resultDesc');

    // Close Result Card
    closeResultBtn.addEventListener('click', () => {
        resultCard.classList.add('hidden');
        form.style.display = 'block';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Collect Data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Prepare raw_input matching the Python dictionary structure seen in the user's code
        const raw_input = {
            'Age': parseFloat(data.age),
            'RestingBP': parseFloat(data.resting_bp),
            'Cholesterol': parseFloat(data.cholesterol),
            'FastingBS': parseInt(data.fasting_bs),
            'MaxHR': parseFloat(data.max_hr),
            'Oldpeak': parseFloat(data.oldpeak),
            [`Sex_${data.sex}`]: 1,
            [`ChestPainType_${data.chest_pain}`]: 1,
            [`RestingECG_${data.resting_ecg}`]: 1,
            [`ExerciseAngina_${data.exercise_angina}`]: 1,
            [`ST_Slope_${data.st_slope}`]: 1
        };

        console.log("Prepared Data for Backend:", raw_input);

        // 2. Show Loading State
        btnText.textContent = 'Processing...';
        btnLoader.classList.remove('hidden');
        predictBtn.disabled = true;

        // Simulate API call to backend
        try {
            // In a real app, you would do:
            // const response = await fetch('http://localhost:8000/predict', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(raw_input)
            // });
            // const result = await response.json();

            // Mock waiting time for ML prediction
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock random result for demonstration
            const riskScore = Math.random();
            const hasDisease = riskScore > 0.5;

            // 3. Show Result
            form.style.display = 'none';
            resultCard.classList.remove('hidden');

            if (hasDisease) {
                resultIcon.className = 'status-icon status-high';
                resultIcon.innerHTML = '⚠️';
                resultTitle.textContent = 'High Risk Detected';
                resultTitle.style.color = 'var(--danger)';
                resultDesc.textContent = `Based on the provided data, the model indicates a higher risk of heart disease. Please consult a healthcare professional. (Confidence: ${(riskScore * 100).toFixed(1)}%)`;
            } else {
                resultIcon.className = 'status-icon status-low';
                resultIcon.innerHTML = '✅';
                resultTitle.textContent = 'Low Risk';
                resultTitle.style.color = 'var(--success)';
                resultDesc.textContent = `The model indicates a lower risk of heart disease based on the provided data. Keep up the healthy lifestyle! (Confidence: ${((1-riskScore) * 100).toFixed(1)}%)`;
            }

        } catch (error) {
            console.error('Error during prediction:', error);
            alert('An error occurred while making the prediction. Please try again.');
        } finally {
            // Reset Button State
            btnText.textContent = 'Run Prediction';
            btnLoader.classList.add('hidden');
            predictBtn.disabled = false;
        }
    });
});
