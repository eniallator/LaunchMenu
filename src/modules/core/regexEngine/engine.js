import Parser from './parser'

export default class RegexEngine {
    constructor(regex) {
        const parser = new Parser()

        this.symbolTable = parser.translate(regex)
    }

    match(string) {
        return string.includes(this.regex)
    }
}
