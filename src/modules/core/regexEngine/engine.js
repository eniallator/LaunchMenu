export default class RegexEngine {
    constructor(regex) {
        this.regex = regex
    }

    match(string) {
        return string.includes(this.regex)
    }
}

let eng = new RegexEngine('test')

console.log(eng.find('this is a test'))
console.log(eng.find('this is a tes'))
