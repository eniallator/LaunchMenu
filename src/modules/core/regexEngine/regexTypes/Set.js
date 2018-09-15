import SymbolTable from '../symbolTable'
import BaseType from './baseType'

export default class Set extends BaseType {
    constructor() {
        super()
        this.type = 'set'
    }

    testType(exp) {
        return exp[0] === '[' || exp[0] === ']'
    }

    _openSet(state) {
        state.symbolTableManager.push(new SymbolTable(this.type))
    }

    _closeSet(state) {
        if (state.symbolTableManager.head.type === this.type)
            this.throwError('unexpected close set symbol.')

        const currSetSymbolTable = state.symbolTableManager.pop()
        state.symbolTable.head.push(currSetSymbolTable)
    }

    parseType(state) {
        if (state.exp[0] === '[') this._openSet(state)
        else this._closeSet(state)
    }
}
