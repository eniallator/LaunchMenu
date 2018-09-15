import BaseType from './baseType'

export default class Range extends BaseType {
    constructor() {
        super()
        this.type = 'range'
    }

    testType(exp) {
        return exp[1] === '-'
    }

    parseType(state) {
        if (state.exp.length < 3)
            this.throwError('upper bound of range undefined')

        state.symbolTableManager.head.push({
            type: this.type,
            bounds: {lower: state.exp[0], upper: state.exp[2]},
        })

        return {charsToRemove: 3}
    }
}
