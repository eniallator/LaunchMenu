# How It Works

Firstly, every regex type inherits from the baseType class. This has testType as well as parseType methods where:

-   testType is the method that's called to check if it recognizes if the next part of the regex is it's type and so it returns a boolean based on that

-   parseType is the method called when testType is true

## Main Parser loop

-   Has a state variable that holds information about:

    -   The current string literal
    -   The symbol table manager (more on this below)
    -   The regex being parsed

-   It then iterates while there is still regex left by:
    -   Running the testType method (and passing whats left of the regex string in as a param) for each type until it finds the correct type
        -   Then executing the parseType with state as a param
    -   Or defaulting by adding to the current string literal.

## Symbol Tables

-   There's 1 main symbol table that holds the top level regex types (i.e anything that's not nested in a set/group)
-   Each entry in the symbol table has the following format (Not yet fully implemented so can be subject to change):

```javascript
{
    type: "type",         // The type of regex
    matchFunc: () => {},  // The function called when analysing a string for the regex that gets passed this whole object
}
/*
Any other key/values can be in there for extra meta data about the regex
*/
```

### Symbol Table Stack

-   I'm using a stack for multiple symbol tables for regex types like sets/groups.

    -   These types can store multiple different types within them and so I thought by having a stack keep track of the current symbol table it should work as intended.

-   The current symbol table can be accessed with `state.symbolTableManager.head`
-   push/pop methods can be accessed in the symbol table manager to push or pop the last symbol table
