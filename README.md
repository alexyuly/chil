# *STARCH*: Streaming Architecture
***a data-driven YAML runtime engine for Node.js and Chrome***

[![CircleCI](https://circleci.com/gh/alexyuly/starch/tree/master.svg?style=shield)](https://circleci.com/gh/alexyuly/starch/tree/master)

# *Please note!* This project is an active work in progress, not ready for use. Check back for continuing updates.

## Design Goals & Ramblings

(Scroll down further for a more well-defined overview of the STARCH high-level design.)

### Overall Goals

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

### Object-Oriented Programming: Classes Versus Composition

"Traditional" class-based object-oriented programming languages proclaim "inheritance" and "encapsulation" both as prime virtues, but class-based simultaneous "inheritance and encapsulation" is a logical contradiction. A class which inherits *methods* of a superclass inherits control over the *logic* of that superclass, which violates superclass' encapsulation of its own behavior. Override methods are a particularly egregious encapsulation violation.

I must clarify: Class-based inheritance is a useful pattern, which serves a useful purpose in many application designs. However, *encapsulated class inheritance* is a logical fallacy, because by definition all class-based inheritance is an encapsulation violation.

Encapsulated class inheritance is a well-intentioned contradiction, because developers' dual instincts towards *encapsulating* logic and *extending* it are both valid and useful. However, if both encapsulation and inheritance are needed to implement a design pattern, then compositional typing is a superior choice in lieu of class types.

Object-orientation and composition are independent concepts. Objects can be composed, just like functions. Composition allows for *extending* types without violating *encapsulation*, because the extension is indirect: a child type *contains the data of its parent*, but it *does not inherit control over the parent's logic*. Object-orientation is a good thing if it promotes encapsulation of logic. However, class inheritance has been extremely overused in application development.

### "Complete Runtime Reflection": Type/Instance Mirroring

One major design goal of STARCH is to achieve "complete runtime reflection", so that any instance of a type in memory has identical structure to the definition of that type in code, meaning that the structure of an application's state at runtime is identical to the structure of its state at compile time, since an application is an instance of a type. One implication is that an application could be manipulated at runtime with no interruption in service beyond the local area of the manipulation, in almost surgical fashion.

# STARCH High-Level Design

## Objects and Object Graphs

An object is an encaspulation of data and (optionally) logic. An object graph is a directed cyclic graph of objects, which is an object itself.

## Types

A type specifies a kind of object or object graph which may be instantiated, as a function of one or more other types which are instantiated as objects and possibly connected to form an object graph.

### Stream Types

A **stream type** indicates a kind of object which represents an abstact stream of data, with no specific logic.

#### Simple Stream Types

A **simple stream type** indicates a fundamental kind of streaming data, which may be referenced globally.

##### number
a stream of JavaScript number values
```yaml
number
```

##### string
a stream of JavaScript string values
```yaml
string
```

##### flag
a stream of JavaScript boolean values: `true` or `false`
```yaml
flag
```

##### list
a stream of JavaScript Arrays which all have elements all of one stream type parameter:
```yaml
list: stream type parameter
```

for example:
```yaml
list: number
```

##### props
a stream of JavaScript Objects which all have an identical set of keyed stream type parameters:
```yaml
props:
    key: stream type parameter
    ...
```

for example:
```yaml
props:
    id: number
    name: string
    numbers:
        list: number
```

#### Complex Stream Types

A **complex stream type** composes other stream types.

```yaml
compose:
    composed stream type name: [optional composed stream type relative file system path]
    ...
parameters:
    parameter stream type name: parameter stream type domain
    ...
parent: parent stream type
```

Each complex stream type can be **reduced** to a simple stream type, which is used for type-checking against other stream types.

##### Union Stream Types

A **union stream type** is a union of other stream types, expressed as a list of stream types.

The union of all stream types, called **any stream**, is expressed as an empty value, which is equivalent to JavaScript `null`.

### Operation Types

An **operation type** is a composition of *n* named input stream instances and 1 output stream instance.

```yaml
compose:
    composed stream type name: [optional composed stream type relative file system path]
    ...
parameters:
    parameter stream type name: parameter stream type domain
    ...
parent: parent abstract operation type
output: output stream type
inputs:
    input stream name:
        of: input stream type
        first: event of input stream type
    ...
```

#### Concrete Operation Types

A **concrete operation type** is an operation type which has a **delegate**, which is a Node.js module which exports a function like so:

```js
const delegate = require('@starch/runtime/lib/delegate')

module.exports = delegate((operation) => ({
    push: (anything) => {
        (operation.queue || (operation.queue = [])).push(anything)
    },
    restart: (rate) => {
        clearInterval(operation.interval)
        operation.interval = setInterval(
            () => operation.output(operation.queue.shift()),
            rate
        )
    },
}))
```

`delegate` is a utility function, which accepts a closure of a new operation instance which returns an object mapping the name of each operation input stream to a **method** called with each event received by the associated input stream. Each method may manipulate the reference to `operation` in response an event, by reading and writing state (in this example, `operation.interval` and `operation.queue`), and calling `operation.output(...)` in order to synchronously or asynchronously output an event *n* times.

#### Abstract Operation Types

An **abstract operation type** is an operation type with no delegate. Such a type may be the **parent** of another operation type, whereas concrete types may only be children.

##### Compositional Inheritance

Operation type parent-child relationships are defined through compositional inheritance, which means that *Type Child* is a child of *Type Parent* if and only if *Type Child* is a subset of *Type Parent*. Therefore, a type which inherits a parent type, may NOT override any members of the parent type. For example, if *Type Parent* defines an `output` member, then *Type Child* must not define an output member, to be instantiated without throwing an error. In other words, a child may *augment* a parent's members but never *override* them, because a type is the set of all types which contain its members, so an instance of *Type Child* must contain all the members of *Type Parent* in order to be considered an instance of *Type Parent*.

#### Component Types (AKA Complex Operation Types)

A **component type** is an operation type which is a composition of *n* named input stream instances, *m* operation instances, and 1 output stream instance.

```yaml
compose:
    composed type name: [optional composed type relative file system path]
    ...
parameters:
    parameter type name: parameter type domain
    ...
parent: parent component or abstract operation type
output: output stream type
inputs:
    input stream name:
        of: input stream type
        first: event of input stream type
        connect:
            operation name: operation input stream name
            output:
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
            output:
            ...
    ...
```

A component type defines connections from component input streams to operation instance input streams, between operation instances, and from component streams and operations to the component output. (A component instance is an object graph which, remember, is a directed cyclic graph of objects.)

Connections between streams are **type-checked**, which means that the type of the source stream must be a subset of the type of the target stream, known as the **domain**.

#### Simple Operation Type

The **simple operation type** is an abstract type which represents the set of all possible operations which match a given set of output and input streams.

```yaml
operation:
    output: output stream type parameter
    inputs:
        input stream name:
            of: input stream type parameter
        ...
```

The simple operation type may not be instantiated as an operation in a component. It may only be instantiated as the domain of an operation type parameter. Each non-simple operation type can be **reduced** to a simple operation type, which is used for type-checking against other operation types. (This principle works here just as it does with stream types.)
