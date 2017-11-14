## *Please note that this project and readme are currently an active work in progress.*

# `vocalize`
a framework for pure-data web applications, for Node.js and Chrome

Copyright &copy; 2017 Alex Yuly

## Abstract

`vocalize` is a specification and runtime engine for applications expressed purely with JSON data, built on Node.js.

## Design Motivation

Many software applications deal with manipulating and delivering information to human or machine users, but most of these applications model data indirectly, in terms of instructions sequentially interpreted by computer processors. This makes application development needlessly inefficient, because only at runtime do these coded models provide useful information, which is obfuscated during development. Various algorithms can be used to model a given set of data over time, so application developers tend to repeatedly solve the same problems in various suboptimal ways.

If an application's model of data flow and user experience is more significant than CPU execution and memory allocation, then we should encapsulate all its imperative processing within a higher level of abstraction. In such a data-driven model, units of execution would be subsumed within strongly typed operations and combined into reusable components. Each component would be solely responsible for how it reacts to incoming data, how it pipes data through its operations, and when and what it broadcasts to listeners. This stands in stark contrast to many so-called "object-oriented" systems which are no more than collections of subroutines loosely grouped by topic, in which any objects may be responsible for managing the behavior of any other objects. In such a system, data and control are tightly coupled, but in a *pure-data* system like `vocalize`, every block of code is an expression of data which includes the relationships amongst data, and control is an abstract convention built into the framework.

## Specification

This specification contains figures which describe various `vocalize` JSON expressions, with Pascal-case "identifiers" in place of keys or values which must be replaced in order to produce valid expressions. An ellipsis (`...`) indicates a repeating pattern based on the preceding two elements.

### 1 Behavior

`vocalize` is based on *VOCAL*, a proposed design principle for software applications, which enforces a vertical hierarchy of four "type classes" called *behaviors*:

- Value: a source or sink of strongly typed data
- Operation: a value which is composed of source and sink values, with a well-defined execution plan
- Component: an operation which is composed of other operations with connected sources and sinks
- AppLication: a component with a "runnable source" of command line arguments

Each behavior contains *IS* and *HAS* relationships with the other behaviors:
1. An application *IS A* component, which *IS AN* operation, which *IS A* value.
2. Values *MUST NOT HAVE* operations, which *MUST NOT HAVE* components, which *MUST NOT HAVE* applications.

*VOCAL* models the interactions of types of behaviors which communicate, but never query or control each other directly. It is a fusion of functional reactive [streams programming](https://cycle.js.org/streams.html) with the pure object-orientation of [Smalltalk](https://en.wikipedia.org/wiki/Smalltalk#Object-oriented_programming), with no imperative syntax.

### 2 Name

A *name* is a JSON string which identifies a type or generic. Some names are "inherent" to `vocalize`, which means they may be referenced globally. Some names are "dependencies" which means their definitions and implementations must be retrieved from an external source defined within a definition which depends on them. Only components and applications may have dependencies, which are explained in those sections of the specification.

### 3 Type

A *type* is a set over a domain of values.

#### 3.1 Non-Derived Type

A *non-derived type* has no generic and is expressed simply as the type name.

###### (Figure 3.1) A non-derived type with name `TypeName`
```
TypeName
```

#### 3.2 Generic

A *generic* is a function of one more types called *arguments*, which returns a type.
 
#### 3.3 Derived Type

A *derived type* is the result of applying arguments to a generic, and it is expressed as a JSON object with one key which is the generic name, paired with type arguments in a form required by the generic.

###### (Figure 3.3) A derived type with generic name `GenericName` and many arguments
```
{
    GenericName: {
        TypeArgumentKey1: TypeArgument1,
        TypeArgumentKey2: TypeArgument2,
        ...
    }
}
```

#### 3.4 Type Union

##### 3.4.1 Explicit type union

An *explicit type union* is a union of types expressed as a JSON array of other types.

###### (Figure 3.4.1) An explicit type union
```
[
    Type1,
    Type2,
    ...
]
```

##### 3.4.2 Any Type

The union of all types globally is called *Any Type* and is expressed as `null`.

### 4 Value

#### 4.1 Non-Derived Value Types

- Type `"number"` is the set of all JavaScript numbers.
- Type `"string"` is the set of all JavaScript strings.
- Type `"boolean"` is the set of JavaScript booleans, `true` and `false`.

#### 4.2 Vector Value Generic

Generic `"vector"` returns a value type which is the set of JavaScript Arrays each with elements all of a single value type argument. The type argument *MUST* be a value type.

###### (Figure 4.2) A vector type
```
{
    "vector": ValueType
}
```

#### 4.3 Struct Value Generic

Generic `"struct"` returns a value type which is the set of JavaScript Objects each defined by one combination of pairs of distinct keys and value type arguments. The type arguments *MUST* all be value types.

###### (Figure 4.3) A struct type
```
{
    "struct": {
        ValueTypeArgumentKey1: ValueTypeArgument1,
        ValueTypeArgumentKey2: ValueTypeArgument2,
        ...
    }
}
```

### 5 Operation

#### 5.1 Operation Defintion

An *operation defintion* is a file with an extension of `.word`, in JSON format, which declares the traits of a new operation type or generic which is composed of a name, an optional generic template, at least one source, and an optional sink. The name of the file, excluding the `.word` extension, should be equivalent to the name of the operation type or generic.

###### (Figure 5.1) An operation type defintion
```
{
    "name": OperationName,
    "behavior": "operation",
    "generic": {
        TypeArgumentKey1: TypeArgument1,
        TypeArgumentKey2: TypeArgument2,
        ...
    },
    "sources": {
        Source1Name: {
            "of": Source1Type
        },
        Source2Name: {
            "of": Source2Type
        },
        ...
    },
    "sink": {
        "of": SinkType
    }
}
```

##### 5.1.3 Operation Generic Template

Each operation type definition may have a optional key called `"generic"`, paired with a *generic template*. A generic template is a JSON object which defines the type arguments for an operation generic in terms of pairs of distinct keys and type arguments. The arguments *MUST* all be value or operation types. When the generic is "called" with specific arguments, those arguments must "match" the template which means they are also in the form of a JSON object with the same keys, each paired with a type which is a subset of the corresponding type defined by the template. A type argument key may be referenced in any place within the type definition for which a type must be specified, including other type arguments so long as no cycles exist between arguments.

##### 5.1.4 Operation Sources and Sink

Each operation type definition must have a key called `"sources"`, paired with a JSON object which has one or more keys which are names of sources, each paired with a JSON object with a single key called `"of"` paired with the type of the source. Each definition may also have a key called `"sink"` paired with a JSON object in the same format as a source. Within a component, operations are composed by connecting the sink from one operation to a source from another by referencing the name of the source. Each operation source has an associated *event queue*, which is a JavaScript Array of values of the source type. Immediately after an operation sink "broadcasts" an event, then for each connected source, it is pushed onto the end of associated event queue and a native JavaScript method is called which may broadcast 0 or more events from the associated sink, synchronously or asynchronously.

#### 5.2 Operation Implementation

An *operation implementation* is a JavaScript file with a extension of `.word.js`, which contains a Node.js module with a default class export. The class must meet three requirements:
1. Extend `Operation`, which is a class that is part of the `vocalize` runtime engine.
2. Implement a constructor which calls `super` with the operation type or generic name.
3. Implement a method for each operation source name, which is called immediately after a new event is pushed onto the source event queue. Each method may perform three kinds of actions:
  - Manipulate any source event queue, which is an Array of values of the source type, returned by `this.events(SourceName)`.
  - Broadcast an event of the sink type from the operation sink by calling `this.broadcast(Event)`.
  - Read and update private state, start and stop external resources, or manage any other actions which fall outside the `vocalize` operation lifecycle.

The name of the file, excluding the `.word.js` extension, should be equivalent to the name of the operation type or generic.

###### (Figure 5.2) An operation type implementation
```
module.exports = class OperationSubclass extends Operation {
    constructor() {
        super(OperationName)
    }
    OperationSourceName1() {
        OperationSourceImplementation1()
    }
    OperationSourceName2() {
        OperationSourceImplementation2()
    }
    ...
}]
```

#### 5.3 Abstract Operation

##### 5.3.1 Abstract Operation Definition

An operation definition is *abstract* if it contains a key called `"abstract"` paired with `true`. An abstract operation has no JavaScript implementation, but instead it has subclasses each with the same sources and sink, but each has a unique implementation. As with all operation defintions, an abstract operation definition may be generic.

###### (Figure 5.3.1) An abstract operation defintion
```
{
    "name": AbstractOperationName,
    "behavior": "operation",
    "abstract": true,
    "generic": OperationGenericTemplate,
    "sources": OperationSources,
    "sink": OperationSink
}
```

##### 5.3.2 Abstract Operation Subclass Definition

An operation definition is an *abstract subclass* definition if it contains a key called `"of"`, instead of `"sources"` and `"sinks"`, which is paired with an abstract operation type inherited by this subclass.

###### (Figure 5.3.2) An abstract operation subclass defintion
```
{
    "name": AbstractOperationSubclassName,
    "behavior": "operation",
    "generic": OperationGenericTemplate,
    "of": AbstractOperationType
}
```

### 6 Component

*TODO*

### 7 Application

*TODO*
