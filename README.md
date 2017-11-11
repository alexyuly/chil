## *Please note that this project and readme are currently an active work in progress.*

# `vocalize`
a framework for pure-data web applications, for Node.js and Chrome

Copyright &copy; 2017 Alex Yuly

## Motivation

Many software applications deal with manipulating and delivering information to human or machine users, but most of these applications model data indirectly, in terms of instructions interpreted by computer processors. This makes application development needlessly inefficient, because these coded models can only produce useful information at runtime, which obfuscates it during development. Many different algorithms can be used to model a given set of data over time, so application developers tend to repeatedly solve the same problems in various suboptimal ways.

If modeling data flow and user experience is more important than modeling CPU execution and memory allocation, then an application should entirely encapsulate all imperative processing within a higher level of abstraction. In such a data-driven model, fundamental units of execution would be encapsulated within strongly typed operations and combined into reusable components. Each component would be solely responsible for how it processes incoming data, and for what and when it delivers data to a constant set of other components. This stands in stark contrast to many so-called "object-oriented" systems (which are nothing more than collections of subroutines loosely grouped by topic), in which any object may be responsible for managing the behavior of any other objects. In such a system, data and control are tightly coupled, but in a *pure-data* system like `vocalize`, every expression is data including the relationships amongst data, while control is an abstract convention built into the framework.

## Specification

### The *VOCAL* Design Principle

*VOCAL* is an acronym for a software design principle that enforces the use of compositional design, through an inheritance hierarchy of four classes of responsibility:

- Value: a source or sink of strongly typed data
- Operation: a value which is composed of source and sink values, connected by a native implementation
- Component: an operation which is composed of other operations with connected sources and sinks
- Application: a component with a "runnable source" of command line arguments
- L... live long and prosper 🖖

Value is an ancestral class from which Operation inherits, from which Component inherits, from which Application inherits.

*VOCAL* models the interactions of components which speak amongst themselves but never control each other directly. It is the fusion of functional reactive [streams](https://cycle.js.org/streams.html) with the pure object-orientation of [Smalltalk](https://en.wikipedia.org/wiki/Smalltalk#Object-oriented_programming), with absolutely zero imperative syntax.

### Usage of JSON

The `vocalize` runtime engine is built on Node.js, so it adopts JSON as its type notation format out of convenience and utility. Each operation, component, and application in `vocalize` is a type definition in `.word` format, a subset of JSON specific to `vocalize`. Each type definition defines relationships to other type definitions, which define a directed graph that models the behavior of the type.

### Static Type System

`vocalize` uses a strong static type system to enforce the types of connections allowed within its component graph. All type names are notated as strings, which may contain spaces or any other valid JSON characters. Conventionally, all type names should be notated in lower case with spaces added between words.

### Specific Value Types

A *specific value type* is a given set of specific values.

- JavaScript Numbers: `"number"`
- JavaScript Strings: `"string"`
- JavaScript Booleans: `"boolean"`

### Generic Value Types

A generic type is a function of other types called *type arguments*. There are two *generic value types*: vectors and structs.

#### vector

A vector type is the set of JavaScript Arrays with values of a single type argument `Type`, of the following form:
```
{
    "vector": Type
}
```

#### struct

A struct type is the set of JavaScript Objects defined by a specific combination of distinct keys each associated with a type argument, of the following form:
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

### Union Types

A *union type* is a union of other types, which may be notated as an array of types. The union of all types, sometimes called "any type", is notated as `null`.

Some types are implicit unions of other types. If type A is a *subset* of type B, then type A can be *applied* to type B, because type B is a union of type A and some other set.

### Type Templates

A *type template* defines the domain for each argument of a generic type. A template is notated as an object with a set of distinct keys which are names of type arguments, each of which is associated with a type which is the union of all types that may be applied to the argument.

### Operation Types

An *operation type* is a value type which is composed of other value types in the form of an optional type template, 0 or more sources, and an optional sink. Each operation type has a *type definition* of the following form:
```
{
    "operation": OperationTypeName,
    "template": {
        "Argument1": Argument1UnionType,
        "Argument2": Argument2UnionType,
        ...
    },
    "sources": {
        "a": {
            "of": AType
        },
        "b": {
            "of": BType
        },
        ...
    },
    "sink": {
        "of": SinkType
    }
}
```

An operation type with no template is notated with just the name of the type. A specific instance of a generic operation type (one with a template) is notated as an object with one key that is the type name, whose value implements the type template.
```
{
    OperationTypeName: {
        "Argument1": Argument1Type,
        "Argument2": Argument2Type,
        ...
    }
}
```

#### Sources

Each operation type has 0 or more sources, each associated with a name and a type. A source acts as an incoming event queue for an operation, to which 0 or more other operation sinks which match the source's type may broadcast events asynchronously, as defined by a component type. Immediately upon receipt of an event, the operation calls a native method that is associated with the event's source, in order to accomplish two important tasks:
1. reduce the operation's next state, if any, as a function of its current state and its event queues
2. push events out from its sink, if any, synchronously or asynchronously

#### Sinks

Each operation has either 0 or 1 sink, associated with a type. A sink broadcasts data to 0 or more other operation sources which match its type.

#### Native Implementation

An operation type's specific behavior is implemented by a Node.js module which controls its sources and sinks and runs methods which are beyond the scope of the `vocalize` runtime engine, such as native features from JavaScript, Chrome, Node.js, or any other executable resource available to `vocalize` at runtime. Moreover, the behavior of each implementation must be *normalized*, meaning that it cannot be reduced to a composition of any other `vocalize` operations. 

#### Headless Operations

An operation with 0 sources is called a *headless operation*. Such an operation is associated with a "purely input" task like mouse and keyboard events, and incoming network responses.

#### Tailless Operations

An operation with no sink is called a *tailless operation*. Such an operation is associated with a "purely output" task like printing, rendering, and outgoing network requests.

An operation must have at least 1 source OR 1 sink. Otherwise, it would be unusable within a component and therefore worthless.

*TODO - explain type definition and implementation file formats*

#### Abstract Operation Types

An abstract operation type has no associated Node.js implementation. It is simply an operation type definition with sources and sinks, which must be implemented by a "subtype" in order to be used in components.

#### Type Aliases

Any type may be associated with a new name called a *type alias*.
```
{
    "alias": AliasTypeName
    "of": Type
}
```

*TODO - describe generic type aliases

### Component Types

A component type is an operation type which is composed of other operation types with connected sources and sinks. There is no associated JavaScript implementation. The vast majority of a `vocalize` developer's time will be spent writing components, and not operations.

*TODO*

### Application Types

An application type is a component type which has a *runnable source*.

*TODO*

#### Runnable Sources
