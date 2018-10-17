import BaseType from './baseType'

export default class Range extends BaseType {
    constructor() {
        super()
        this.type = 'range'
    }

    testType(exp) {
        return exp[1] === '-'
    }

    _matchFunc(text, symbolTableEntry) {}

    parseType(state) {
        if (state.exp.length < 3)
            this.throwError('upper bound of range undefined')

        state.symbolTableManager.head.push({
            type: this.type,
            bounds: {lower: state.exp[0], upper: state.exp[2]},
            matchFunc: this._matchFunc,
        })

        return {charsToRemove: 3}
    }
}
