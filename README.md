# vocalize 🎤
***data driven runtime engine for Node.js and Chrome***

# This project is an active work in progress. Please check back for continuing updates.

## Introduction

Vocalize is a runtime engine for building applications with as little code as possible.

## Notation

Vocalize type definitions are notated with [YAML](http://yaml.org/), because of its brevity, readability, and interoperability with JSON.

## Types

A *type* defines a domain of data. Each type belongs to one of four fundamental *classes*: Value, Operation, Component, or Application.

### Type name

Each type has a *type name*, which is a string with any characters.

### Generic types

A type is *generic* if it requires *type arguments* which are a set of other types.

## Values

A *value* is an instance of a type which emits a stream of *events*.

### Events

An event is a literal representation of data, such as `"hello, world"`, `9000`, or `["a", "b", "c"]`.

### Value instance methods

A value has two methods, *connect* and *next*.

#### Value.connect ( value )

Adds another value as a *listener*. A value may only "connect" another value to which it applies. Type *A* "applies" to Type *B* if and only if Type *A* is a subset of Type *B*.

#### Value.next ( event )

Calls `next(event)` for each listener of the value. A value may only "next" an event which falls within its domain.

### Value types

- `number`: the set of all valid JavaScript numbers
- `string`: the set of all valid JavaScript strings
- `boolean`: `true` or `false`

### Value generic types

- `vector`: a set of JavaScript Arrays each with elements all of a single type argument
  - for example, `vector: string` or `vector: { vector: number }`
- `struct`: a set of JavaScript Objects each with the same keys with each key of a given type argument
  - for example, `struct: { id: number, name: string }`
  
### Value union types

A *value union type* is a list of other value types.
  - for example:
```
- number
- string
```

### Any value

The union of all value types is called "any value", which is notated as a hyphen: `-`.

## Operations

An operation is an instance of a type of value which composes other values. Class `Operation` extends `Value` and inherits its `connect` and `next` methods.

*TODO...*
