class CategoryQuestionAmountError extends Error {
    constructor(message, category){
        super(message);
        this.category = category;
    }
}

export {CategoryQuestionAmountError};