# *This specification is an unimplemented draft, with much work in progress.*

***Last Updated:*** *14 Jul 2018*

# Chil Language Specification

## (Edition No. 1, July 2018)

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license.

## Introduction

Chil is a new kind of language built on familiar patterns, used in reimagined ways.

*Chil* is an acronym for

- component
- hierarchy
- information
- language

The primary design principle of Chil is modular composition. Inheritance and polymorphism are shunned, because they tend to create "spaghetti code": Instead, small, simple units of code are combined together into large, complex trees of streaming data, where the flow of data is explicit.

## Definitions

### Value

A **value** is a single piece of human-readable data, such as a number, a string, or a list.

### Output

An **output** is a function which is called with a value 0 or more times, in order to publish values to any "listeners" who may be notified as a result of the calls.

### Stream

A **stream** is a function which is called with an "input value" 1 or more times, and which in response calls its own output with an "output value" 0 or more times per input. The "own output" of a stream is passed in by a higher-order function call. For example, this pseudo-ECMAScript code returns a stream:

```js
(output) => (value) => over_time(() => output(transformation_of(value)))
```

Note: `over_time` is a function which abstracts the synchronicity of a stream over time, which may be a combination of synchronous and asynchronous calls. `transformation_of` is a function which abstracts a theoretical transformation of an input value to produce an output value. (Note that input-output mappings need not be 1-to-1, as inputs may have any correspondence with outputs.)

Streams may also be stateful. This state, as well as the stream's own output, is controlled by a "component":

### Component

A **component** is a closure which combines 1 or more streams with 1 output and a state. A component is a prototype for an "object":

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
module.exports = (object) => ({
    head: (value) => {
        object.store(value)
    },
    main: (value) => {
        object.output(value + object.fetch())
    },
})
```

Leaf component functions are packaged into "libraries", which includes the Chil standard library. These functions should be as small, focused, unique, and reusable as possible, across the global Chil ecosystem. Applications should implement new leaf components only if a problem cannot be solved by combining existing components.

#### Connection object

A **connection object** is a class of leaf object which is constructed with 1 or more objects, in order to define the flow of data through those objects. Connection components are included in the Chil standard library.

##### Pipe

A **pipe** is an object which is constructed with a list of streams, and which connects its own input with the first stream's input, connects each stream's output with the subsequent stream's input, and connects the last stream's output with its own output. This produces a linear "pipeline" of values.

The Node.js implementation of the pipe component:

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

##### Split

A **split** is an object which is constructed with a list of streams, and which connects its own input with each stream's input, and connects each stream's output with its own output, in list order. This produces an ordered "splitting" of values.

The Node.js implementation of the split component:

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

### Human-Centered Interaction Model

![Human-Centered Interaction Model](https://raw.githubusercontent.com/alexyuly/chil/master/images/Human-Application%20Interaction%20Model.png)

