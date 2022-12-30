class Question {
    constructor(id, answer, question, value, categoryId){
        this.questionId = id;
        this.answer = answer;
        this.question = question;
        this.value = value;
        this.categoryId = categoryId;
    }
}

export { Question }