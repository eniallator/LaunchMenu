import BaseType from './baseType'
import regexComposites from './regexComposites'

export default class CompositeChars extends BaseType {
    constructor() {
        super()
        this.ESCAPE_CHAR = '`'
    }

    testType(exp) {
        return exp[0] === this.ESCAPE_CHAR
    }

    parseType(state) {
        if (state.exp.length < 2)
            this.throwError(
                'unexpected ' + this.ESCAPE_CHAR + ' at end of string.'
            )
        const specialChar = state.exp[1]
        const composition = regexComposites[specialChar]

        let charsToRemove

        if (composition) {
            this.flushCurrLiteral(state)
            state.exp = composition + state.exp.substring(2)
            charsToRemove = 0
        } else {
            state.currLiteral += specialChar
            charsToRemove = 2
        }

        return {charsToRemove}
    }
}
