export default class BaseType {
    throwError(message) {
        console.error('[REGEX_TYPES] Error: ' + message)
    }

    testType(exp) {
        this.throwError('testType function not defined.')
    }

    parseType(state) {
        this.throwError('parseType function not defined.')
    }
}
