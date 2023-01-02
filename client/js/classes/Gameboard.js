import { Category } from './Category.js';
import { Question } from './Question.js';
import { CategoryNotIncludedError } from './CategoryNotIncludedError.js';
import { QuestionNotFoundError } from './QuestionNotFoundError.js';

class Gameboard {
    categories = [];
    #playerScore = 0;
    
    addCategory = category => {
        if(category instanceof Category)
        {
            this.categories.push(category);
        }
    }

    displayQuestion = e => {
        let categoryId = e.target.getAttribute('data-category');
        let questionId = e.target.getAttribute('data-question');

        try 
        {
            //showQuestion(categoryId, questionId);
            let category = this.getCategory(categoryId);
            let question = category.getQuestion(questionId);

            console.log(categoryId, category);
            console.log(questionId, question);

            //create the modal container
            let modal = document.createElement('div');
            modal.classList.add('modal');
            modal.classList.add('question-modal');
    
            //create the modal title
            let modalCategoryTitle = document.createElement('span');
            modalCategoryTitle.textContent = category.categoryName;
            let modalQuestionValue = document.createElement('span');
            modalQuestionValue.textContent = question.value + ' points';

            //create the modal body container
            let modalBody = document.createElement('div');
            modalBody.classList.add('modal-body');

            //create the modal body elements
            let modalQuestionTitle = document.createElement('h1');
            modalQuestionTitle.classList.add('title');
            modalQuestionTitle.textContent = 'Question:';
            let modalQuestionBody = document.createElement('p');
            modalQuestionBody.textContent = question.question;

            let modalBodySeparator = document.createElement('hr');
            modalBodySeparator.classList.add('modal-separator');

            //create the modal button
            let modalButton = document.createElement('button');
            modalButton.classList.add('modal-btn');
            modalButton.textContent = 'Submit';

            let modalButtonsContainer = document.createElement('div');
            modalButtonsContainer.classList.add('buttons-container');
            modalButtonsContainer.appendChild(modalButton);
    
            let answerForm = document.createElement('form');
            let answerLabel = document.createElement('label');
            answerLabel.setAttribute('for', 'answer');
            answerLabel.textContent = 'Answer:';
            let answerInput = document.createElement('input');
            answerInput.setAttribute('type', 'text');
            answerInput.setAttribute('id', 'answer-input');
            let categoryInput = document.createElement('input');
            categoryInput.setAttribute('type', 'hidden');
            categoryInput.setAttribute('id', 'selected-category');
            categoryInput.value = categoryId;
            let questionInput = document.createElement('input');
            questionInput.setAttribute('type', 'hidden');
            questionInput.setAttribute('id', 'selected-question');
            questionInput.value = questionId;
            answerForm.appendChild(answerLabel);
            answerForm.appendChild(answerInput);
            answerForm.appendChild(categoryInput);
            answerForm.appendChild(questionInput);
            answerForm.appendChild(modalButtonsContainer);
            answerForm.addEventListener('submit', this.verifyPlayerAnswer);

            modalBody.appendChild(modalQuestionTitle);
            modalBody.appendChild(modalQuestionBody);
            modalBody.appendChild(modalBodySeparator);
            modalBody.appendChild(answerForm);

            let modalTitleContainer = document.createElement('header');
            modalTitleContainer.classList.add('titlebar');
            modalTitleContainer.appendChild(modalCategoryTitle);
            modalTitleContainer.appendChild(modalQuestionValue);
    
            modal.appendChild(modalTitleContainer);
            modal.appendChild(modalBody);

            document.body.appendChild(modal);
        } 
        catch(error) 
        {
            if(error instanceof QuestionNotFoundError)
            {
                createModalMessage(`Your question could not be found`, 'error');
            }
            else
            {
                throw error;
            }
        }
    }

    navigateToGameOver = () => {
        let user = JSON.parse(sessionStorage.getItem('user'));
        user.gameScore = this.#playerScore;
        sessionStorage.setItem('user', JSON.stringify(user));
        window.location.href='/end';
    }

    getCategory = categoryId => this.categories.find(category => category.categoryId == categoryId);

    addQuestion = (categoryId, question) => {
        //console.log(categoryId, this.categories);
        let category = this.categories.find(cat => cat.categoryId === categoryId);
        if(!category)
        {
            throw new CategoryNotIncludedError(`Category ID ${categoryId} was not found`);
        }
        else
        {
            category.addQuestion(question);
        }
    }

    getPlayerScore = () => this.#playerScore;

    getQuestion = (categoryId, questionId) => {
        let selectedCategory = this.getCategory(categoryId);
        if(!selectedCategory)
        {
            console.log(`Question Category ${categoryId} was not found`);
            return;
        }
        return selectedCategory.getQuestion(questionId);
    }

    isGameOver = () => {
        if(this.categories.every(category => !category.hasQuestionsRemaining()))
        {
            this.navigateToGameOver();
        }
    }

    removeCategory = categoryId => {
        this.categories = this.categories.filter(category => category.categoryId !== categoryId);
    }

    removeGameSpace = (categoryId, questionId) => {
        let gameSquare = document.querySelector(`[data-category="${categoryId}"][data-question="${questionId}"]`);
        try
        {
            gameSquare.classList.add('hidden');
            gameSquare.removeEventListener('click', this.displayQuestion);
        }
        catch(error)
        {
            createModalMessage(`The last game square you chose could not be removed from the gameboard`, 'error');
        }
    }

    updatePlayerScore = (points, isAdded) => {
        if(isAdded)
        {
            this.#playerScore += points;
        }
        else
        {
            this.#playerScore -= points;
        }
        return this.#playerScore;
    }

    verifyPlayerAnswer = e => {
        e.preventDefault();
        try
        {
            let answer = document.querySelector('#answer-input').value;
            let categoryId = document.querySelector('#selected-category').value;
            let questionId = document.querySelector('#selected-question').value;
            let question = this.getQuestion(categoryId, questionId);
            if(!question instanceof Question)
            {
                throw new QuestionNotFoundError(`The question ID, ${questionId}, could not be found in category ID ${categoryId}`);
            }
            let userAnsweredCorrectly = answer.toLowerCase() === question.answer.toLowerCase();
            let newScore = this.updatePlayerScore(question.value, userAnsweredCorrectly);
            document.querySelector('#score').textContent = newScore;
            this.removeGameSpace(categoryId, questionId);
            closeModal();
    
            //compares the user's answer to the question's answer, updated the user's score, and displays the outcome of the answer to the user
            if(userAnsweredCorrectly)
            {
                createModalMessage(`That's correct!`, 'info', this.isGameOver);
            }
            else
            {
                createModalMessage(`Wrong! The correct answer was ${question.answer}`, 'warning', this.isGameOver);
            }
        }
        catch(error)
        {
            createModalMessage(error.message, 'error');
        }
    }
}

export { Gameboard };