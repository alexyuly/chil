# `vinescape`
a specification for informative applications, for Node.js and Chrome

Copyright &copy; 2017 Alex Yuly

## Motivation

Many software applications deal with processing and delivering *information* to users, but most of these applications model information indirectly in terms of *instructions* delivered to computer processors. This makes application development needlessly inefficient, because these models must be reduced to information at runtime, which obscures it during development. Many possible sets of instructions exist to model any set of information, so application developers tend to repeatedly solve the same problems for users in various suboptimal ways.

If modeling user experience is more important than modeling CPU execution and memory allocation, then a primary design goal should be to entirely encapsulate all imperative processing within a higher level of abstraction. In this user-oriented model, a finite set of strongly typed operations would be combined into reusable components, instantiated as nodes on a directed graph through which data "flows". Each node would be solely responsible for *what* data it delivers, and *when*, to a constant set of other nodes: This stands in stark contrast to many so-called "object-oriented" systems (which are really *controller-oriented*), in which any node may be responsible for managing the behavior of any other nodes. In such a system, data and control are tightly coupled, but in an *informative* system, every expression is data including the relationships amongst data, and control is an abstract convention built into the framework.

## Usage of JSON

JSON (JavaScript Object Notation) is the defacto data markup language of the Web. `vinescape` components are notated using JSON, so `vinescape` uses a type system based on JSON and JavaScript. `vinescape` has a strong static type system based on JSON's native types, and this type system itself is notated with JSON.
