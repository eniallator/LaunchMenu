import regexTypes from 

export default class Parser {
    flushCurrLiteral(state) {
        state.symbolTable.push({type: 'literal', value: state.currLiteral})
        state.currLiteral = ''
    }

    translate(exp) {
        const state = {
            currLiteral: '',
            exp: exp,
            symbolTable: [],
        }

        while (state.exp) {
            let output = {charsToRemove: 1}

            for (let type of this.REGEX_TYPES) {
                if (type.condition(state)) {
                    output = type.execute.call(this, state)

                    if (output.success) {
                        break
                    }
                }
            }

            if (!output.success) state.currLiteral += exp[0]
            state.exp = state.exp.substring(output.charsToRemove)
        }

        this.flushCurrLiteral(state)
        return state.symbolTable
    }
}
