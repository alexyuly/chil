# *Please note that this project and readme are currently an active work in progress.*

# `vinescape`
a specification for informative applications, for Node.js and Chrome

Copyright &copy; 2017 Alex Yuly

## Motivation

Many software applications deal with processing and delivering *information* to users, but most of these applications model information indirectly in terms of *instructions* delivered to computer processors. This makes application development needlessly inefficient, because these models must be reduced to information at runtime, which obscures it during development. Many possible sets of instructions exist to model any set of information, so application developers tend to repeatedly solve the same problems for users in various suboptimal ways.

If modeling user experience is more important than modeling CPU execution and memory allocation, then a primary design goal should be to entirely encapsulate all imperative processing within a higher level of abstraction. In this user-oriented model, a finite set of strongly typed operations would be combined into reusable components, instantiated as nodes on a directed graph through which data "flows". Each node would be solely responsible for *what* data it delivers, and *when*, to a constant set of other nodes: This stands in stark contrast to many so-called "object-oriented" systems (which are really *controller-oriented*), in which any node may be responsible for managing the behavior of any other nodes. In such a system, data and control are tightly coupled, but in an *informative* system, every expression is data including the relationships amongst data, and control is an abstract convention built into the framework.

## Usage of JSON

JSON (JavaScript Object Notation) is the defacto data markup language of the Web. `vinescape` components are notated using JSON, so `vinescape` uses a type system based on JSON and JavaScript. `vinescape` has a strong static type system based on JSON's native types, and this type system itself is notated with JSON. 

## Native Types

All *native types* notated as lowercase strings, which may contain spaces or any other unicode characters. Native types come in two categories, *value types* and *operation types*.

### Value Types

Value types are types over some domain of quantifiable values.

- union of all types: notated as `null`
- number type: notated as `"number"`
- string type: notated as `"string"`
- boolean type: notated as `"boolean"`
- vector type: notated as `{ "vector": Type }` given a type `Type`
  - vector is similar to JSON Array, but it contains values all of a single type (which may be `null`)
  - note that vector takes a generic *type argument*: this makes it a *parameterized type*
- struct type: notated as `{ "struct": { "Key A": A, "Key B": B, ... } }` given a set of types `A, B, ...` each associated with a key
  - struct is similar to JSON Object, but it contains a constant set of keys each associated with a constant type
  - struct is a parameterized type
  
### Parameterized Types

### Aliased Types

### Operation Types

## Component Types
