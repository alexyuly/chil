![compost](https://github.com/compostsoftware/compost/blob/master/images/masthead.png)

*Compost: The Environmentally Friendly Framework*

**Reduce** code. **Reuse** apps. **Recycle** data.

#### Legal

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license. See LICENSE.

## What is Compost?

Compost is a framework for building apps on top of Node.js, *with as little code as possible*. Please install [Node.js](https://nodejs.org/en/) before using Compost. Familiarly with Node.js and JavaScript is recommended but not required. **This software is incomplete and under active development, so there is more code and documentation coming every week. Stay tuned.**

### An Introduction to Components

Every Compost app is a **component**. Components have inputs and outputs which are streams.

#### Input/Output Streams

An input/output stream sends values to other I/O streams. A component may have one **output stream**, or "output". A component must also have one or more **input streams**, or "inputs". A component is responsible for defining how its own inputs send values to other streams: How this happens depends on whether the component is a "leaf" or a "branch".

#### Leaf Components

A **leaf component**, or "leaf", has no children. Instead, it has a Node.js module which uses JavaScript code to define how and when its inputs send values to its own output. Soon, you'll learn how to write leafs, but first you'll learn how to use them within branches.

#### Branch Components

A **branch component**, or "branch", has **children**, which are other leaf or branch components. A branch also has **connections**, which define pairs of streams where one stream sends values to another. A connection must start from an input of the branch or an output of one of its children, and it must not end at one of these streams. This is important, because you can't connect a child's input, since that child is responsible for connecting its own inputs, privately.

### Let's Write a Component

Open a text editor and paste the following:

```yaml
type:
  component:
    inputs:
      action: string

children:
  echo: echo

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

So, what happened? Let's break down the contents of `Hello World.yml`.

#### YAML

According to [*The Official YAML Web Site*](http://yaml.org/), "YAML is a human friendly data serialization
  standard for all programming languages." Compost components are written in YAML, because it is concise, it lacks unnecessary symbols like quotes and braces, and it converts directly to JSON, which makes it interoperable with JavaScript. 
  
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

These YAML data structures are converted directly to JSON objects and arrays.

Quotes, braces, and most other symbols are not needed, because Compost YAML is a data structure, not algorithmic code. This data is fed into the Compost build system and runtime engine, which produces the application execution.

#### Type

Each component has a **type**, which defines the domain of values which can be sent by the component's inputs and output. `Hello World.yml` defines a component type with one input named `action`, which must be a string:

```yaml
type:
  component:
    inputs:
      action: string
```

You'll learn more about the Compost type system as you go.

#### Children

Each component has **children**, which is a dictionary of named components. 
