const loginForm = document.querySelector('#login-form');
const registrationForm = document.querySelector('#register-form');
const firstNameInput = document.querySelector('#first-name');
const lastNameInput = document.querySelector('#last-name');
const emailInput = document.querySelector('#email-address');
const passwordInput = document.querySelector('#password');
const confirmPasswordInput = document.querySelector('#confirm-password');

const displayAuthMessage = (message, messageType, authType) => {
    if(authType === 'login')
    {
        var container = document.querySelector('#login .titlebar-box-content');
    }
    else if(authType === 'registration')
    {
        var container = document.querySelector('#registration .titlebar-box-content');
    }
    else
    {
        console.log(authType, 'not defined');
    }
    let messageContainer = document.createElement('div');
    messageContainer.classList.add('titlebar-message');
    messageContainer.classList.add(messageType);
    messageContainer.textContent = message;

    container.prepend(messageContainer);
}

const removeAuthMessages = () => {
    let messages = document.querySelectorAll('.titlebar-message');
    messages.forEach(message => message.remove());
}

//handles user login requests
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    removeAuthMessages();

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
        displayAuthMessage(error.response.data, 'error', 'login');
    });
})
//handles user registration requests
registrationForm.addEventListener('submit', e => {
    e.preventDefault();
    removeAuthMessages();

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
        displayAuthMessage(`All fields are required. Please complete the form.`, `warning`, 'registration');
        return;
    }
    //verify the password was confirmed
    if(password !== confirmPassword)
    {
        passwordInput.classList.add('warning');
        confirmPasswordInput.classList.add('warning');
        displayAuthMessage(`Your passwords don't match`, `warning`, 'registration');
        return;
    }

    if(password.length < 8)
    {
        passwordInput.classList.add('warning');
        confirmPasswordInput.classList.add('warning');
        displayAuthMessage(`Your password doesn't meet the complexity requirements. Please ensure it is at least 8 characters long.`, `warning`, `registration`);
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
        sessionStorage.setItem('user', JSON.stringify(res.data[0]));
        createModalMessage(`Your user was successfully created`, 'info', navigateToGame);
    })
    .catch(error => displayAuthMessage(error.response.data, 'error', 'registration'));
})