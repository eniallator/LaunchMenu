const flushCurrLiteral = state => {
    state.symbolTable.push({type: 'literal', value: state.currLiteral})
    state.currLiteral = ''
}

export default class Parser {
    constructor() {
        this.ESCAPE_CHAR = '`'

        this.REGEX_TYPES = [
            {
                condition: state => state.exp[0] === this.ESCAPE_CHAR,
                execute: state => {
                    if (state.exp.length < 2) this.throwError('')
                    const expToReplace = state.exp[1]
                    const replacement = regexComposites[expToReplace]
                    if (replacement) {
                        flushCurrLiteral(state)
                        state.exp = replacement + state.exp
                        return {success: true, charsToRemove: 0}
                    } else {
                        return {success: false}
                    }
                },
            },
        ]
    }

    translate(exp) {
        const state = {
            currLiteral: '',
            exp: exp,
            symbolTable: [],
        }

        while (state.exp) {
            let isLiteral = true
            let output = {charsToRemove: 1}

            for (let type of this.REGEX_TYPES) {
                if (type.condition(state)) {
                    output = type.execute.call(this, state)

                    if (output.success) {
                        isLiteral = false
                        break
                    }
                }
            }

            if (isLiteral) state.currLiteral += exp[0]
            state.exp = state.exp.substring(output.charsToRemove)
        }

        flushCurrLiteral(state)
        return state.symbolTable
    }
}
