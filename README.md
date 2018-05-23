# chil

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license. See LICENSE.

## Introduction

Chil is a dynamic application programming language for expressing informational hierarchies formed by components. In fact, the name "chil" is an acronym for "component hierarchy information language".

### Comparison vs. traditional object-oriented systems

#### Components

Traditional object-oriented systems organize components in "classes", which expose methods for objects to use to invoke some action or retrieve data. In chil, the flow of control is inverted. An object is not responsible for proactively controlling or fetching another object's data. It is only responsible for communicating its own status through a single output, which other objects will consume and process according to their own internal behavior.

#### Hierarchy

Traditional object-oriented systems implement some form of communication hierarchy through keywords like "public" and "private". Each object is restricted from calling certain methods, but there is no specific contract between each pair of object and method. Any object may unpredictably call any available method it references (and references themselves may be freely kept and passed around), at any time and place in code, resulting in couplings and complexity. In chil, object containment is defined by a directed, rooted tree. That is, there is a strict parent/child relationship between objects: If object A is a parent of (i.e., contains) object B, then object B *must not* contain object A, or the chil compiler throws an error.

#### Information

Traditional object-oriented systems typically use "getters" and "setters" to read and write data. A chil object never reads or mutates another object's data. Instead, it informs its listeners of some message and does not wait for responses. An object may only listen to messages from its siblings or parent. Once a component receives a message, it decides what actions to take. This kind of rigorous single-directional data flow makes 100% component encapsulation and decoupling possible. This results in an "informational model", as opposed to a "controller model", of software design.

## Motivation

Many traditional software systems of any scope devolve into chaos. Chil consciously imposes severe constraints on the construction of systems, in order to make reasoning and iterating on applications easier and quicker. It also facilitates development through GUIs, eliminating the use of code as a necessary prerequisite to development. There is a one-to-one relationship between chil code and a graph structure which can be represented directly in a GUI. Code is often useful, but overuse of code to form the foundation of large, complex systems can be paralyzing when too many interests and stakeholders are involved.

## Specification

### Use of YAML

Chil code conforms to the [YAML 1.2 spec](http://yaml.org/spec/1.2/spec.html). Chil code is not algorithmic. It is a data structure, which is consumed by the chil runtime engine to produce a deterministic result based on a constant set of abstractions. User-facing data flows through chil code, which itself is expressed as data, which flows through the chil runtime. YAML is well-suited to a language that is expressed purely as data. Chil code functions as a schema for parsing by the chil runtime, which is itself a universal algorithm for any kind of computation.

### Components

The fundamental unit of application development in chil is the ***component***. A component is a YAML document which contains a dictionary of streams. Each key in the dictionary is the name of a stream. Two names are reserved for special use cases: `source` and `main`.

#### Component `source`

The component dictionary key `source` points to a stream which receives no incoming values. No other object may send values to this stream. This is useful for defining streams which are the original "source" of some data, with no prior inputs.

#### Component `main`

The component dictionary key `main` points to a stream which is the default input for incoming values. If another object sends values to an instance of this component without specifying an input name, those values are routed to `main`. 

#### Other Component Inputs

All other dictionary keys point to streams which are inputs for values sent to this component at that specific input name, as opposed to values sent to an unspecified input.

#### Component Streams

Each stream of a component is defined by a child object.

#### Connector components

Special ***connector components*** form the basis of connections between child objects within some parent component. These connections specify an explicit contract for communication between each pair of connected objects.

##### `pipe`

The `pipe` connector is constructed with a key-value pair which is the name `pipe` with a list of child objects. A pipe is itself is a child object, constructed from other child objects. Incoming values are sent to the first object in the list, which outputs to the second object (if present), and so on, until values are sent to the overall pipe's output.

```yml
pipe:
  # main input
  # |
  # v
  - child object 1
  # |
  # v
  - child object 2
  # |
  # v
  # etc...
  # |
  # v
  # output
```

##### `fork`

The `fork` connector also takes a list of child objects. Incoming values are sent to each of the objects, and the output from each object is sent to the overall fork's output. This happens synchronously.

```yml
fork:
  # main input
  # |
  # v
  - child object 1
  # |
  # v
  # output
  #
  # main input
  # |
  # v
  - child object 2
  # |
  # v
  # output
  #
  # etc...
```

##### `branch`

##### `output`
