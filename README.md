# chil

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license. See LICENSE.

## Introduction

Chil is a dynamic application programming language for expressing informational hierarchies formed by components. In fact, the name "chil" is an acronym for "component hierarchy information language".

### Comparison vs. traditional object-oriented systems

#### Components

Traditional object-oriented systems organize components in "classes", which expose methods which other class instances may call to invoke some action or retrieve a piece of data. In chil, the flow of control is inverted. Objects are not responsible for proactively controlling another object's behavior or reading from its data. They are only responsible for communicating their own status through outputs, which other objects will reactively consume.

#### Hierarchy

Traditional object-oriented systems implement some form of communication hierarchy through keywords like "public" and "private". Objects are generally restricted from calling certain methods, but there is no specific contract between each pair of objects. Any object may control or consume any public method. A chil application has a sense of physical space based on its tree of objects, which are instances of components. Communication is only allowed between two objects which share an explicit input/output contract defined in another component.

#### Information

Traditional object-oriented systems typically use "getters" and "setters" to read and write data. Chil objects never read or mutate another object's data. Instead, they inform any and all listeners of some message, like an event, and do not wait for a response. Once a component receives a message, it decides what actions to take. This kind of rigorous single-directional data flow results in 100% component encapsulation and decoupling. I call this an "informational model", as opposed to a "controller model".

## Motivation

Most traditional software systems of any scope devolve into chaos. Chil consciously imposes severe constraints on the construction of application systems, in order to make reasoning and iterating on applications easier and quicker. It also facilitates development through GUIs, eliminating the use of code as a necessary prerequisite to application development. There is a one-to-one relationship between chil code and a graph structure which can be represented directly in a GUI. Code is often useful, but overuse of code to form the foundation of large, complex systems can be paralyzing when too many interests and stakeholders are involved.

## Specification

### Use of YAML

Chil code conforms to the [YAML 1.2 spec](http://yaml.org/spec/1.2/spec.html). Chil code is not algorithmic. It is a data structure, which is consumed by the chil runtime engine to produce a deterministic result based on a constant set of abstractions. The chil runtime engine is a universal state machine that produces output based on a given set of inputs. User-facing data flows through chil code, which itself is expressed as data, which flows through the chil runtime. YAML is well-suited to a language that is expressed purely as data. Chil code functions as a schema for parsing by the chil runtime, which is itself a universal algorithm for any kind of computation.

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

The `pipe` connector is constructed with a key-value pair which is the name `pipe` with a list of child objects. A pipe is itself is a child object, constructed from other child objects.

```yml
pipe:
  # main input
  # |
  # v
  - child object 1
  # v
  - child object 2
  # v
  - child object 3
  # v
  # any other child objects
  # |
  # v
  # output
```

Incoming values are sent to the pipe's main (and only) input, which outputs to the first object in the list, which outputs to the second object (if present), and so on, until values are sent to the overall pipe's output.

##### `fork`

##### `branch`

##### `output`
