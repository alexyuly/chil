# *This specification is an unimplemented draft, with much work in progress.*

***Last Updated:** 30 Jun 2018*

# Chil Language Specification (Edition No. 1, June 2018)

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license.

## Driving Principles

Chil is a data-driven programming language, built on familiar patterns like functions, objects, and streams. It establishes new conventions for using old patterns, allowing users to wield more power and flexibility with less syntax and configuration. A unit of Chil code is called a **component**.

### Strict encapsulation

Each component is strictly responsible for its own operations, and strictly *not responsible* for the operations of other units of code. Communication between components is intensely, intentionally limited by the concepts of **boundaries** and **channels**. Chil is a spatially modeled language, with code components being analogous to physical components. A component's boundaries enclose a private implementation for handling values, which enter and exit the component via public *single-directional* channels. This communication convention reduces the conceptual distance between virtual models and physical representations of those models, either human or machine.

### Object orientation

Each instance of a component is an object. As with classes, components define the interface and behavior of a type of objects. An object's interface has a set of zero or more input channels, each of which receives an asynchronous sequence of a specific type of values. These values are handled by the object's behavior, which is a composition of other objects whose channels are interconnected via *strong, static* typing. Outgoing values are sent *either synchronously or async* to a single output channel. Since an object models a sequence of incoming and outgoing values, *all Chil objects are also streams*.

### Layered abstraction

References and data are strictly separated, because they exist on different layers of abstraction.

### Isomorphic syntax

### Portable bytecode
