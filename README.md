# *This specification is an unimplemented draft, with much work in progress.*

***Last Updated:** 30 Jun 2018*

# Chil Language Specification (Edition No. 1, June 2018)

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license.

## Driving Principles

Chil is a data-driven programming language, built on familiar patterns like functions, objects, and streams. It establishes new conventions for using old patterns, allowing users to wield more power and flexibility with less syntax and configuration. A unit of Chil code is called a **component**.

### Strict encapsulation

Each component is strictly responsible for its own operations, and strictly *not responsible* for the operations of other units of code. Communication between components is intensely, intentionally limited by the concepts of **boundaries** and **channels**. Chil is a spatially modeled language, with code components being analogous to physical components. A component's boundaries enclose a private implementation for handling values, which enter and exit the component via public *single-directional* channels. This kind of communication reduces the conceptual distance between virtual models and physical representations of those models, either human or machine.

### Object orientation

Each instance of a component is an object. As with classes, components define the interface and behavior of a type of objects. An object's interface has a set of zero or more input channels, each of which receives an asynchronous sequence of a specific type of values. These values are handled by the object's behavior, which is a composition of other objects whose channels are interconnected via *strong, static* typing. Outgoing values are sent *either synchronously or async, relative to incoming values,* to a single output channel. Since an object models a sequence of incoming and outgoing values, *all Chil objects are also streams*.

### Layered abstraction

**References** and **values** are treated differently by convention, because they exist on different layers of abstraction. References are low-level data used by humans and machines to identify some higher-level data. Values are high-level data used to provide information to components of a system. Values flow through channels of streams at runtime, while references are established and fixed at compile time so they can never be passed around as data. Data-flow conventions are reified as explicit syntax in Chil, which enforces one consistent mechanism for controlling application behavior without any need for manipulation of references at runtime.

### Isomorphic syntax

Chil is a "homoiconic" language, which means its code syntax is directly comparable to its abstract structure.

### Portable bytecode

## Fundamental syntax

### YAML

Chil code is a subset of [YAML](http://yaml.org/spec/1.2/spec.html), which is well suited to a language which represents code as data. It avoids extraneous symbols designed to separate code from data inline, like quotes and braces, and cuts right to the heart of the content being expressed.

