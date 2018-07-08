# *This specification is an unimplemented draft, with much work in progress.*

***Last Updated:*** *7 Jul 2018*

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

The primary design principle of Chil is modular composition. Inheritance and polymorphism are shunned: Instead, small, simple units of code are combined together into large, complex trees of streaming data.

## Definitions

### Value

A **value** is a single piece of human-readable data, such as a number, a string, or a list.

### Output

An **output** is a function which is called with a value 0 or more times, in order to publish values to any "listeners" who may be notified as a result of the calls.

### Stream

A **stream** is a function which is called with an "input value" 1 or more times, and which in response calls its own output with an "output value" 0 or more times per input. The "own output" of a stream is passed in by a higher-order function. For example, this ECMAScript-like pseudo-code returns a stream:

```js
(output) => (value) => over_time(() => output(transformation_of(value)))
```

Note: `over_time` is a function which abstracts the synchronicity of a stream over time, which may be a combination of synchronous and asynchronous calls. `transformation_of` is a function which abstracts a theoretical transformation of an input value to produce an output value. (Note that input-output mappings need not be 1-to-1: Inputs may have any possible correspondence with outputs.)

Streams may also be stateful. This state, as well as the stream's own output, is controlled by a "component":

### Component

A **component** is a closure which combines 1 or more streams with an output and a state. Each stream has a "name" which is unique within the component. A component is a prototype for an "object":

#### Object

An **object** is an instance of a component which is constructed at compile-time. Chil objects are constructed only at compile-time, never at runtime. The representation of an object in Chil "byte-code" is equivalent to the serialization of the state of that object. Once an object has been compiled into byte-code, it may be executed, state-updated, terminated, and re-executed with the same state, with no additional compilation.

#### Application

An **application** is an object which is the root of an "object tree". Each object may be the child of another object, excluding itself and its descendants, therefore the objects of an application form a *tree*. Circular graphs of objects are not permitted and will cause a compiler error.

An application is executed by passing arguments, as a list of strings, into one stream of the application, which is named `main`:

#### Main stream

The **main stream** is common to most objects, including all applications. If an object declares a stream named `main`, then it handles all incoming values for the object, unless another stream is specified.

#### Head stream

The **head stream** is common to all objects, even if not explicitly declared. If an object declares a stream named `head`, then it handles the value passed into the object when it is constructed at compile-time, and it should be concerned with initializing the state of the object. Note that the head stream may also receive values passed at runtime, which may be useful to dynamically re-initialize an object's state.

If no head stream is explicitly declared, then values passed into the object during construction, or into the head stream at runtime, will have no effect.

