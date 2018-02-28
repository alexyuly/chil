# GLU

**GLU: Graph Language Utility**

Copyright 2017-2018 Alex Yuly

Distributed under the MIT license.

## Welcome to GLU

GLU, short for "Graph Language Utility", is a language and runtime engine used to build and run software applications using directed graphs of components. The runtime engine is built on Node.js. Please download and install the latest version of Node.js before continuing.

### Use At Your Own Risk

This project is being modified constantly. The API you see today may change tomorrow. It may not work as expected today or tomorrow. Use GLU at your own risk. Please see the LICENSE for a full disclaimer of liability.

### Big Plans

One day, there will be a GUI for editing component graphs. Today, there is a CLI tool which builds and runs YAML documents.

### "Hello, World!"

Open up a text editor, and paste the following YAML document into a new file named `Hello World.yml`:

```yaml
type: sink
  
children:
  echo: echo
  
connections:
  action:
    echo: action
  
events:
  - component: self
    method: action
    value: Hello, World!
  
```

This document defines a GLU component with four sections, named `type`, `children`, `connections`, and `events`.

#### `type`

Every component has a section named `type`, which defines the types of values which can be streamed through the component's inputs and output. Every component has at least one input, and at most one output. A component is like a function, except its arguments (inputs) and return value (output) are streams of values over time, instead of a single value at one point in time. 

Notice that `Hello World.yml` has `type: sink`. Let's look at the source of `sink.yml`, which is part of the GLU standard library:

```yaml
variables:
  action:
  
type:
  component:
    inputs:
      action: action
  
```

#### `variables`

`sink.yml` has a section named `variables`. Variables are a dictionary of types, whose keys can be referenced anywhere in the source file. This dictionary has just one key named `action`.

In this case, `Hello World.yml` imports `sink.yml` when it declares `type: sink`. (Note, the import happens implicitly: Since there is no `sink.yml` in your local directory, the reference to `sink` resolves a file within the GLU standard library.)

The values of variables are passed to the component when its type is referenced in another source file which imports it. However, in this case no variables are passed to `sink`, so `action` gets the value declared by `sink.yml`, which is empty. (Note that `action:` is a YAML key with an empty value.) An empty value for a type indicates that any type is allowed.

Passing values to variables is always optional when declaring a type. If a variable is not specified, it gets the value declared by the variables dictionary of the type's source. If a variable is specified, then its type must be a subset of the type of variable declared by the source. So, the source variable is known as the "variable domain", while the variable passed in by another source is known as the "variable type".

We could have passed a value to the `action` variable, by declaring a type of `sink` with some variables, for example a sink of numbers:

```yaml
type:
  sink:
    action: number
```

#### `children`

Some components, like `Hello World.yml`, have a section named `children`, which defines child components.

Children are a dictionary which maps names to types of child components.

The `children` section of `Hello World.yml` defines just one child component named `echo`, which has type `echo`:

```yaml
children:
  echo: echo
```

#### `connections`

TODO - Much more README is coming soon...
