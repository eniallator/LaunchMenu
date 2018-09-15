import SymbolTableManager from './symbolTableManager'

export default class Parser {
    translate(exp) {
        const state = {
            currLiteral: {
                str: '',
                flush: () => {
                    this.symbolTable.push({
                        type: 'literal',
                        value: this.currLiteral.str,
                    })
                    this.currLiteral.str = ''
                },
            },
            symbolTableManager: new SymbolTableManager(),
            exp,
        }
        state.currLiteral.flush.bind(state)
        state.activeSymbolTable = state.wholeSymbolTable

        while (state.exp) {
            let output = {charsToRemove: 1}

            for (let type of this.REGEX_TYPES) {
                if (type.condition(state)) {
                    output = type.execute(state)

                    if (output.success) {
                        break
                    }
                }
            }

            if (!output.success) state.currLiteral.str += exp[0]
            state.exp = state.exp.substring(output.charsToRemove)
        }

        state.currLiteral.flush()
        return state.symbolTable.getFull()
    }
}
