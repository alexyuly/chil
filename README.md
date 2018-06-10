# *This specification is a draft, with work in progress.*

# Chil Language Specification (Edition No. 1, June 2018)

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license.

## Introduction

This standard defines the first edition of the Chil Language, a data-driven application programming language. The *Chil* name is an acronym for *component hierarchy information language*.

### Overview of traditional object-oriented systems

The fundmental unit of traditional object-oriented systems is the *class*, which is a prototype for a [closure](https://en.wikipedia.org/wiki/Closure_(computer_programming)) whose interface consists of a set of public functions called *methods*. Methods form the bridge of communication between instances of classes, called *objects*. In terms of a directed object graph, classes result in a high degree of bidirectional data flow, since in order for interaction to occur, an instance of class A must delegate control to an instance of class B which returns to class A.

Moreover, popular object-oriented languages like C++, Java, and JavaScript, support freely inheriting and overriding methods in order to define the particular control flow of a class. Method inheritance and overrides tightly couple children to their parents, since modifying an inherited parent method or removing a parent override may result in unclear consequences as to the behavior of child methods. This makes object-oriented code unmaintainable over time, because base classes to become the foundation of a house of cards which can't be adjusted without shifting the whole system.

Worse yet, objects may freely pass references around the object graph, allowing a reference to travel arbitrarily far from the object which constructed its own referenced object. If class A passes a reference to its own private field to a method of class B, then class B gains access to private data (or perhaps even functions) of class A, which completely violates the spirit of object-oriented encapsulation.

### Contrasting features of Chil

In contrast to traditional object-oriented systems, the fundamental of unit of Chil is the *component*, a prototype for a stateless set of interconnected streams with a single output and *0 or more* named inputs. Each input feeds values into a *stream*, which is a reference to an input of a child of the component.

Each component owns a set of objects called *children*, which are referenced within streams. Special *connection objects*, which are a kind of children, form the bridge of communication between children. These connection objects allow for the inputs of a component to be connected to child inputs, for child outputs to be connected to other child inputs, and for child outputs to be connected to the component output, in various ways.

All object construction and relation happens at compile time, so no reference passing is allowed. Object reference relationships are defined by the proximity of objects within source code, rather than the state of objects which hold references. Moreover, all objects are stateless, except for those defined at the lowest level using native code, which may independently manage their own private state.

## 1 Compiler architecture

The source code for a Chil application is expressed as any number of YAML files. A single source file (or a pair of files), called the *root component*, is passed as an argument to the compiler, which enters the application's object graph at that point and outputs a consolidated representation of the parent-child relationship tree, combined with the sibling relationship graph encapsulated by each object. Compiler output is in the form of *Chil intermediate code* (*CIC*), expressed as a single JSON file. CIC is parsed by a Chil runtime engine which executes the code on a specific platform such as Node.js. The use of an intermediate language allows Chil to be decoupled from any particular runtime environment.

### 1.1 Pure encapsulation

The object graph of a Chil application, and its CIC JSON data structure, can be represented something like the following image, where the outermost circle depicts the root component:

![Figure 1.1: a visual representation of parent-child relationships (overlapping circles) and sibling relationships (connected circles)](images/Figure-1-1.png)

**Figure 1.1:** a diagram of parent-child relationships (overlapping circles) and sibling relationships (connected circles)

In the above diagram, no connection "lines" are allowed to cross the circumference of any component "circle". This visually illustrates Chil's first guiding principle: pure object-oriented encapsulation.

Most traditional object-oriented languages violate the spirit of encapsulation by allowing objects to relate with other objects which are physically distant in code, thereby conceptually binding together distant code passages. Chil enforces the idea of *proximity*, that objects which have close relationships must live close together in code.

Proximity enforcement enables pure encapsulation. Since object relationships are defined at compile time and kept constant during runtime, Chil guarantees that all flow of data into and out of each object is self-evident in code. There are no more surprises for humans trying understand the flow of data, like, *How did object foo access the data of bar??*, or *How did object foo call a method on bar?!*.

### 1.2 Strong, flexible types

At compile time, static type safety is both a first-class concept and incrementally adoptable. Every input of every object can have an optional static type definition, which the compiler checks against the implicit type of each output which is connected to the target input.

At runtime, Chil does away with conditional statements like *if* and *while*, in favor of the idea of *dynamic type safety*. Every expression of a set of data is considered to be a *type*. Chil unifies the concept *conditionals* with types. At runtime, types serve as conditional checks for the engine to filter which values are allowed to pass through.

#### 1.2.1 Basic types

Basic types are inherent to Chil and recognized by the compiler at any point in source code.

##### 1.2.1.1 Literal values

The type of data which includes just a single literal value of any type, expressed as a key-value pair:

```yaml
is: literal value
```

##### 1.2.1.2 Inverse of a type

The type of data which includes all values which are not in a given type, is expressed as

```yaml
not: type
```

##### 1.2.1.3 Numbers

The type of data which includes all valid JSON numbers is expressed as `number`.

The types of data which include numbers which are less than, greater than, less than or equal to, and greater than or equal to, are expressed as key-value pairs:

```yaml
under: literal number value
over: literal number value
under or is: literal number value
over or is: literal number value
```

If your type definitions require more specificity, Chil supports the `integer` keyword for the type which includes only integers, as well as `whole` for the type which includes `0,1,2,3,...`, and `natural` for the type which includes `1,2,3,...`.

##### 1.2.1.4 Strings

The type of data which includes all valid JSON strings is expressed as `string`.

The type of data which includes strings which match a given regular expression, is expressed as

```yaml
match: regular expression
```

##### 1.2.1.5 Lists

The type of data which includes all valid JSON Arrays is expressed as `list`. The type of Arrays whose elements are constrained to a specific type is expressed as `list: type`.

##### 1.2.1.6 Lookups

The type of data which includes all valid non-Array JSON Objects is expressed as `lookup`. The type of Objects for which certain properties are constrained to specific types is expressed as

```yaml
lookup:
  key 1: type 1
  key 2: type 2
  ...
```

Unspecified keys are not constrained to any type. Regular expressions are valid keys, against which actual keys will be tested, and if matching, those keys will be constrained to the given type.

##### 1.2.1.7 Union of types

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
  - is: literal value 1
  - is: literal value 2
  ...
```

##### 1.2.1.8 Intersection of types

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
  - is: 0
  - is: 1
```

The compiler will throw an error:

```
Empty type error
Line 135, Char 2
all of:
  - is: 0
  - is: 1
  ^
Types of `is: 0` and `is: 1` are disjoint. The result of `all of` is empty.
Did you mean to use `any of`?
```

If you want to define an empty type, you must explicitly use the `never` keyword. For example, you could use `never` to define a type which includes all JSON objects which absolutely never have any value defined for a given key:

```yaml
lookup:
  I want this key: number
  I want this key too: string
  I never want this key: never
```

#### 1.2.2 Custom types

Custom types are defined by a component with one `main` input, which conditionally sinks incoming values.

For example, the type of JSON booleans is implemented as a custom type named `true or false`, which allows any incoming values to pass through which match either `true` or `false`:

```yaml
main |sink |any of:
  - is: true
  - is: false
```

## 2 Source code

Chil source code is formatted according to the [YAML 1.2 specification](http://yaml.org/spec/1.2/spec.html). Each source file has an extension of either `.domain` or `.schema`, according to its purpose.

### 2.1 Domain source files

The domain source file is an optional file with a `.domain` extension. It defines the type of data which each input of a given component is allowed to receive from a connection. These types, known as the component *domain*, are checked at compile time. The name of the domain source file is the name of the component for which the domain is defined.

#### 2.1.1 Domain source file format

The domain source file is a valid YAML document. It contains a dictionary which maps names of input streams to type references.

### 2.2 Schema source files

The required schema source file for a given component is expressed as a YAML document with a dictionary mapping names of inputs to references to streams.

#### 2.2.1 References to streams

Each key in a component's dictionary is mapped to a reference to a stream which exists within the component. These streams are constructed implicitly by Chil at compile time. Each stream is part of an object, which is an instance of a child component. A "reference to a stream" can be expressed in multiple forms:

1. the name of a component, for the main input of the single object of that type
  - for example, `echo`
2. the name of a component followed by an `@` ("at") *preposition* with a locally unique ID, for the main input of the locally unique instance of that component
  - for example, `document events @mousemove`
  - Note, if no id is provided, such as `document events @`, then a locally unique, anonymous instance is referenced. Since it is anonymous, it can't be referenced anywhere else.
3. one of (1) or (2), followed by an `->` ("arrow") *preposition* to the name of an input of that object
  - for example, `gate ->state`
  - or, for example, `delay @my delay ->state`
  - Note, the whitespace around each preposition is not important: The Chil compiler trims whitespace around each symbol, which includes names (such as `delay` or `my delay`) and prepositions (such as `@` or `->`). However, it is conventional to format prepositions with a single leading space and no trailing space.
4. a key-value pair with a key of one of (1), (2), or (3), followed by a value passed to the object when it is initialized
  - This key-value pair is called a constructor. At most one constructor per object is allowed. Constructors are not required, and the location of the constructor within code is irrelevant. All objects are constructed for which exist at least one reference of any kind.
  - for example, `delay @my delay: 500`
5. a connector object

#### 2.2.2 Connector objects

Special ***connector objects*** form the basis of connections between streams of child objects within some parent component. A connector object behaves just like an instance of any component with a single `main` input stream, which receives incoming values and sends them out to all connected listeners.

##### `pipe`

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

### 3 Idioms

#### 3.1 `state` as a "secondary" input

Whereas `main` refers to the default, primary input of a component, `state` typically refers to the "secondary" input. And whereas `main` is properly used to define a component's data *throughput* resulting in values "sinked" through its output, `state` is properly used to define a component's data *storage* which handles values used asynchronously by the main stream. For example, the `delay` native component has two inputs, `main` and `state`, where `main` triggers a delayed output, and `state` controls the number of milliseconds for the delay. 

#### 3.2 Collapsing only children

If a parent node in the YAML data structure has only a single child, then that parent and its only child may be "collapsed" into a single node.

The expanded form
```yml
main:
  sink:
    document template:
      type: div
      child:
        - "Hello, "
        - {$: name}
```
is translated into the collapsed form
```yml
main |sink |document template:
  type: div
  child:
    - "Hello, "
    - {$: name}
```

The collapsed form is preferred to the expanded form, and the compiler emits a warning when expanded form is found. Collapsed form is more concise and more readable, with fewer lines and less indentation.

Note that the vertical bar `|` is a reserved preposition which cannot be used as part of Chil names, just as `@` and `->` are reserved and cannot be used. The compiler will throw an error if these symbols are used incorrectly.
