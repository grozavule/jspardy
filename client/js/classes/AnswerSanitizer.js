class AnswerSanitizer {
    static parseHTML = (answer) => answer.replaceAll(/(<([^>]+)>)/g, '');

    static replaceSpecialCharacters = (answer) => answer.replaceAll('&', 'and').replaceAll(/\"|\'|!/g, '');

    static removeInsignificantWords = (answer) => answer.replace(/^[aA]|^[tT]he|^[oO]f/, '');

    static sanitize = (answer) => {
        answer = this.parseHTML(answer);
        answer = this.replaceSpecialCharacters(answer);
        answer = this.removeInsignificantWords(answer);
        return answer.trim().toLowerCase();
    }
}

export { AnswerSanitizer };