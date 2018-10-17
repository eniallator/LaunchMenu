import BaseType from './baseType'
import regexComposites from './regexComposites'

export default class CompositeChars extends BaseType {
    constructor() {
        super()
        this.ESCAPE_CHAR = '`'
        this.type = 'special'
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
            state.currLiteral.flush()
            state.symbolTableManager.head.push({
                type: this.type,
                value: specialChar,
                matchFunc: composition[specialChar],
            })
        } else {
            state.currLiteral.str += specialChar
            charsToRemove = 2
        }

        return {charsToRemove}
    }
}
