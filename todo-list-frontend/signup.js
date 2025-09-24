const signupForm = document.getElementById('signup-form');
const submitButton = document.getElementById('submit-button');
const errorMessageDiv = document.getElementById('error-message');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');

const API_URL = 'http://localhost:5000/api/auth/signup';

// --- UI Helper Functions ---

/**
 * Shows or hides the loading spinner on the button.
 * @param {boolean} isLoading - Whether to show the loader.
 */
function showLoading(isLoading) {
    if (isLoading) {
        submitButton.disabled = true;
        submitButton.classList.add('loading');
    } else {
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    }
}

/**
 * Displays an error message in the error box.
 * @param {string|null} message - The message to display, or null to hide.
 */
function showErrorMessage(message) {
    if (message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.classList.add('show');
    } else {
        errorMessageDiv.classList.remove('show');
    }
}

// --- Form Submission Logic ---

signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // Reset UI state on new submission
    showLoading(true);
    showErrorMessage(null);

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // On successful signup, redirect to the login page
            alert('Signup successful! Please log in.');
            window.location.href = '/login.html'; 
        } else {
            // Handle server-side errors (e.g., user exists, validation)
            const message = data.errors ? data.errors.map(err => err.msg).join(', ') : data.message;
            showErrorMessage(message);
        }
    } catch (error) {
        // Handle network errors
        console.error('Signup error:', error);
        showErrorMessage('A network error occurred. Please try again.');
    } finally {
        // Always stop the loader
        showLoading(false);
    }
});