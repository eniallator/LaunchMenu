import BaseType from './baseType'

export default class Group extends BaseType {
    constructor() {
        super()
        this.type = 'group'
    }

    testType(exp) {
        return exp[0] === '(' || exp[0] === ')'
    }

    _matchFunc(text, symbolTableEntry) {}

    _openGroup(state) {
        state.symbolTableManager.push(this.type)
    }

    _closeGroup(state) {
        if (state.symbolTableManager.head.type === this.type)
            this.throwError('unexpected close group symbol.')

        const currSetSymbolTable = state.symbolTableManager.pop()
        state.symbolTable.head.push({
            type: this.type,
            symbolTable: currSetSymbolTable,
            matchFunc: this._matchfunc,
        })
    }

    parseType(state) {
        if (state.exp[0] === '(') this._openGroup(state)
        else this._closeGroup(state)
    }
}
