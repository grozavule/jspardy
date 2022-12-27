const BASE_URL = `http://localhost:5050`;
const TRIVIA_API_BASE_URL = `http://jservice.io`;

const closeModal = callback => {
    const modal = document.querySelector('.modal');
    modal.remove();
    callback();
}

//creates a pop-up message to display info, warnings, and errors to the user
const createModalMessage = (message, type, callback = () => { return; }) => {
    let modal = document.createElement('div');
    modal.classList.add('modal');
    switch(type.toLowerCase()){
        case 'error':
        case 'warning':
            modal.classList.add(type);
            break;
    }
    
    let modalTitle = document.createElement('h1');
    modalTitle.textContent = type[0].toUpperCase() + type.substr(1);

    let modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalBody.textContent = message;

    let modalButton = document.createElement('button');
    modalButton.classList.add('modal-btn');
    modalButton.textContent = 'OK';
    modalButton.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(callback);
    });

    let modalButtonsContainer = document.createElement('div');
    modalButtonsContainer.classList.add('buttons-container');
    modalButtonsContainer.appendChild(modalButton);

    let modalTitleContainer = document.createElement('div');
    modalTitleContainer.classList.add('titlebar');
    modalTitleContainer.appendChild(modalTitle);
    
    modal.appendChild(modalTitleContainer);
    modal.appendChild(modalBody);
    modal.appendChild(modalButtonsContainer);

    document.body.appendChild(modal);
}

const navigateToGame = () => {
    window.location.href = '/game';
}

const navigateToHome = () => {
    window.location.href = '/';
}