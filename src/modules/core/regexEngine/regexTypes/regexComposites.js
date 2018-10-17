const isDigit = char => '0' <= char && char <= '9'
const isLetter = char => 'a' <= char && char <= 'z'
const isWordChar = char =>
    isDigit(char) || isLetter(char.toLowerCase()) || char === '_'

export default {
    d: isDigit,
    D: char => !isDigit(char),
    a: isLetter,
    A: char => !isLetter(char),
    w: isWordChar,
    W: char => !isWordChar(char),
}
