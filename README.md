# *STARCH*: Streaming Architecture
***a data-driven YAML runtime engine for Node.js and Chrome***

[![CircleCI](https://circleci.com/gh/alexyuly/starch/tree/master.svg?style=shield)](https://circleci.com/gh/alexyuly/starch/tree/master)

# *Please note!* This project is an active work in progress, not ready for use. Check back for continuing updates.

## Design Goals

- Reduce the distance between developer and user experience.
    - Developers are primarily concerned with logic ("how"). Users are primarily concerned with data ("what").
    - Use one language to describe data and logic, and represent logic as data.
    - Encourage developers to think in terms of data first, and logic second.
- Reduce the distance between computer code and human language.
    - Code is consumed by computers. Language is consumed by humans.
    - Make code as [semantic](https://dictionary.cambridge.org/us/dictionary/english/semantic) as possible. In other words, make code as meaningful as possible, *to humans*.
    - Eliminate extraneous symbols wherever possible. Quotes (`"'`), braces (`{}[]`), and parentheses (`()`) which serve as compiler indications should be avoided wherever possible.
- Reduce the distance between synchronous vs. asynchrous control flow and functions vs. generators *A.K.A.* streams.
    - Developers and users both are concerned with the flow of time ("why").
    - Make the flow of time an abstract convention, rather than a concrete syntax.
    - At all but the lowest level of code, synchronous vs. asynchronous control flow and functions vs. streams should be syntactically indistinct, but semantically implied.
    - Therefore, all data types must be streams, so that control flow synchronicity is abstracted within data types.
    - Therefore, all modules *A.K.A.* objects of an application must be data types, so that pure encapsulation is achieved.
    
## Abstract Design Ramblings

### Object-Oriented Programming, A Fork In The Road

#### Classes Versus Composition

"Traditional" class-based object-oriented programming languages proclaim "inheritance" and "encapsulation" both as prime virtues, but class-based simultaneous "inheritance and encapsulation" is a logical contradiction. A class which inherits *methods* of a superclass inherits control over the *logic* of that superclass, which violates superclass' encapsulation of its own behavior. Override methods are a particularly egregious encapsulation violation.

I must clarify: Class-based inheritance is a useful pattern, which serves a useful purpose in many application designs. However, *encapsulated class inheritance* is a logical fallacy, because all class-based inheritance is an encapsulation violation by definition.

Encapsulated class inheritance is a well-intentioned contradiction, because developers' dual instincts towards *encapsulating* logic and *extending* it are both valid and useful. However, if both encapsulation and inheritance are needed to implement a design pattern, then compositional typing is a superior choice in lieu of class types.

#### "I Thought, Object-Orientation And Composition Are Opposites?"

No. Object-orientation and composition are independent concepts. Objects can be composed, just like functions. Composition allows for *extending* types without violating *encapsulation*, because the extension is indirect: a child type *contains the data of its parent*, but it *does not inherit control over the parent's logic*. 

#### "I Thought, Object-Orientation Is An Anti-Pattern?"

Object-orientation is a good thing if it promotes encapsulation of logic. However, class inheritance has been extremely overused in application development. 
