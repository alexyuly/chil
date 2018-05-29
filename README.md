# Chil

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license. See LICENSE.

## Introduction

Chil is a dynamic application programming language for expressing informational hierarchies formed by components. In fact, the name "Chil" is an acronym for "component hierarchy information language".

### Comparison vs. traditional object-oriented systems

#### Components

Traditional object-oriented systems organize components in classes, which expose methods for objects to use to invoke some action or retrieve data. Classes may extend other classes by overriding their methods, and therefore they are overriding their behavior. This approach prioritizes control flow over data flow, resulting in lots of flexibility over controlling the particular low-level operations of CPU and memory, and not much flexibility over manipulating the flow of information, i.e. inputs and outputs.

In contrast to classes, Chil objects are instances of ***components***, which are contracts of communication between instances of other types of components, organized within a tree. Low-level operations are strictly delegated to "leaf components" at the lowest level of the abstraction tree, which construct no other objects and whose behavior is derived from some relatively low-level code such as JavaScript. (It could even be C, if you love pain and need more performance.)

#### Hierarchy

Traditional object-oriented systems implement some form of communication hierarchy through keywords like "public" and "private". Each method is restricted from calling certain other methods, but there is no specific contract between each pair. Methods may unpredictably pass references around and call them at any time and place in code, resulting in couplings and complexity.

In Chil, object containment is defined by a directed, rooted tree. That is, there is a strict parent/child relationship between component types: If component A constructs an instance of component B, then component B *must not* construct an instance of component A, or the Chil compiler throws an error, since a cycle in type relationships would result in infinite recursion. Since all object construction happens synchronously at compile time, recursion in construction of objects is not possible. This apparent limitation is actually a strength, because it makes system behavior more predictable.

#### Information

Traditional object-oriented systems typically use "getters" and "setters" to read and write data. A Chil object never reads or mutates another object's data. Instead, it informs its listeners of some message and never receives direct responses. An object may only listen to messages from its siblings or parent, as defined by the component within which it is constructed. Once a component receives a message, it decides what actions to take. This kind of rigorous single-directional data flow makes 100% component decoupling possible. Components communicate by expressing information, rather than fetching or controlling information in another component. This reactive, asynchronous approach facilitates ***automation*** (instead of fetching) and ***encapsulation*** (instead of controlling). Automation and encapsulation outrank all other concepts for their importance in high-level software systems design.

## Principles

### Isolation of algorithms

As a language, Chil aims to isolate algorithms to the lowest possible level of abstraction, relying on pure data flow for high level processing, in the form of objects expressed as compositions of other objects. This results in a paradigm shift from thinking about "how" components interact with each other, to "what" is the contract between components, with the matter of low-level operations left to a combination of a core native runtime and supporting native modules.

### Code as data

Chil code is an explicit model of a system, rather than a set of instructions which implies the creation of such a system. This greatly reduces the conceptual distance between code and data. Components are blind to the procedural implementation of processes with which they are directly unconcerned, such as whether data is saved as "state" in the transient memory of the application or persisted as "files" in a database.

### Runtime agnostic

Because of its complete reliance on abstract data structures, Chil code is completely runtime agnostic, allowing any set of native runtime and modules to be used. The first Chil runtime will be implemented in Node.js, because of its broad applicability across clients and services, paired with a unified, modern language syntax found in JavaScript.

### Convention over configuration

Imports and dependency management are handled as automatically as possible by the Chil compiler: References to component types are resolved through the file system according to a well-defined traversal order, which eliminates the need to explicitly specify package imports.

## Specification

### Use of YAML

Chil code conforms to the [YAML 1.2 spec](http://yaml.org/spec/1.2/spec.html). YAML is well-suited to a language expressed purely as data.

### Components

The fundamental unit of application development in Chil is the ***component***. A component is a YAML document which contains a dictionary mapping stream names to references to streams. Two names are reserved for special use cases: `source` and `main`.

#### Component stream names

##### `source`

The name `source` is reserved for a reference to a stream which receives no incoming values. No other object may send values to this stream. This is useful for defining streams which are the original "source" of some data, with no prior inputs.

##### `main`

The name `main` is reserved for a reference to a stream which is the default input for incoming values. If another object sends values to an instance of this component without specifying an input name, those values are routed to `main`. 

##### Other stream names

All other names reference streams which are inputs for values sent to this component at that specific input name, as opposed to values sent to an unspecified input.

#### References to streams

Each key in a component's dictionary is mapped to a reference to a stream which exists within the component. These streams are constructed implicitly by Chil at compile time. Each stream is part of an object, which is an instance of a child component. A "reference to a stream" can be expressed in multiple forms:

1. the name of a component, for the main input of the single object of that type
  - for example, `echo`
2. the name of a component followed by an `@` ("at") *preposition* with a locally unique ID, for the main input of the locally unique instance of that component
  - for example, `document events @mousemove`
  - Note, if no id is provided, such as `document events @`, then a locally unique, anonymous instance is referenced. Since it is anonymous, it can't be referenced anywhere else.
3. one of (1) or (2), followed by an `->` ("arrow") *preposition* to the name of an input of that object
  - for example, `gate ->state`
  - or, for example, `delay @interval ->state`
  - Note, the whitespace around each preposition is not important: The Chil compiler trims whitespace around prepositions. However, it is conventional to format prepositions with a single leading space and no trailing space.
4. a key-value pair with a key of one of (1), (2), or (3), followed by a value passed to the object when it is initialized
  - This key-value pair is called a constructor. At most one constructor per object is allowed. Constructors are not required, and the location of the constructor within code is irrelevant. All objects are constructed for which exist at least one reference of any kind.
  - for example, `delay @interval: 500`
5. a connector object

#### Connector objects

Special ***connector objects*** form the basis of connections between streams of child objects within some parent component. A connector object behaves just like an instance of any component with a single `main` input stream, which receives incoming values and sends them out to all connected listeners.

The `pipe` connector is constructed with a list of references to streams. Incoming values are sent to the first stream in the list, whose object outputs to the second stream (if present), and so on, until values are sent to the overall pipe's output.

```yml
pipe:
  # in
  # |
  # v
  - stream 1
  # |
  # v
  - stream 2
  # |
  # v
  # etc...
  # |
  # v
  # out
```

##### `fork`

The `fork` connector is also constructed with a list of references to streams. Incoming values are synchronously sent to each of the streams, and the output from each stream's object is sent to the overall fork's output.

```yml
fork:
  # in
  # |
  # v
  - stream 1
  # |
  # v
  # out
  #
  # in
  # |
  # v
  - stream 2
  # |
  # v
  # out
  #
  # etc...
```

##### `branch`

The `branch` connector is constructed with a single reference to a stream. Incoming values are synchronously sent to the stream *and* the overall branch output. The stream's object output is also sent to the overall branch output.

```yml
branch:
  # in
  # |
  # v
  stream 
  # |
  # v
  # out
  #
  # in
  # |
  # v
  # out
```

##### `sink`

The `sink` connector is also constructed with a single reference to a stream. Incoming values are synchronously sent to the stream. Then, the stream's object output is "sinked" directly to the output of the component.

```yml
sink:
  # in
  # |
  # v
  stream
  # |
  # v
  # component out
```
