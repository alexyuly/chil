# *This specification is a draft, with work in progress.*

# Chil Language Specification (Edition No. 1, June 2018)

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license.

## Introduction

This standard defines the first edition of the Chil Language. Chil is a dynamic application programming language for expressing informational hierarchies formed by components. The *Chil* name is an acronym for *component hierarchy information language*.

### Overview of traditional object-oriented systems

The fundmental unit of traditional object-oriented systems is the *class*, which is a prototype for a [closure](https://en.wikipedia.org/wiki/Closure_(computer_programming)) whose interface consists of a set of public functions called *methods*. Methods form the bridge of communication between instances of classes, called *objects*. In terms of a directed object graph, classes result in a high degree of bidirectional data flow, since in order for interaction to occur, an instance of class A must delegate control to an instance of class B, which returns to class A.

Moreover, pervasive object-oriented languages like C++, Java, and JavaScript, support freely inheriting and overriding methods in order to define the particular control flow of a class. Method inheritance and overrides tightly couple children to their parents, since modifying an inherited parent method or removing a parent override may result in unclear consequences as to the behavior of child methods. This creates a domino effect which makes code unmaintainable, by causing base classes to become the foundation of a house of cards which can't be adjusted without shifting the whole system.

Worse yet, objects may freely pass references around the object graph, allowing a reference to travel arbitrarily far from the object which constructed its own referenced object. If class A passes a reference to its own private field to a method of class B, then class B gains access to private data (or perhaps even functions) of class A, which violates the concept of object-oriented encapsulation.

### Contrasting features of Chil

In contrast to traditional object-oriented systems, the fundamental of unit of Chil is the *component*, which is a prototype for a stateless set of interconnected streams, with *0-n* named inputs and *1* output. Each input feeds values into a *stream*, which is a reference to an input of a child of the component.

Each component defines a set of component instances called *children*, which are referenced within streams. Special *connection objects* form the bridge of communication between children. These connection objects allow for the inputs of a component to be connected to child inputs, for child outputs to be connected to other child inputs, and for child outputs to be connected to the component output, in various ways.

All object construction happens at compile time, so no reference passing is allowed. Object reference relationships are defined by the communication contract expressed in a component's source code, which is established at compile time and enforced during runtime.

## 1 Compiler architecture

The source code for a Chil application is expressed as any number of YAML files. A single source file, called the *root component*, is passed as an argument to the compiler, which enters the application's object graph at that point and outputs a consolidated representation of the parent-child relationship tree, combined with the sibling relationship graph encapsulated by each object. Compiler output is in the form of *Chil intermediate code* (*CIC*), expressed as a single JSON file. CIC is parsed by a Chil runtime engine which executes the code on a specific platform such as Node.js. The use of an intermediate language allows Chil to be decoupled from any particular runtime environment.

The object graph of a Chil application, and its CIC JSON data structure, can be represented something like the following image, where the outermost circle depicts the root component:

![Figure 1.1: a visual representation of parent-child relationships (overlapping circles) and sibling relationships (connected circles)](images/Figure-1-1.png)

Figure 1.1: a visual representation of parent-child relationships (overlapping circles) and sibling relationships (connected circles)

Notice how no connections (i.e., sibling relationships) are allowed to cross the circumference of any component's circle. This  visually illustrates how Chil achieves pure object-oriented encapsulation of data.

## 2 Source code

Chil source code is formatted according to the [YAML 1.2 specification](http://yaml.org/spec/1.2/spec.html). Each source file has an extension of either `.domain` or `.layout`, according to its purpose.

### 2.1 Domain source files

The optional domain source file for a given component is expressed as a YAML document with a dictionary mapping names of inputs to types of data permitted to be sent to those inputs. This forms the *domain* of a component. A type of data is defined as a set of values. Some types are inherent to Chil, and these types may be referenced in any domain file.

#### 2.1.1 Literal values

The simplest type is the type of data which is constrained to a single literal value of any type, expressed as a key-value pair:

```yaml
=: literal value
```

#### 2.1.2 True or false

The type of data which is constrained to JSON booleans is expressed as `true or false`.

#### 2.1.3 Numbers

The type of data which includes all valid JSON numbers is expressed as `number`.

The types of data which include numbers which are less than, greater than, less than or equal to, and greater than or equal to, are expressed as key-value pairs:

```yaml
under: literal number value
over: literal number value
under or =: literal number value
over or =: literal number value
...
```

If your type definitions require more specificity, Chil supports the `integer` keyword for the type which includes only integers, as well as `whole` for the type which includes `0,1,2,3,...`, and `natural` for the type which includes `1,2,3,...`.

#### 2.1.4 Strings

The type of data which includes all valid JSON strings is expressed as `string`.

The type of data which includes strings which match a given regular expression, is expressed as

```yaml
match: regular expression
```

#### 2.1.5 Lists

The type of data which includes all valid JSON Arrays is expressed as `list`. The type of Arrays whose elements are constrained to a specific type is expressed as `list: type`.

#### 2.1.6 Lookups

The type of data which includes all valid non-Array JSON Objects is expressed as `lookup`. The type of Objects for which certain properties are constrained to specific types is expressed as

```yaml
lookup:
  key 1: type 1
  key 2: type 2
  ...
```

Unspecified keys are not constrained to any type. Regular expressions are valid keys, against which actual keys will be tested, and if matching, those keys will be constrained to the given type.

#### 2.1.7 Union of types

The type of data which includes the union of an unordered sequence of types of data, is expressed as

```yaml
any of:
  - type 1
  - type 2
...
```

An enumeration is defined by a union of literal values:

```yaml
any of:
  - =: literal value 1
  - =: literal value 2
  ...
```

#### 2.1.8 Intersection of types

The type of data which includes the intersection of an unordered sequence of types of data, is expressed as

```yaml
all of:
  - type 1
  - type 2
...
```

The compiler throws an error if any intersected types are disjoint, meaning that they share no common values and the resulting set is empty, for example:

```yaml
# This type definition makes no sense:
all of:
  - =: 0
  - =: 1
```

The compiler will throw an error:

```
Empty type error
Line 135, Char 2
all of:
  - =: 0
  - =: 1
  ^
Types of `=: 0` and `=: 1` are disjoint. The result of `all of` is empty.
Did you mean to use `any of`?
```

If you want to define an empty type, you must explicitly use the `never` keyword. For example, you could use `never` to define a type which includes all JSON objects which absolutely never have any value defined for a given key:

```yaml
lookup:
  I want this key: number
  I want this key too: string
  I never want this key: never
```

#### 2.1.10 Inverse of a type

The type of data which includes all values which are not included in a given type, is expressed as

```yaml
not: type
```
