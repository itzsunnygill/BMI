document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bmi-form');
    const resultContainer = document.getElementById('result-container');
    const resultValue = document.getElementById('result-value');
    const resultCategory = document.getElementById('result-category');
    const resultMessage = document.getElementById('result-message');
    const scaleIndicator = document.getElementById('scale-indicator');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const age = parseInt(document.getElementById('age').value);
        const heightInputs = document.getElementById('height').value;
        const weightInputs = document.getElementById('weight').value;
        const gender = document.querySelector('input[name="gender"]:checked');

        if (!gender || isNaN(age)) {
            alert('Please select a gender and enter your age.');
            return;
        }

        const height = parseFloat(heightInputs) / 100; // convert cm to m
        const weight = parseFloat(weightInputs);

        if (height > 0 && weight > 0) {
            const bmi = (weight / (height * height)).toFixed(1);
            displayResult(parseFloat(bmi), gender.value, age);
        } else {
            alert('Please enter valid height and weight values.');
        }
    });

    function displayResult(bmi, genderVal, age) {
        resultContainer.classList.remove('hidden');
        
        // Reset classes
        resultValue.className = 'result-number';
        resultCategory.className = 'result-category';

        resultValue.textContent = bmi;
        let category = '';
        let message = '';
        let percentPos = 0;
        let colorClass = '';

        // Real-life logic adjustments for gender
        let underWeightLimit = genderVal === 'male' ? 20 : 19;
        let normalWeightLimit = genderVal === 'male' ? 25 : 24;
        let overWeightLimit = 30;

        if (bmi < underWeightLimit) {
            category = 'Underweight';
            message = 'You are below the healthy weight range for your gender.';
            colorClass = 'cat-underweight';
        } else if (bmi >= underWeightLimit && bmi < normalWeightLimit) {
            category = 'Normal Weight';
            message = 'You have a healthy body weight for your gender. Great job!';
            colorClass = 'cat-normal';
        } else if (bmi >= normalWeightLimit && bmi < overWeightLimit) {
            category = 'Overweight';
            message = 'You are slightly above the ideal healthy weight range.';
            colorClass = 'cat-overweight';
        } else {
            category = 'Obese';
            message = 'Your weight indicates obesity. It is advisable to consult a healthcare provider.';
            colorClass = 'cat-obese';
        }

        // Apply new classes
        resultValue.classList.add(colorClass);
        resultCategory.classList.add(colorClass);

        // Body Fat Percentage Calculation (Deurenberg Formula)
        const sexInt = genderVal === 'male' ? 1 : 0;
        // Formula: 1.20 × BMI + 0.23 × Age - 10.8 × Sex - 5.4
        let bfp = (1.20 * bmi) + (0.23 * age) - (10.8 * sexInt) - 5.4;
        bfp = Math.max(5, Math.min(60, bfp)); // clamp between 5% and 60% for sanity

        resultCategory.textContent = category;
        resultMessage.innerHTML = `${message}<br><br><span style="color:var(--primary-color);font-weight:600;">Est. Body Fat: ~${bfp.toFixed(1)}%</span>`;

        // Visual hack for linear gradient matching
        if(bmi < underWeightLimit) {
            percentPos = (bmi / underWeightLimit) * 20; 
        } else if(bmi < normalWeightLimit) {
            percentPos = 20 + ((bmi-underWeightLimit)/(normalWeightLimit-underWeightLimit)) * 30; 
        } else if(bmi < overWeightLimit) {
            percentPos = 50 + ((bmi-normalWeightLimit)/(overWeightLimit-normalWeightLimit)) * 30; 
        } else {
            percentPos = 80 + Math.min((bmi-overWeightLimit)/10, 1) * 20; 
        }
        
        percentPos = Math.max(0, Math.min(100, percentPos)); // Clamp
        
        // Delay for animation effect
        setTimeout(() => {
            scaleIndicator.style.left = `${percentPos}%`;
        }, 100);
    }
});