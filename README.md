# *This specification is an unimplemented draft, with much work in progress.*

***Last Updated:*** *9 Jul 2018*

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

A **component** is a closure which combines 1 or more streams with an output and a state. A component is a prototype for an "object":

#### Object

An **object** is an instance of a component which is constructed at compile-time. Chil objects are never constructed at runtime. The representation of an object in "Chil byte-code" is equivalent to the serialization of the state of that object. Once an object has been compiled into byte-code, it may be executed, state-updated, terminated, and re-executed with the same state, with no additional compilation, because state is persisted to disk within the object's byte-code.

Chil byte-code will be explained in detail in a subsequent section of this specification.

#### Object stream

An **object stream** is one of the streams that is combined to construct an object. Such a stream has a "name", which is unique within its object, and a "delegate", which is a stream that is called with all input values sent to the object stream, and which outputs values on behalf the object stream.

Some object streams have a delegate which is a function implemented in "native code" (see below), while others have a delegate which is a stream of a "child object":

#### Child object

A **child object** is an object which has 1 "parent" which is an object, and 0 or more "siblings" which are child objects of the same parent. The interface of each child is "privately scoped" to its parent: Only a parent has access to sending input values and listening to output values from its own children.

A child object may contain the stream which is the delegate of one of its parent's streams, or a child object may be passed into a delegate as a "constructor":

#### Constructor

A **constructor** is a value which is passed to an object via its "head" stream, when it is constructed at compile-time. The "head" stream refers to the stream of an object which is named "head".

### Leaf object

A **leaf object** is an object which has no children, and whose streams therefore have delegates which are functions implemented in "native code":

#### Native code

**Native code** is any code which is used to implement delegates of a leaf object, for a particular runtime environment which is supported by a Chil runtime engine.

A leaf object is constructed from a "component function", which defines the streams and delegates of a leaf component. For example, a Node.js implementation of an `add` component might look like this:

```js
module.exports = (object) => ({
    head: (value) => {
        object.store(value)
    },
    main: (value) => {
        const state = object.fetch()
        object.output(value + state)
    },
})
```

