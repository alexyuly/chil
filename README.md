# *This specification is an unimplemented draft, with much work in progress.*

***Last Updated:*** *15 Jul 2018*

# Chil Language Specification

# `🌨 -> ❄️ -> ☃️`

## (Edition No. 1, July 2018)

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license.

## Introduction

Chil is a new kind of language built on familiar patterns, used in reimagined ways.

*Chil* is an acronym for

- component
- hierarchy
- information
- language

The primary design principle of Chil is modular composition. Inheritance and polymorphism are shunned, because they tend to create circuitous "spaghetti code". Instead, small, simple units of code are combined together into large, complex trees of streaming data, where the flow of data is explicit.

Just *Chil*, ok? Software is going to be alright...

### Human-Application Interaction Cycle

The Chil language is designed with a certain model of human-application interaction in mind, and that model is cyclic. A Chil application is the aggregate root of high-level entities: a set of intents, a model, and a result. Each entity is represented as a single-directional stream of value objects. *Inputs* received via a software interface are translated into *intents*, which flow through the *application model* to produce results. The *results* are translated into *outputs* and sent out via a software interface. (A "software interface" can be as high-level as the web browser Document Object Model, or as low-level as an audio/video buffer.)

![Human-Application Interaction Cycle](https://github.com/alexyuly/chil/blob/master/images/Human-Application%20Interaction%20Cycle.svg)

Please refer to the documentation of Cycle.js for further excellent analysis of the concepts involved in ["human-computer dialogue abstraction"](https://cycle.js.org/dialogue.html). Thank you to Cycle.js for catalyzing my interest in modeling software applications with single-directional, cyclic data flow, and for inspiring the Chil language.

## Definitions

### Value Object

A **value object** or just "value", is an immutable piece of information, which has a scalar or vectoral value or an enumeration of attributes, and which has no conceptual identity. Examples include *2*, the string *"hello, world"*, and a list of three values: *[ 1, "apple", { "per" : "day" } ]*. Every Chil value can be represented literally as JSON.

### Stream

A **stream** is an object which can be called repeatedly with incoming values, and which may either call each of its connected streams in response, or may hand off responsibility for calling its connected streams to a "delegate" function or stream, which is called with each incoming value.

Here is the Node.js implementation of a function which returns a new stream, from an optional delegate function:

```js
const stream = (delegate = (fn) => fn) => {
    const connected_streams = []
    return {
        connect: connected_streams.push,
        next: delegate((value) => {
            for (const connected_stream of connected_streams) {
                connected_stream.next(value)
            }
        }),
    }
}
```

*TODO: Move component code samples to the component definiton section.*

Here is the Node.js implementation of a function which returns a new leaf component, from a map of intent names to delegate functions:

```js
const leaf_component = (fn_map) => {
    let state
    const this_component = {
        intents: {},
        result: stream(),
        state: {
            fetch: () => state,
            store: (value) => {
                state = value
                // Then, asynchronously write values to disk.
            },
        },
    }
    for (const intent_name in fn_map) {
        const intent = stream(fn_map[intent_name](this_component))
        intent.connect(this_component.result)
        this_component.intents[intent_name] = intent
    }
    return this_component
}
```

Here is the Node.js implementation of a function which returns a new branch component, from a map of intent names to streams:

```js
const branch_component = (stream_map) => {
    const this_component = {
        intents: {},
        result: stream(),
    }
    for (const intent_name in stream_map) {
        const intent = stream_map[intent_name]
        intent.connect(this_component.result)
        this_component.intents[intent_name] = intent
    }
    return this_component
}
```

### Component

A **component** is a closure which combines 1 or more "intent" streams with 1 "result" stream and a state. *(TODO: Revise any remaining component "output" and "input" terminology to refer to "results" and "intents".)* A component is a prototype for an "object":

#### Object

An **object** is an instance of a component which is constructed at compile-time. Chil objects are never constructed at runtime. The representation of an object in "Chil byte-code" is equivalent to the serialization of the state of that object. Once an object has been compiled into byte-code, it may be executed, state-updated, terminated, and re-executed with the same state, with no additional compilation, because state is persisted to disk within the object's byte-code.

Chil byte-code will be explained in detail in a subsequent section of this specification.

#### Object stream

An **object stream** is one of the streams that is combined to construct an object, which is said to be "owned" by that object. An object stream has a "name" unique to its object, and a "delegate", which is a stream that is called with all input values sent to the object stream, and which outputs values on behalf the object stream.

Some object streams have a delegate which is a function implemented in "native code" (see below), while others have a delegate which is a stream of a "child object":

#### Child object

A **child object** is an object which has 1 "parent" which is an object, and 0 or more "siblings" which are child objects of the same parent. The interface of each child is "privately scoped" to its parent: Only a parent has access to sending input values and listening to output values from its own children.

Each stream owned by child object may be either the delegate of one of its parent's streams, or part of such a delegate's "constructor":

#### Constructor

A **constructor** is a value or stream which is passed to an object via its "head" stream, when it is constructed at compile-time. The "head" stream refers to the stream of an object which is named "head".

### Leaf object

A **leaf object** is an object which has no children, and whose streams therefore have delegates which are functions implemented in "native code":

#### Native code

**Native code** is any code which is used to implement delegates of a leaf object, for a particular runtime environment which is supported by a Chil runtime engine.

A leaf object is constructed from a "component function", which defines the streams and delegates of a leaf component. For example, a Node.js implementation of an "add" component might look like this:

```js
module.exports = {
    head: (component) => (value) => {
        component.state.store(value)
    },
    main: (component) => (value) => {
        component.result.next(value + component.state.fetch())
    },
}
```

Leaf component functions are packaged into "libraries", which includes the Chil standard library. These functions should be as small, focused, unique, and reusable as possible, across the global Chil ecosystem. Applications should implement new leaf components only if a problem cannot be solved by combining existing components.

#### Pipe object

A **pipe object** is a class of leaf object which is constructed with 1 or more objects, in order to define the flow of data through those objects. Pipe components are included in the Chil standard library.

##### Line

A **line** is an object which is constructed with a list of streams, and which connects its own input with the first stream's input, connects each stream's output with the subsequent stream's input, and connects the last stream's output with its own output.

The Node.js implementation of the line component:

```js
module.exports = (object) => ({
    head: (streams) => {
        object.store(streams[0])
        for (let i = 0; i < streams.length; i++) {
            streams[i].connect(streams[i + 1] || object.output)
        }
    },
    main: (value) => {
        object.fetch().next(value)
    },
})
```

##### Fork

A **fork** is an object which is constructed with a list of streams, and which connects its own input with each stream's input, and connects each stream's output with its own output, in list order.

The Node.js implementation of the fork component:

```js
module.exports = (object) => ({
    head: (streams) => {
        object.store(streams)
        for (const stream of streams) {
            stream.connect(object.output)
        }
    },
    main: (value) => {
        for (const stream of object.fetch()) {
            stream.next(value)
        }
    },
})
```

##### Void

A **void** is an object which is constructed with a single stream, and which connects its own input with the stream's input, and then ignores all outputs of the stream.

The Node.js implemenation of the void component:

```js
module.exports = (object) => ({
    head: (stream) => {
        object.store(stream)
    },
    main: (value) => {
        object.fetch().next(value)
    },
})
```

Note that all head-streams are wrapped with "void" by default, meaning that their outputs cannot be connected with any other inputs or outputs.

### Branch object

A **branch object** is an object which has 1 or more children, and whose streams therefore have delegates which are streams of its child objects.

*TODO*
