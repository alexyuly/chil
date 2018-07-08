# *This specification is an unimplemented draft, with much work in progress.*

***Last Updated:*** *7 Jul 2018*

# Chil Language Specification

## (Edition No. 1, July 2018)

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license.

## Introduction

Chil is a new kind of language built on familiar patterns, used in reimagined ways.

*Chil* is an acronym for

- component
- hierarchy
- information
- language

The primary design principle of Chil is modular composition. Inheritance and polymorphism are shunned: Instead, small, simple units of code are combined together into large, complex trees of streaming data.

## Definitions

### Value

A **value** is a single piece of human-readable data, such as a number, a string, or a list.

### Output

An **output** is an asynchronous series of values.

### Stream

A **stream** is an executable block of code which is called in response to a constant value at compile time, or alternatively, in response to variable values from one or more outputs at runtime.

### Component

A **component** is a structure which

- combines streams and gives them scoped access to shared state and a shared output
- assigns a name to each stream, which is unique among all streams of the component
  - if the name is `head`, then the stream is called once, *at compile time*, with a value called a "constructor", in order to initialize the component's state
  - otherwise, the stream is called repeatedly, *at runtime*, with incoming values from one or more outputs, in order to take an action which depends on the kind of component

Components have two kinds, **leaf** and **schema**:

#### Leaf component

A **leaf component** is a component which is implemented with "native" code, which is code that is specific to one target platform supported by a Chil runtime engine. (For example, a leaf component may be implemented in JavaScript, to target the proposed Chil Node.js runtime engine.)

A leaf component source code file should have an extension of `.leaf.[native extension]`, where `[native extension]` is the extension of the native code. (For example, a leaf component implemented in JavaScript should have a "double-dot" extenstion of `.leaf.js`).

Each stream of a leaf component is defined as a function with one parameter, which is a closure on the component's state and the component's output.

Each non-head stream of a leaf component is called repeatedly at runtime, in order to

- update the component's state
- send values to the component's output

#### Schema component

A **schema component** is a component which is implemented with Chil code, which is code that is general to any target platform supported by a Chil runtime engine.

A schema component source code file should have an extension of `.schema.yml`. The content of a schema component source code file is valid [YAML](http://yaml.org/spec/1.2/spec.html). (YAML is well-suited to a language which represents code as data. It avoids extraneous symbols such as quotes and braces, which do not add to the human-readable meaning of words.)

Each stream of a schema component is defined as a key-value pair within a dictionary.