## *Please note that this project and readme are currently an active work in progress.*

# `vinescape`
a framework for pure-data web applications, for Node.js and Chrome

Copyright &copy; 2017 Alex Yuly

## Motivation

Many software applications deal with processing and delivering information to human or machine users, but most of these applications model data indirectly in terms of instructions delivered to computer processors. This makes application development needlessly inefficient, because these coded models must execute to be reduced to useful information at runtime, which obfuscates the information during development. Many possible algorithms exist to model any set of data over time, so developers tend to repeatedly solve the same problems for users in various suboptimal ways.

If modeling data flow and user experience is more important than modeling CPU execution and memory allocation, then the primary design goal of an application should be to entirely encapsulate all imperative processing within a higher level of abstraction. In this data-driven model, a finite set of strongly typed operations would be combined into reusable components, instantiated as nodes on a directed graph through which data flows. Each node would be solely responsible for what data it delivers and when, to a constant set of other nodes: This stands unfortunately in stark contrast to many so-called "object-oriented" systems (which are really nothing more than collections of subroutines loosely grouped by topic), in which any node may be responsible for managing the behavior of any other nodes. In such a system, data and control are tightly coupled, but in an *pure-data* system, every expression is data including the relationships amongst data, and control is an abstract convention built into the framework.

## Specification

### Usage of JSON

JSON (JavaScript Object Notation) is the defacto data markup language of the Web. `vinescape` components are notated purely with JSON, so `vinescape` uses a type system based on JSON and JavaScript. `vinescape` has a strong static type system based on JSON's native types, and this type system itself is notated with JSON. 

### Type System

All type names are notated as strings, which may contain spaces or any other valid JSON characters. Conventionally, all type names should be notated in lower case with spaces added for names with multiple words. A type in `vinescape` is like a common noun in English.

#### Generic Types

A generic type must be *constructed* with another type called the *type argument*, which must conform to a *template* specified by the type. A generic type is notated as a JSON object with a single key which is the name of the type, whose value is the type argument.

TODO - add examples and docs for vector and struct

#### Value Types

A value types ia notated with the name of the type and nothing more.

- number type: notated as `"number"`
- string type: notated as `"string"`
- boolean type: notated as `"boolean"`

#### `null`

A type which is the union of all other types is expressed as `null`. The `null` type is useful for generic type templates and when working with external JSON data containing mixed arrays, but within the context of application logic it is not common because down-casting is strictly prohibited.

#### Operation Types

An operation is a generic type which is natively associated with a *fundamental unit of execution*. A FUE (say "fuey") is some execution which falls beyond the scope of `vinescape` itself, such as core arithmetic like addition and multiplication, a native feature of Node.js or Chrome, or some external library. 

##### Sources

##### The Sink

##### Abstract Operations

#### Component Types

#### Application Types

### "VOCA" Design Principle

Value|>Operation|>Component|>Application
