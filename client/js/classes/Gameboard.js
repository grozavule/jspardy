import { Category } from './Category.js';
import { CategoryNotIncludedError } from './CategoryNotIncludedError.js';

class Gameboard {
    categories = [];
    #playerScore = 0;
    
    addCategory = category => {
        if(category instanceof Category)
        {
            this.categories.push(category);
        }
    }

    getCategory = categoryId => {
        return this.categories.find(category => category.categoryId == categoryId);
    }

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

    getPlayerScore = () => {
        return this.#playerScore;
    }

    getQuestion = (categoryId, questionId) => {
        let selectedCategory = this.getCategory(categoryId);
        if(!selectedCategory)
        {
            console.log(`Question Category ${categoryId} was not found`);
            return;
        }
        return selectedCategory.questions.find(question => question.questionId == questionId);
    }

    removeCategory = categoryId => {
        this.categories = this.categories.filter(category => category.categoryId !== categoryId);
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
}

export { Gameboard };