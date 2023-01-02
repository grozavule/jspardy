import { Question } from './Question.js';
import { QuestionNotFoundError } from './QuestionNotFoundError.js';

class Category {
    questions = [];
    #chosenQuestions = {};

    constructor(categoryId, categoryName, jServiceId){
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.jServiceId = jServiceId;
    }

    addQuestion = question => {
        if(question instanceof Question)
        {
            this.questions.push(question);
        }
    }

    getQuestion = questionId => {
        let question = this.questions.find(question => question.questionId == questionId);
        if(!question instanceof Question)
        {
            throw new QuestionNotFoundError();
        }
        this.#chosenQuestions[questionId] = true;
        console.log(this.#chosenQuestions, this.questions);
        return question;
    }

    hasQuestionsRemaining = () => {
        return Object.keys(this.#chosenQuestions).length < this.questions.length;
    }
}

export { Category };