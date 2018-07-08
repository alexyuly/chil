# *This specification is an unimplemented draft, with much work in progress.*

***Last Updated:*** *8 Jul 2018*

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

### Application tree

An **application tree** is a tree of objects, which has an application at its root, "branch objects" within, and "leaf objects" at its leaves:

#### Leaf object

A **leaf object** is an object which has no children. It is defined as "native code", that is any code which is written in a language targeting a specific platform supported by a Chil runtime engine, rather than code which is written in a platform-agnostic language, that is the "Chil language" itself.

A leaf object is constructed from a "component function", which is implemented for each target platform, in a platform-specific language. For example, a Node.js implementation of the `add` component might look like this:

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

Note that `object` provides access to synchronous functions which are called to `store` and `fetch` the object's state, as well as `output` a value. The functions assigned to `head` and `main` define streams which call these functions of the object. Note that any value returned by a stream is ignored and not consumed.

##### Proposed leaf object API for Node.js #####

Each leaf object has an API which consists of the following functions, called "methods":

- `fetch()`: Synchronously return the value which was last called with `store(value)`, or if that method was never called, then return `undefined`.
- `fetch(key)`: Synchronously return the value which was last called with `store(value, key)`, or if that method was never called with the given `key`, then return `undefined`.
- `output(value)`: Synchronously, iteratively call each listening stream with `value`.
- `store(value)`: Synchronously write `value` to memory, to be retrieved later on with `fetch()`. (Note: After `value` is written to memory, a background thread is called to persist the storage to disk.)
- `store(value, key)`: Synchronously write `value` to memory, at the specified `key`, to be retrieved later on with `fetch(key)`. (*TODO*: Given the extra complexity introduced by key-specific storage, evaluate whether it is necessary.)

#### Branch object

A **branch object** is an object which has one or more children. It is defined as code in the Chil language. This code is "platform-agnostic", in the sense that, ideally, it is designed to implement a level of abstraction above the concerns of any specific platform.

A branch object is constructed from a "schema file", which is a file in valid [YAML](http://yaml.org/spec/1.2/spec.html) format, containing a single dictionary, whose keys are the names of streams, and whose values are "delegates":

#### Delegate

A **delegate** is a reference to a stream of a child of a branch object. The stream is the "owner" of the delegate. A delegate handles all incoming values sent to its owner, and it sends outgoing values on behalf of its owner's output. The syntax of a delegate includes the file path of a component's source code, plus some identifying information about the particular child object and stream being referenced:

```yaml
[component file path][!][ @object name][ *stream name][: constructor]
```

(Note that the brackets are not literal: They indicate the bounds of part of the syntax.)

