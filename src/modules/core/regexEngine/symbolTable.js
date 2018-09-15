export default class SymbolTable {
    constructor(type) {
        this.type = type
        this._symbolTable
    }

    push(entry) {
        this._symbolTable.push(entry)
    }
}
