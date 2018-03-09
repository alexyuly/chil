![compost](https://github.com/compostsoftware/compost/blob/master/images/masthead.png)

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license. See LICENSE.

## What is Compost?

Compost is a framework for building apps with as little code as possible, using components and streams. Please install [Node.js](https://nodejs.org/en/) before using Compost. Familiarity with Node.js and JavaScript is highly recommended but not required. **This software is incomplete and under active development, so there is more code and documentation coming every week. Stay tuned.**

### Version 1.0.0: Coming Soon

The next version of all packages published to NPM will probably be 1.0.0. The code in the master branch of this repository is under development and may not reflect the code last published to NPM. For the very latest version of Compost, clone the packages from GitHub and link them locally, instead of installing the packages from NPM.

## An Introduction to Components

Every Compost app is a **component**. Components have inputs and outputs which are streams.

### Input/Output Streams

An input/output stream sends values to other I/O streams. A component may have one **output stream**, or "output". A component must also have one or more **input streams**, or "inputs". A component is responsible for defining how its own inputs send values to other streams: How this happens depends on whether the component is a "leaf" or a "branch".

### Leaf Components

A **leaf component**, or "leaf", has no children. Instead, it has a Node.js module which uses JavaScript code to define how and when its inputs send values to its own output. Soon, you'll learn how to write leafs, but first I'll demonstrate how to use them within branches.

### Branch Components

A **branch component**, or "branch", has **children**, which are other leaf or branch components. A branch also has **connections**, which define routes through which data passes from one stream to another.

### Let's Write a "Hello, World!" Component

Open a text editor and paste the following:

```yaml
type:
  component:
    inputs:
      action: string

children:
  echo: common/echo

connections:
  action:
    echo: action

defaults:
  action: Hello, world!

```

Save this file as `Hello World.yml`. Now, use NPM to install the Compost shell:

`npm install --global @compost/shell`

Then, run your Hello World app:

`compost run 'Hello World.yml'`

The terminal prints something like the following:

```
compost build wrote file to /Users/alex/dev/dev-personal/compost/examples/Hello World.json
compost build examples/Hello World.yml: 10.505ms
compost run ignored error while reading log file from /Users/alex/dev/dev-personal/compost/examples/Hello World.log
Hello, World!
compost run /Users/alex/dev/dev-personal/compost/examples/Hello World.json: 9.061ms
```

So, what happened? Let's break down the contents of `Hello World.yml`, to understand how a component runs.

### YAML

According to [*The Official YAML Web Site*](http://yaml.org/), "YAML is a human friendly data serialization
  standard for all programming languages." Compost components are written in YAML, because it is concise, it lacks superfluous symbols like quotes and braces, and it converts directly to JSON, which makes it interoperable with JavaScript. 
  
YAML is easy to learn. It consists of two data structures used by Compost:

- Dictionaries, which are rows of key-value pairs like

```yaml
key 1: value 1
key 2: value 2
key 3: value 3
```

- Lists, which are rows of dash-prefixed values like

```yaml
- value 1
- value 2
- value 3
```

These YAML data structures are analogous to JSON objects and arrays.

Quotes, braces, and most other symbols are not needed, because YAML is a data structure, not algorithmic code. This data is fed into the Compost build system and runtime engine, which executes the application.

### Type

Each component has a **type**, which defines the domains of values which are allowed to pass through component's inputs and output.

Our example `Hello World.yml` defines a component type with one input named `action`, which must be a string:

```yaml
type:
  component:
    inputs:
      action: string
```

When it comes to I/O streams, the Compost type system is designed to be incrementally adoptable: You can start off using no types at all, then gradually introduce them into your components later on. Each component itself has a *component type*, which is composed of *stream types* like `string`. Using component types is required to define components, but using stream types is completely optional.

You'll learn much more about the Compost type system as you go.

### Children

Every branch component has **children**, which is a dictionary mapping names to component types.

`Hello World.yml` has just one child, named `echo` with a type of `common/echo`:

```yaml
children:
  echo: common/echo
```

The type `common/echo` is part of the standard library of Compost components. It defines a component with one input named `action` causing a value to be "echoed" to the console. 

A component may have any number of children, so long as those children do not include the component itself, and none of those children have the component as one of their own children. Recursive relationships, or cycles, between components are not allowed, since this would cause infinite recursion. When an application is built or run, all of its child components are built or run, and so on. All of the components for an application are constructed once at start-up, and then they are connected, and data begins to pass through their I/O streams.

### Connections

Connections form the links between I/O streams within a branch component. A branch is responsible for defining all of the connections that start from each of its own inputs and each of its children's outputs. This means that a branch is not allowed to define a connection that starts from one of its children's inputs, or from its own output. This helps make reasoning about connections predictable, because the definition of any given connection has only one possible location.

`Hello World.yml` has just one connection, starting from its own input named `action`, and connecting to the `action` input of its child named `echo`:

```yaml
connections:
  action:
    echo: action
```

A branch may have any number of connections, so long as they conform to the constraints I've just described. The `connections` section of a branch is a dictionary where each key is the name of an input or a child output where connections start, and each value is a dictionary containing destinations, where each key is the name of a child and each value is a name or list of names of one of that child's inputs. One of the keys in a destination dictionary can also be `output`, with an empty value, which indicates that the destination of this connection is the branch's output.

### Defaults

So far, we haven't defined any actual data to pass through our streams. We've defined how the work is done, but nothing will happen without some data. Each component, branch or leaf, may have an optional `defaults` section, which is a dictionary where each key is the name of an input or a child and each value is some data which will pass through a branch input or child output stream immediately after the application starts, before any other values pass through.

`Hello World.yml` has one default value, from the branch's `action` input:

```yaml
defaults:
  action: Hello, world!
```

This means that a value of `"Hello, world!"` will pass through the branch's `action` input immediately after start up. Since the branch `action` input is connected to the `echo action` input, the text `Hello, world!` gets echoed to the console immediately after the application starts.

## An Introduction to Types

In Compost, every application is composed of definitions, which are YAML files. Every definition has a type, found under the definition's `type` key. And every definition is either a component or a stream. So naturally, there are component types and stream types.

### Component Types

As you've learned, a **component type** is composed of stream types, with at least one input stream and at most one output stream:

```yaml
component:
  inputs:
    input name 1: input type 1
    input name 2: input type 2
    (etc...)
  output: output type
```

### Stream Types

The input and output types of components are **stream types**.
