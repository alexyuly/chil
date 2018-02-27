# GLU

**GLU: Graph Language Utility**

Copyright 2017-2018 Alex Yuly

Distributed under the MIT license.

## Welcome to GLU

GLU, short for "Graph Language Utility", is a new language and software development kit for building applications with directed graphs of components.

## glu-shell

The primary tool for GLU application development is glu-shell, which builds and runs GLU application within Node.js.

### Installation

```
git clone https://github.com/alexyuly/glu
cd glu/packages/glu-shell
yarn link
```

### Usage

`glu run [path to file]`

If `[path to file]` has a `.json` extension, then runs that file as a GLU application without building, or else:

1) First, builds the GLU source file found at `[path to file]`. The file must be in YAML format, with a `.yml` extension. Outputs one build artifact, which is a GLU application file with the same path and name as the source file, except it has a `.json` extension. Any existing file with that path and name is overwritten.
2) Then, runs the resulting build artifact.

`glu build [path to file]`

Builds the GLU source file found at `[path to file]`, without running it. See documentation for `glu run`.

### "Hello, World!"

Open up a text editor, and paste the following YAML document into a new file named `Hello World.yml`:

```yaml
type: sink
  
operation:
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

This document defines a GLU component, which has three basic sections, named `type`, `operation`, and `events`.

#### `type`

Every component has a type, which defines the types of data which can be streamed through the component's inputs and output. Every component has at least one input, and at most one output.

Notice that `Hello World.yml` has `type: sink`. Let's look at `sink.yml`, which is part of the GLU standard library, and is accessible from any GLU source file:

```yaml
variables:
  action:
  
type:
  component:
    inputs:
      action: action
  
```

#### `variables`

`sink.yml` has a new section named `variables`. Variables define a dictionary of types, whose keys can be referenced anywhere in the source file. This dictionary has just one key named `action`.

In this case, `Hello World.yml` imports `sink.yml` when it declares `type: sink`. (Note, the import happens implicitly: Since there is no `sink.yml` in your local directory, the reference to `sink` resolves to the GLU standard library.)

The values of the dictionary are passed to the component when its type is referenced in another source file which imports it. However, in this case no variables are passed to `sink`, so `action` gets the value declared by `sink.yml`, which in this case is empty. (Note that `action:` is a YAML key with an empty value.) An empty value for a type indicates that any type is allowed.

#### TODO

Much more to come... This README is a work in progress...
