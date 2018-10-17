import SymbolTable from './symbolTable'

export default class SymbolTableManager {
    constructor() {
        this._symbolTableStack = [new SymbolTable('main')]
        this._updateHead()
    }

    throwError(message) {
        console.error('[REGEX_SYMBOL_TABLE_MANAGER] Error: ' + message)
    }

    _updateHead() {
        this.head = this._symbolTableStack[this._symbolTableStack.length - 1]
    }

    push(newSymbolTable) {
        if (newSymbolTable instanceof SymbolTable) {
            this._symbolTableStack.push(newSymbolTable)
            this._updateHead()
        } else if (newSymbolTable instanceof String) {
            this._symbolTableStack.push(new SymbolTable(newSymbolTable))
        } else
            this.throwError(
                'push method didn\'t receive a SymbolTable or string type.'
            )
    }

    pop(forcePop) {
        if (forcePop || this._symbolTableStack.length > 1) {
            const poppedSymbolTable = this._symbolTableStack.pop()
            this._updateHead()
            return poppedSymbolTable
        } else
            this.throwError(
                'pop method called when only the main symbol table left'
            )
    }

    getLength() {
        return this._symbolTableStack.length
    }
}
