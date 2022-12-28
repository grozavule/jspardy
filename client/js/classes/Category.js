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
}

export { Category };