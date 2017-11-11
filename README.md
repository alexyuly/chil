## *Please note that this project and readme are currently an active work in progress.*

# `vocalize`
a framework for pure-data web applications, for Node.js and Chrome

Copyright &copy; 2017 Alex Yuly

## Motivation

Many software applications deal with manipulating and delivering information to human or machine users, but most of these applications model data indirectly, in terms of instructions interpreted by computer processors. This makes application development needlessly inefficient, because these coded models can only produce useful information at runtime, which obfuscates it during development. Many different algorithms can be used to model a given set of data over time, so application developers tend to repeatedly solve the same problems in various suboptimal ways.

If modeling data flow and user experience is more important than modeling CPU execution and memory allocation, then an application should entirely encapsulate all imperative processing within a higher level of abstraction. In such a data-driven model, fundamental units of execution would be encapsulated within strongly typed operations and combined into reusable components. Each component would be solely responsible for how it processes incoming data, and for what and when it delivers data to a constant set of other components. This stands in stark contrast to many so-called "object-oriented" systems (which are nothing more than collections of subroutines loosely grouped by topic), in which any object may be responsible for managing the behavior of any other objects. In such a system, data and control are tightly coupled, but in a *pure-data* system like `vocalize`, every expression is data including the relationships amongst data, while control is an abstract convention built into the framework.

## Specification

### The *VOCAL* Design Principle

`Values |> Operations |> Components |> AppLication`

...or in JavaScript: `Application(Components(Operations(Values)))`

*VOCAL* is an acronym for a design principle that enforces a hierarchy of responsibility within an application, expressed through forward function application:

- Values: sources and sinks of strongly typed data
- Operations: normalized units of execution that map *n* sources to a sink
- Components: directed graphs of connected operations that map *n* sources to a sink
- Application: a component with a "runnable source" of command line arguments
- L... live long and prosper 🖖

*VOCAL* models the interactions of components which speak amongst themselves but never control each other directly. It is the fusion of functional reactive [streams](https://cycle.js.org/streams.html) with the pure object-orientation of [Smalltalk](https://en.wikipedia.org/wiki/Smalltalk#Object-oriented_programming), with absolutely zero imperative syntax.

### Usage of JSON

The `vocalize` runtime engine is built on Node.js, so it adopts JSON as its type notation format out of convenience and utility. Each operation, component, and application in `vocalize` is a type definition in `.word` format, a subset of JSON specific to `vocalize`. Each type definition defines relationships to other type definitions, which define a directed graph that models the behavior of the type.

### Static Type System

All type names are notated as strings, which may contain spaces or any other valid JSON characters. Conventionally, all type names should be notated in lower case with spaces added between words.

### Specific Value Types

There are three *specific value types*:

- `"number"`: A valid JSON number
- `"string"`: A valid JSON string
- `"boolean"`: A valid JSON boolean

### Generic Value Types

A *generic type* (of which there are "values" and "operations") is a function of one or more other types called *type arguments*.

There are two *generic value types*: vectors and structs.

#### vector

A vector is a JSON array with values all of a single type argument `Type`:
```
{
    "vector": Type
}
```

#### struct

A struct is a JSON object defined by a distinct combination of distinct keys each associated with a type argument:
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

### Operation Types

An operation type is a kind of generic type with an encapsulated behavior which is implemented by a *normalized unit of execution*. This is a Node.js module that runs a block of code beyond the scope of the `vocalize` runtime engine, such as a native feature from JavaScript, Chrome, Node.js, or any other executable resource available to `vocalize` at runtime. Moreover, this block of code must be *normalized*, meaning that it should be impossible to reduce to a composition of any other `vocalize` operations. 

#### Sources

Each operation type has between *0* and *n* sources inclusive, each associated with a name and a type. A source acts as an incoming event queue for an operation, to which *n* other operation sinks which match the source's type may broadcast events asynchronously, as defined by a component type. Immediately upon receipt of an event, the operation calls a private method associated with the event's source, in order to accomplish two important tasks:
1. reduce the operation's next state, if any, as a function of its current state and its event queues
2. push events out of its sink, if any, synchronously or asynchronously

#### Sinks

Each operation has either *0* or *1* sink, associated with a type. A sink broadcasts data to *n* other operation sources which match its type.

#### Headless Operations

An operation with *0* sources is called a *headless operation*. Such an operation is associated with "purely input" tasks like mouse and keyboard events, 

#### Tailless Operations

An operation with no sink is called a *tailless operation*. Such an operation is associated with "purely output" tasks like printing, rendering, and outgoing network requests.

An operation must have at least *1* source OR *1* sink. Otherwise, it would be unusable within a component and therefore worthless.

#### Type Definitions

An operation type has an associated *type definition* which is a JSON-formatted `.word` file. For example, `delay.word`, which is part of the `vocalize` "core" set of operation types, reads like so:
```
{
    "operation": "delay",
    "sources": {
        "feed": {
            "of": "number"
        }
    },
    "sink": {
        "of": null
    }
}
```
Note that the type *definition* does not contain the *type implementation*. The Node.js implementation is a separate file with a `.word.js` extension and an otherwise matching name, located in the same directory as the `.word` file.

#### Abstract Operations

#### Type Templates, Type Matching, and `null` Type



#### Type Aliases

An instance of a generic type may be aliased by defining a `.word` file notated like this:
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

### Component Types

### Application Types

#### Runnable Sources
