import { Question } from './Question.js';

class Category {
    questions = [];

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
        return this.questions.find(question => question.questionId == questionId);
    }
}

export { Category };