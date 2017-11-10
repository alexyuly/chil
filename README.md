## *Please note that this project and readme are currently an active work in progress.*

# `vinescape`
a framework for pure-data web applications, for Node.js and Chrome

Copyright &copy; 2017 Alex Yuly

## Motivation

Many software applications deal with manipulating and delivering information to human or machine users, but most of these applications model data indirectly, in terms of instructions interpreted by computer processors. This makes application development needlessly inefficient, because these coded models can only produce useful information at runtime, which obfuscates it during development. Many different algorithms can be used to model a given set of data over time, so application developers tend to repeatedly solve the same problems in various suboptimal ways.

If modeling data flow and user experience is more important than modeling CPU execution and memory allocation, then an application should entirely encapsulate all imperative processing within a higher level of abstraction. In such a data-driven model, fundamental units of execution would be encapsulated within strongly typed operations and combined into reusable components. Each component would be solely responsible for how it processes incoming data, and for what and when it delivers data to a constant set of other components. This stands in stark contrast to many so-called "object-oriented" systems (which are nothing more than collections of subroutines loosely grouped by topic), in which any object may be responsible for managing the behavior of any other objects. In such a system, data and control are tightly coupled, but in an *pure-data* system like `vinescape`, every expression is data including the relationships amongst data, and control is an abstract convention built into the framework.

## Specification

### The *VOCAL* Design Principle

`Values |> Operations |> Components |> AppLication`

...or in JavaScript: `Application(Components(Operations(Values)))`

*VOCAL* is an acronym for a design principle that enforces a hierarchy of responsibility within an application, expressed through forward function application:

- Values: sources and sinks of strongly typed data
- Operations: normalized units of execution that map *n* sources to a sink
- Components: directed graphs of connected operations that map *n* sources to a sink
- Application: a component with a runnable source
- L... live long and prosper 🖖

One way to think of *VOCAL* is components talking to other components to which they have a relationship. It is a realization of complete, pure *object-oriented* encapsulation in the truest sense. It is the application of [functional reactive programming](https://cycle.js.org/streams.html) to the brilliant ideas that underpin [Smalltalk](https://en.wikipedia.org/wiki/Smalltalk#Object-oriented_programming), with absolutely zero imperative syntax.

### Usage of JSON

JSON (JavaScript Object Notation) is the defacto data markup language of the Web. `vinescape` adopts it out of convenience and utility. JSON offers an excellent balance between simplicity and expressive power, and it interfaces seamlessly with JavaScript. The `vinescape` runtime engine is built on Node.js, and each `vinescape` type definition, including applications, components, and operations, is notated as a `.vine` file in JSON format.

### Static Type System

All type names are notated as strings, which may contain spaces or any other valid JSON characters. Conventionally, all type names should be notated in lower case with spaces added for names with multiple words. A type in `vinescape` is like a common noun in English.

### Value Types

A value type is notated with the name of the type and nothing more.

- number type: notated as `"number"`
- string type: notated as `"string"`
- boolean type: notated as `"boolean"`

### Generic Types

A generic type is a type which is a function of one or more other types. It is notated as an object with a single key which is the name of the type, and whose value is 1 or more type arguments. There are two basic generic types, vectors and structs.

#### vector

A vector is a type of data backed by a JSON array. Unlike an array, its values are all of a single type `Type`, notated like this:
```
{
  "vector": Type
}
```

#### struct

A struct is a type of data backed by a JSON object. Unlike an object, a single combination of keys and types forms a single type of struct, notated like this:
```
{
  "struct": {
    "Key A": A,
    "Key B": B,
    "Key C": C,
    ...
  }
}
```

#### Type Aliases

An instance of a generic type may be aliased by defining a `.vine` file notated like this:
```
{
  "alias": "my struct",
  "of": {
    "struct": {
      "Name": "string",
      "Phone": "number",
      "Emails": {
        "vector": "string"
      }
    }
  }
}
```

### `null` Type

A type which is the union of all other types is expressed as `null`. The `null` type is useful for generic type templates and when working with external JSON data containing mixed arrays. Within the context of data flow it is not common, because application to a more specific type is strictly prohibited, and `null` is the "most generic" type possible, so a `null` typed value may never be cast. 

### Operation Types

An operation is a flavor of generic type which is backed by a *fundamental unit of execution*. A FUE (pronounced "fuey") is a JavaScript module which implements a normalized unit of behavior that is beyond the scope of `vinescape` itself, such as core arithmetic like addition and multiplication, a native feature of Node.js or Chrome, or some external library.

#### Type Templates and Application

#### Sources

#### The Sink

#### Abstract Operations

### Component Types

### Application Types
