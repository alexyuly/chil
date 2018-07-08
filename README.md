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

- combines streams and gives them private access to reading and writing shared state, and writing to a shared output
- assigns a name to each stream, which is unique among all streams of the component
  - if the name is `head`, then the stream is called once, *at compile time*, with a value called a "constructor", in order to initialize the component's state
  - otherwise, the stream is called repeatedly, *at runtime*, with incoming values from one or more outputs, in order to take an action which depends on the kind of component

Components have two kinds, **leaf** and **schema**:

#### Leaf component

A **leaf component** is a component which is implemented with "native" code, which is code that is specific to one target platform supported by a Chil runtime engine. (For example, a leaf component may be implemented in JavaScript, to target the proposed Chil Node.js runtime engine.)

A leaf component source code file should have an extension of `.leaf.[native extension]`, where `[native extension]` is the extension of the native code. (For example, a leaf component implemented in JavaScript should have a "double-dot" extension of `.leaf.js`).

Each stream of a leaf component is defined as a function with one parameter, which is a closure on the component's state and the component's output.

Each stream of a leaf component is called in order to

- initialize or update the component's state
- send values to the component's output

#### Schema component

A **schema component** is a component which is implemented with Chil code, which is code that is general to any target platform supported by a Chil runtime engine.

A schema component source code file should have an extension of `.schema`. The content of a schema component source code file is valid [YAML](http://yaml.org/spec/1.2/spec.html). (YAML is well-suited to a language which represents code as data. It avoids extraneous symbols such as quotes and braces, which do not add to the human-readable meaning of words.)

Each stream of a schema component is defined as a key-value pair within a dictionary. The key is the name of the stream, while the value is a "delegate":

#### Delegate

A **delegate** is a reference to a stream which

- is within the component's private scope
- receives values sent into a public stream of the component
- sends values out to the component's output

What is "a stream within the component's private scope"? Each component has private "child components", whose streams are included in delegates.

The syntax of a delegate can be represented as

`[component path][!][ @component instance][ *component stream][: constructor]`

The brackets are not literal. They indicate the bounds of a section of the syntax.

##### Component path

A **component path** is a path to a source code file for a component, which is one of the following:

- a "global" file path which can be referenced because it is relative to an entry defined in the Chil compiler path. (*TODO*: Explain how to define entries in the Chil compiler path.)
- a "system" file path which is relative to the current directory of the file within which is it referenced.

##### Singleton (exclamation point)

A delegate which references the single instance of a child component is denoted by a trailing exclamation point, after the component path.

##### Component instance (*at* symbol)

Alternatively, a delegate which references the instance of a child component which has a given name is denoted by a string identifier preceded by an *at* symbol, where the identifier is unique among all child component instances.

A delegate may have either a singleton or a component instance, but not both.

##### Component stream (asterisk)

A delegate which references a stream of the given child component which is named something other than `main`, is denoted by the name of a stream preceded by an asterisk.

The `main` stream of a component is the default stream, which receives incoming values when no component stream is specified, or when the specified stream is not defined on the given child component.

##### Constructor

A delegate may be a single value, or it may be a key-value pair, where the value is a "constructor" which is passed to the `head` stream of the given child component, at compile time.

Only one constructor may be defined per unique component instance, regardless of which stream is referenced. If more than one such constructor is defined, then the compiler will throw an error.



