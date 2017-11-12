## *Please note that this project and readme are currently an active work in progress.*

# `vocalize`
a framework for pure-data web applications, for Node.js and Chrome

Copyright &copy; 2017 Alex Yuly

## Abstract

`vocalize` is a specification and runtime engine for applications expressed purely with JSON data, built on Node.js.

## Design Motivation

Many software applications deal with manipulating and delivering information to human or machine users, but most of these applications model data indirectly, in terms of instructions sequentially interpreted by computer processors. This makes application development needlessly inefficient, because only at runtime do these coded models provide useful information, which is obfuscated during development. Various algorithms can be used to model a given set of data over time, so application developers tend to repeatedly solve the same problems in various suboptimal ways.

If an application's model of data flow and user experience is more significant than CPU execution and memory allocation, then we should encapsulate all its imperative processing within a higher level of abstraction. In such a data-driven model, units of native execution would be subsumed within strongly typed operations and combined into reusable components. Each component would be solely responsible for how it reacts to incoming data, how it pipes data through its operations, and when and what it broadcasts to listeners. This stands in stark contrast to many so-called "object-oriented" systems (which are nothing more than collections of subroutines loosely grouped by topic), in which any objects may be responsible for managing the behavior of any other objects. In such a system, data and control are tightly coupled, but in a *pure-data* system like `vocalize`, every expression is data including the relationships amongst data, while control is an abstract convention built into the framework.

## Specification

### 1 Behaviors

#### 1.1 The *VOCAL* Design Principle

`vocalize` is based on *VOCAL*, a proposed design principle for software applications, which enforces a vertical hierarchy of four "type classes" called *behaviors*:

- Value: a source or sink of strongly typed data
- Operation: a value which is composed of source and sink values, with a well-defined execution plan
- Component: an operation which is composed of other operations with connected sources and sinks
- AppLication: a component with a "runnable source" of command line arguments

Each behavior contains *IS* and *HAS* relationships with the other behaviors:
1. An application *IS A* component, which *IS AN* operation, which *IS A* value.
2. Values *MUST NOT HAVE* operations, which *MUST NOT HAVE* components, which *MUST NOT HAVE* applications.

*VOCAL* models the interactions of types of behaviors which communicate, but never query or control each other directly. It is a fusion of functional reactive [streams programming](https://cycle.js.org/streams.html) with the pure object-orientation of [Smalltalk](https://en.wikipedia.org/wiki/Smalltalk#Object-oriented_programming), with no imperative syntax.

### 1.2 Names, Types, and Generics

A *name* is a JSON string which identifies a type or generic. A *type* is a set of specific values. A *generic* is a function of one more types called *arguments*, which returns a type. A *derived type* has an associated generic, and it is expressed as a JSON object with a key of generic name, paired with a value of type arguments in a form required by the generic. A *non-derived type* has no generic and is expressed simply as the type name.

###### (Figure 1.2) A non-derived type with name `TypeName`
```
TypeName
```

###### (Figure 1.3) A derived type with generic name `GenericName` and many arguments
```
{
    GenericName: {
        TypeArgumentKey1: TypeArgument1,
        TypeArgumentKey2: TypeArgument2,
        ...
    }
}
```

**Please note:** Each Pascal-case identifier in Figures 1.2 and 1.3 which is invalid JSON, such as `GenericName`, is a placeholder which must be replaced by a valid name, type, or type argument, in order to produce a valid `vocalize` expression from a figure. Each ellipsis (`...`) indicates "many" elements which follow a given pattern.

### 1.3 Type Unions

#### 1.3.1 Explicit unions

A *type union* is a union of other types, which may be expressed as a JSON array of other types.

###### (Figure 1.3.1) An explicit type union
```
[
    Type1,
    Type2,
    ...
]
```

#### 1.3.2 Any Type

The union of all types globally is called *Any Type* and is expressed as `null`.

#### 1.3.3 Implicit unions

*TODO*

### 1.4 Values

#### 1.4.1 Non-Derived Value Types

- Type `"number"` is the set of all JavaScript numbers.
- Type `"string"` is the set of all JavaScript strings.
- Type `"boolean"` is the set of all JavaScript booleans.

#### 1.4.2 Value Generics

- Generic `"vector"` returns a type which is the set of JavaScript Arrays each with elements all of a single type argument.

```
{
    "vector": Type
}
```

- Generic `"struct"` returns a type which is the set of JavaScript Objects each defined by one combination of pairs of distinct keys and type arguments.
```
{
    "struct": {
        "Key A": TypeA,
        "Key B": TypeB,
        ...
    }
}
```

*TODO...*

### Operations

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

An operation type with no template is notated with just the name of the type, for example, `"delay"`. A specific operation type instantiated from a generic operation type is notated as an object with one key that is the type name, whose value implements the type template:
```
{
    OperationTypeName: {
        "Argument1": Argument1Type,
        "Argument2": Argument2Type,
        ...
    }
}
```

### Operation Generic Templates

A *type template* defines the domain for each argument of a generic type. A template is notated as an object with a set of distinct keys which are names of type arguments, each of which is associated with a type which is the union of all types that may be applied to the argument.

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

An abstract operation type has no associated Node.js implementation. It is a standalone operation type definition which must be implemented by a "subtype" in order to be instantiated in components. An abstract operation type is the union of all its subtypes.

#### Type Aliases

Any type may be associated with a kind of type definition called a *type alias*, which may be generic.
```
{
    "alias": AliasTypeName,
    "template": AliasTypeTemplate,
    "of": Type
}
```

### Component Types

A component type is an operation type which is composed of other operation types with connected sources and sinks. There is no associated JavaScript implementation. The vast majority of a `vocalize` developer's time will be spent writing components, and not operations.

*TODO*

### Application Types

An application type is a specific component type which has a source named `"runnable"` of type `{ "vector": "string" }`, which broadcasts one event with command line arguments on application start-up. An application may not be generic because a generic component must be instantiated by another component, and an application is instantiated directly by the `vocalize` runtime engine, from the command line.

An application type may have a sink, which is routed to a debug logger.

For example, a simple application which prints its command line arguments, one by one:
```
{
   "component": "print arguments",
   "sources": {
       "runnable": {
           "of": {
               "vector": "string"
           },
           "to": {
               "Chain": "feed"
           }
       }
   },
   "operations": {
       "Chain": {
           "of": {
               "chain": "string"
           },
           "to": {
               "Print": "feed"
           }
       },
       "Print": {
           "of": "print"
       }
   }
}
```
