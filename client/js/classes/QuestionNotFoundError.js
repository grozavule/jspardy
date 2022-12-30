class QuestionNotFoundError extends Error {
    constructor(message){
        super(message);
    }
}

export { QuestionNotFoundError };