# *This specification is an unimplemented draft, with much work in progress.*

***Last Updated:** 3 Jul 2018*

# Chil Language Specification (Edition No. 1, July 2018)

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license.

## Driving Principles

Chil is a data-driven programming language, built on familiar patterns like objects and streams. It establishes new conventions for using old patterns, allowing more power and flexibility with less syntax and configuration. A unit of Chil code is called a "component".

### Strict encapsulation

Each component is strictly responsible for its own operations, and strictly not responsible for the operations of other components. Communication between components is intentionally limited by the concepts of "boundaries and channels". Component boundaries encapsulate a private implementation for handling values, while channels allow values to enter and exit in a single direction. Chil is a spatially modeled language, with components in code being analogous to closed physical systems. This approach reduces the conceptual distance between virtual models and physical systems, either human or machine.

### Object orientation

Each instance of a component is an object. As with classes, components define the interface and behavior of a type of object. An object's interface has a set of zero or more input channels, each of which receives a time-independent sequence of a specific type of value. The values of each channel are delegated to some channel of a private object which is interconnected with other channels of private objects contained within the top-level object. Essentially, each object is a set of input channels which share a common output. Together, the objects of an application explicitly form a directed graph.

### Layered abstraction

References and values are treated differently by convention, because they exist on different layers of abstraction. Values flow through channels of streams at runtime, while references are established and fixed at compile time so they can never be passed around as data. Data-flow conventions are reified as explicit syntax in Chil, which enforces one consistent mechanism for controlling application behavior without any need for manipulation of references at runtime.

### Isomorphic syntax

Chil is a "homoiconic" language, which means its code syntax is isomorphic with its abstract structure. There is a one-to-one mapping from any unit of code to the model which is used to execute the code at runtime. This aligns users' thinking about the structure of code with thinking about the modeling of concepts. As a result, code becomes much more semantic, in that it directly describes the behavorial model of a system.

### Portable bytecode

The source code for a Chil application is expressed as any number of YAML files, which are compiled together into bytecode expressed as a single JSON file. Chil JSON bytecode is portable to any runtime environment for which there is an engine that can execute it. So, Chil source code is completely decoupled from any particular environment.

## Fundamental syntax

### YAML

Chil code is a subset of [YAML](http://yaml.org/spec/1.2/spec.html), which is well suited to a language which represents code as data. It avoids extraneous symbols designed to separate code from data inline, like quotes and braces, and cuts right to the heart of the content being expressed.

### Schema files

The source code for a Chil component is expressed as a YAML file called a "schema file", with an extension of `.schema`.
A schema file consists of a dictionary which defines a set of channels for a component. A channel consists of a name mapped to a delegate. A delegate is a reference to a channel of an object. Such objects and their channels are strictly private to the component.

Every schema must have at least one channel. Most schemas have a `main` channel, which is the "default channel" for all values sent to an instance of the component at an unspecified or undefined channel. Some schemas, instead of or in addition to `main`, have a `head` channel, to which no values can be sent. While `main` should be used to delegate the primary data flow through the component in response to incoming values, `head` is used to produce original values.

The private objects referenced within a component are themselves instances of components. Some special "connection components" are native to Chil, which define a limited set of composable communication conventions for objects.
