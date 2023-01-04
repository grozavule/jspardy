const loginForm = document.querySelector('#login-form');
const registrationForm = document.querySelector('#register-form');
const firstNameInput = document.querySelector('#first-name');
const lastNameInput = document.querySelector('#last-name');
const emailInput = document.querySelector('#email-address');
const passwordInput = document.querySelector('#password');
const confirmPasswordInput = document.querySelector('#confirm-password');

const displayLoginError = message => {
    let container = document.querySelector('#login .titlebar-box-content');

    let messageContainer = document.createElement('div');
    messageContainer.classList.add('error-message');
    messageContainer.textContent = message;

    container.prepend(messageContainer);
}

//handles user login requests
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    let loginEmail = document.querySelector('#login-email').value;
    let loginPassword = document.querySelector('#login-password').value;

    let body = {
        email: loginEmail,
        password: loginPassword
    };

    axios.post(`${BASE_URL}/api/login`, body)
    .then(res => {
        sessionStorage.setItem('user', JSON.stringify(res.data));
        navigateToGame();
    })
    .catch(error => {
        console.log(error);
        displayLoginError(error.response.data);
        //createModalMessage(error.response.data, 'error')
    });
})
//handles user registration requests
registrationForm.addEventListener('submit', e => {
    e.preventDefault();
    let firstName = firstNameInput.value;
    let lastName = lastNameInput.value;
    let emailAddress = emailInput.value;
    let password = passwordInput.value;
    let confirmPassword = confirmPasswordInput.value;

    //verify input
    if(firstName.length <= 0 || lastName.length <=0 || emailAddress.length <=0 || password.length <= 0)
    {
        firstNameInput.classList.add('error');
        lastNameInput.classList.add('error');
        emailInput.classList.add('error');
        passwordInput.classList.add('error');
        confirmPasswordInput.classList.add('error');
        createModalMessage(`All fields are required. Please complete the form.`, `error`);
        return;
    }
    //verify the password was confirmed
    if(password !== confirmPassword)
    {
        passwordInput.classList.add('error');
        confirmPasswordInput.classList.add('error');
        createModalMessage(`Your passwords don't match`, `error`);
        return;
    }

    let body = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        emailAddress: emailInput.value,
        password: passwordInput.value
    }

    axios.post(`${BASE_URL}/api/register`, body)
    .then(res => {
        createModalMessage(res.data, 'info', navigateToGame);
    })
    .catch(error => createModalMessage(error.response.data, 'error'));
})