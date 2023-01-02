/*
* This class will eventually take of the createModalMessage function and become
* the base class for the other modals: QuestionModal and GameOverModal
*/

class Modal {
    modalContainer;
    titleContainer;
    bodyContainer;
    buttonContainer;

    constructor(type = 'info'){
        this.title = title;
        this.modalContainer = document.createElement('section');
        this.modalContainer.classList.add('modal');
        this.modalContainer.classList.add(type);
    }

    addTitle = title => {
        let modalTitle = document.createElement('h1');
        modalTitle.textContent = title[0].toUpperCase() + title.substr(1);

        this.titleContainer = document.createElement('header');
        this.titleContainer.classList.add('titlebar');
        this.titleContainer.appendChild(modalTitle);

        this.modalContainer.appendChild(this.titleContainer);
    }

    addBody = bodyText => {
        this.bodyContainer = document.createElement('div');
        this.bodyContainer.classList.add('modal-body');
        this.bodyContainer.textContent = bodyText;

        this.modalContainer.appendChild(this.bodyContainer);
    }

    addButton = (buttonText, callback = () => {}) => {

    }
}