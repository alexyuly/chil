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
    - Eliminate extraneous symbols wherever possible. All symbols which do not communicate information about data should be avoided wherever possible.
- Reduce the distance between synchronous vs. asynchronous control flow and functions vs. generators.
    - Developers and users both are concerned with the flow of time ("why").
    - Make the flow of time an abstract convention, rather than a concrete syntax.
    - At all but the lowest level of code, synchronous vs. asynchronous control flow and functions vs. streams should be syntactically indistinct, but semantically implied.
    - Therefore, all data types must be streams, so that control flow synchronicity is abstracted within data types.
    - Therefore, all objects of an application must be instances of data types, to achieve pure encapsulation.
    
## Abstract Design Ramblings

### Object-Oriented Programming, A Fork In The Road

#### Classes Versus Composition

"Traditional" class-based object-oriented programming languages proclaim "inheritance" and "encapsulation" both as prime virtues, but class-based simultaneous "inheritance and encapsulation" is a logical contradiction. A class which inherits *methods* of a superclass inherits control over the *logic* of that superclass, which violates superclass' encapsulation of its own behavior. Override methods are a particularly egregious encapsulation violation.

I must clarify: Class-based inheritance is a useful pattern, which serves a useful purpose in many application designs. However, *encapsulated class inheritance* is a logical fallacy, because by definition all class-based inheritance is an encapsulation violation.

Encapsulated class inheritance is a well-intentioned contradiction, because developers' dual instincts towards *encapsulating* logic and *extending* it are both valid and useful. However, if both encapsulation and inheritance are needed to implement a design pattern, then compositional typing is a superior choice in lieu of class types.

#### "I Thought, Object-Orientation And Composition Are Opposites?"

No. Object-orientation and composition are independent concepts. Objects can be composed, just like functions. Composition allows for *extending* types without violating *encapsulation*, because the extension is indirect: a child type *contains the data of its parent*, but it *does not inherit control over the parent's logic*. 

#### "I Thought, Object-Orientation Is An Anti-Pattern?"

Object-orientation is a good thing if it promotes encapsulation of logic. However, class inheritance has been extremely overused in application development. 

## STARCH High-Level Design

### Basic Terminology

- STARCH execution is a directed graph of objects.
- Each **object** is an **instance of** a type.
- Each **type** is a stream.
- A **stream** is a sequence of one kind of event over time.
- An **operation** is a composition of *n* input streams and 1 output stream, which has an implementation.
- An **implementation** is a Node.js module (*could support other engines in future*) which contains *n* generators which listen to events from an operation's *n* input streams and pipe events to the output stream, synchronously or not.
- A **component** is a composition of *n* input streams, *m* operations, and 1 output stream. A component itself has no implementation.
- An **application** is a component which has a run input stream.
- A **run input stream** responds to events from the operating system, such as an execution signal event which contains an array of command line arguments.

### Native Types

Some types are **native types** which means they are global. They are inherent to the framework.

#### number
a stream of JavaScript number values
```yaml
number
```

#### string
a stream of JavaScript string values
```yaml
string
```

#### flag
a stream of JavaScript boolean values: `true` or `false`
```yaml
flag
```

#### list
a stream of JavaScript Arrays which each have elements all of one type parameter, e.g. `list: number`
```yaml
list: type parameter
```

#### props
a stream of JavaScript Objects which each have the same set of keyed type parameters, e.g.: `props: { id: number, name: string }`
```yaml
props:
    key: type parameter
    ...
```

#### operation
an abstract operation on *n* input streams and 1 output stream
```yaml
operation:
    output: output stream type parameter
    inputs:
        input stream name:
            of: input stream type parameter
        ...
```

### Defined Types

A **defined type** is a simple Abstract Syntax Tree written in YAML syntax which describes the behavior of a non-native type.

A stream type has the following syntax:

```yaml
name: output stream name
compose:
    composed type name: composed type relative file system path
    ...
parameters:
    parameter type name: parameter type domain
    ...
parent: parent type
```

An operation type extends a stream type with the following syntax:

```yaml
output: output stream type
inputs:
    input stream name:
        of: input stream type
        first: event of input stream type
    ...
```

A component type extends an operation type with the following syntax:

```yaml
inputs:
    input stream name:
        connect:
            operation name: operation input stream name
            ...
    ...
operations:
    operation name:
        of: operation type
        first:
            operation input stream name: event of operation input stream type
            ...
        connect:
            operation name: operation input stream name
            output stream name:
            ...
    ...
```
