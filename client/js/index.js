const registrationForm = document.querySelector('#register-form');
const firstNameInput = document.querySelector('#first-name');
const lastNameInput = document.querySelector('#last-name');
const emailInput = document.querySelector('#email-address');
const passwordInput = document.querySelector('#password');
const confirmPasswordInput = document.querySelector('#confirm-password');

registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let password = passwordInput.value;
    let confirmPassword = confirmPasswordInput.value;

    if(password !== confirmPassword)
    {
        
    }

    let body = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        emailAddress: emailInput.value,
        password: passwordInput.value
    }
})