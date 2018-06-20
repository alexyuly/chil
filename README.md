# *This specification is an unimplemented draft, with work in progress.*

***Last Updated:** 19 Jun 2018*

# Chil Language Specification (Edition No. 1, June 2018)

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license.

## Introduction

This standard defines the first edition of the Chil Language, a data-driven application programming language. The *Chil* name is an acronym for *component hierarchy information language*.

### Overview of traditional object-oriented systems

The fundmental unit of traditional object-oriented systems is the *class*, which is a prototype for a [closure](https://en.wikipedia.org/wiki/Closure_(computer_programming)) (or other similar implementation) whose interface consists of a set of public functions called *methods*. Methods form the bridge of communication between instances of classes, called *objects*. In terms of a directed object graph, classes cause a high degree of bidirectional data flow, since in order for interaction to occur, an instance of class A must delegate control to an instance of class B which returns to class A.

Moreover, popular object-oriented languages like C++, Java, and JavaScript, encourage unlimited inheritance and overrides of methods in order to define the particular control flow of a class. Method inheritance and overrides tightly couple children to their parents, since modifying an inherited parent method or removing a parent override may result in unclear consequences as to the behavior of child methods. Thus, object-oriented code becomes unmaintainable over time, since base classes can't be adjusted without shifting the whole system.

Worse yet, objects may freely pass references around the object graph, allowing a reference to travel arbitrarily far from the object which constructed its own referenced object. If class A passes a reference to its own private field to a method of class B, then class B gains access to private data or even methods of class A, which violates the spirit of object-oriented encapsulation.

### Contrasting features of Chil

In contrast to traditional object-oriented systems, the fundamental of unit of Chil is the *component*, a prototype for a stateless set of interconnected streams with a single output and zero or more named inputs. Each component owns a set of objects called *children*, which are interconnected to form *streams*. A stream is a path of data through objects.

Special *connection objects*, which are also children, form the bridge of communication between other children. These connection objects allow for the inputs of a component to be connected to child inputs, for child outputs to be connected to other child inputs, and for child outputs to be "sinked" to the component output, in various ways.

All object construction and relation happens at compile time, so references can't be created, passed, or destroyed during runtime. Object relationships are defined by the proximity of objects within source code, rather than the state of objects which hold references. Moreover, all objects are stateless, except for those defined at the lowest level using native code, which may independently manage their own private state.

## 1 Component schema file

A Chil component is defined by at least one YAML file, with an extension of `.schema`. This schema file defines the flow of data through a component at runtime. Component data flow is expressed as a set of interconnected streams. Each stream is defined by a key-value pair within a root-level dictionary in the schema file.

### 1.1 Source stream

A schema file may define a stream named `source`, which is not an input and is a source of data. This data is output from the stream in the form of discrete values called *events*.

### 1.2 Main stream

A schema file may define a stream named `main`, which is the default input for all events coming into the component. This default input receives events for which a target input name is not specified, or for which the given target input name is not defined.

### 1.3 Other streams

A schema file may define other streams not named `source` or `main`, which receive events for which the target input name matches the name of the stream.

### 1.4 Stream definition

A stream is defined as a key-value pair, whose key is the name of the stream, and whose value is a reference to an instance of a component. A component instance reference takes the form

```
component name[ @[instance name]][ ->input name][: constructor value]
```
Note that the square brackets (`[` and `]`) are not literal: they indicate that a portion of the expression is optional.

#### 1.4.1 Prepositions: `@` and `->`

Prepositions are used to "tag" component names with additional kinds of names. A preposition is a non-verbal symbol which comes immediately before the first character of a name.

#### 1.4.2 Component name

A component name is a reference to a component schema file, which is instantiated at compile time as a child of the component in which it is referenced. The name is a relative path to the schema file (without the `.schema` extension).

#### 1.4.3 Instance name

An instance name is unique among all instances of a given component name which are children of a single component. A component name expressed without an "at" preposition (`@`) is a unique anonymous instance. A component name expressed with `@` refers to the single instance of that component which has the name immediately following the `@`, which may be empty. A single named instance must be referenced multiple times within a schema file, but it will only be constructed once.

#### 1.4.4 Input name

An input name refers to one of the inputs defined by the schema of the component name. Incoming values will be directed to the input of the component instance which has the given name, or `main` if the name is not defined in the schema.

#### 1.4.5 Constructor value

A constructor value is an optional value which is used to construct some components.

TODO...

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

Chil types can be used statically or dynamically, that is, at compile time or runtime. At compile time, types serve as strong, static validation of the flow of data in and out of objects, before runtime. At runtime, types serve as strong, *dynamic* validation of data flow based on potentially variable inputs.

Chil types unify the concepts of *static type checking* and *conditional validation*, by replacing traditional conditionals like `if` and `while` with type objects that dynamically filter incoming data. The compiler automatically optimizes for unnecessary dynamic types, that is types which could (and probably should) be statically declared, by excluding them from the execution plan and emitting a warning to the console.

#### 1.2.1 Basic types

Basic types are inherent to Chil and recognized by the compiler at any point in source code.

##### 1.2.1.1 Literal type: `is`

The type which includes just a single literal value of any type, is expressed as

```yaml
is: literal value
```

##### 1.2.1.2 Union of types: `any of`

The type which includes the union of a set of types of data, is expressed as

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

##### 1.2.1.3 Intersection of types: `all of`

The type which includes the intersection of a set of types of data, is expressed as

```yaml
all of:
  - type 1
  - type 2
  ...
```

Note: The compiler throws an error if any intersected types are disjoint, meaning that they share no common values and the resulting set is empty, for example

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
Types of `is: 0` and `is: 1` are disjoint: The result of `all of` is the empty type.
Use `nothing` to explicitly specify the empty type.
```

##### 1.2.1.4 Empty type: `nothing`

The type which includes no values, that is the empty set, is expressed as `nothing`. Type expressions which implicitly reduce to the empty set will result in an "empty type error" being thrown. The empty set must be expressed explicitly with `nothing`.

##### 1.2.1.5 Inverse of a type: `not`

The type which includes all values which are not in a given type, is expressed as

```yaml
not: type
```

For example, to express the type that is all values which are *not* 0:

```yaml
not:
  is: 0
  
# or, in shorthand form
not |is: 0
```

##### 1.2.1.6 Numbers

The type which includes all valid JSON numbers is expressed as `number`:
- The type of numbers less than a given value is expressed as `under: literal number value`.
- The type of numbers greater than a given value is expressed as `over: literal number value`.

Chil also supports the `integer` keyword for the type of just all integers, and `natural` for the type of `0,1,2,3,...`.

`number`, `integer`, and `natural` can be constructed with another type which specifies that the given "value" type is constrained to the "key" type's domain. (In other words, the resulting type is the "value" type intersected with the "key" type, such as `number` or `integer`.) For example, to express the type that is *all numbers* which are not 0 (rather than *all values*, including strings, lookups, and so on):

```yaml
number |not |is: 0
```

Here is another example, of a more complex expression of the type of numbers which are multiples of a given number:

```yaml
number |such that:
  pipe |mod: variable
  type |is: 0
```

(TODO: Refine and elaborate on `such that` syntax.)

##### 1.2.1.7 Strings

The type of data which includes all valid JSON strings is expressed as `string`. Moreover, the type of strings which match a given regular expression is expressed as `match: regular expression`.

Like `number`, `string` may also be constructed with another type which is constrained to the domain of `string`, for example

```yaml
string |not |match: ^Strings that start with this
```

##### 1.2.1.8 Lists

The type of data which includes all valid JSON Arrays is expressed as `list`. The type of Arrays whose elements are constrained to a specific type is expressed as `list: type`.

##### 1.2.1.9 Lookups

The type of data which includes all valid non-Array JSON Objects is expressed as `lookup`. The type of Objects for which certain properties are constrained to specific types is expressed as

```yaml
lookup:
  key 1: type 1
  key 2: type 2
  ...
```

Unspecified keys are not constrained to any type. Regular expressions are valid keys, against which actual keys will be tested, and if matching, those keys will be constrained to the given type.

#### 1.2.2 Modular types

Modular types are defined by a file with a `.type` extension, which is formatted a YAML document with a single key-value pair that is a type.

For example, the type of JSON booleans is implemented as a modular type named `true or false`:

```yaml
any of:
  - is: true
  - is: false
```

A modular type can have a constructor argument, which is referenced in code with the reserved word `variable`.

For example, the type of numbers greater than or equal to a given value is implemented as a modular type named `over or is`:

```yaml
any of:
  - over: variable
  - number |is: variable
```

### 1.3 Implicit module resolution

Chil's module system is resolved through implicit syntax. This means that there are no explicit `import`, `include`, `require`, or `using` statements. (There are also no corresponding `export`, `namespace`, or `public` keywords.)

TODO:
- Define what is a "name".
- Define how names are resolved.
- Explain how Chil's "PATH" configuration works.

## 2 Source code

Chil source code is formatted according to the [YAML 1.2 specification](http://yaml.org/spec/1.2/spec.html). The source code for each component consists of one required file with a `.schema` extension, and an optional second file with a `.domain` extension.

### 2.1 Domain source files

The domain source file is an optional file with a `.domain` extension. It is formatted as YAML document with a dictionary mapping names of inputs to types. The name of the file is the name of the component for which the given domain is defined. A domain defines static type checking for a component's inputs. The compiler checks the explicit type of each input against the implicit type of each connected output. (Note: connections are specified within the `.schema` file.)

### 2.2 Schema source files

The schema source file is a required file with a `.schema` extension. It is formatted as YAML document with a dictionary mapping names of inputs to references to streams.

#### 2.2.1 References to streams

Each key in a component's dictionary is mapped to a reference to a stream which exists within the component. These streams are constructed implicitly by Chil at compile time. Each stream is part of an object, which is an instance of a child component. A "reference to a stream" can be expressed in multiple forms:

1. just the name of a component, for the main input of a single anonymous object of that type
  - for example, `echo`
2. the name of a component followed by an `@` ("at") *preposition* with a locally unique ID, which may be empty, for the main input of the locally unique instance of that component
  - for example, `document events @mousemove`
  - or, for example, `document events @`
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

#### 3.1 Collapsing only children

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

Note that the vertical bar `|` is a reserved preposition which cannot be used as part of any name, just as `@` and `->` are reserved and cannot be used in names. The compiler will throw an error if these symbols are used incorrectly.

#### 3.2 `state` as a "secondary" input

Whereas `main` refers to the default, primary input of a component, `state` typically refers to the "secondary" input. And whereas `main` is properly used to define a component's data *throughput* resulting in values "sinked" through its output, `state` is properly used to define a component's data *storage* which handles values used asynchronously by the main stream. For example, the `delay` native component has two inputs, `main` and `state`, where `main` triggers a delayed output, and `state` controls the number of milliseconds for the delay.

# Examples

## One-line 'Hello, world!'

```yaml
main |echo: Hello, world!
```
