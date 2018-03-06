![compost](https://github.com/compostsoftware/compost/blob/master/images/masthead.png)

*Compost: The Environmentally Friendly Framework*

**Reduce** code. **Reuse** apps. **Recycle** data.

#### Legal

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license. See LICENSE.

## What is Compost?

Compost is a framework for building apps on top of Node.js, *with as little code as possible*. **Please be aware that Compost is incomplete and under active development, so there are tons more code, docs, and features coming every week. Stay tuned.**

### Components

Every Compost app is a **component**. Components have inputs and outputs.

#### Streams

A stream sends values to other streams. A component may have one **output stream**, or "output". A component is never responsible for defining how its output sends values. Also, a component must have one or more **input streams**, or "inputs". A component is solely responsible for defining how its inputs send values to other streams: How this happens depends on whether the component is a "leaf" or a "branch".

#### Leaf Components

A **leaf component**, or "leaf", has no children. Instead, it has a Node.js module which uses code to define how and when its inputs send values to its own output. Soon, you'll learn how to write leafs, but for now you'll just learn how to use them.

#### Branch Components

A **branch component**, or "branch", has **children** which are other leaf or branch components. A branch also has **connections** which define how its streams send values.

Since a component is a solely responsible for its own inputs but never in charge of its output, a connection is limited to one of the following forms:
- a branch input to a child input
- a child output to a branch input
- a child output to a child input
- a child output to the branch output

Notice that a branch is responsible for connecting its own inputs and the outputs of its children.

## Start Using Compost

Install the Compost shell globally with NPM:

`npm install --global @compost/shell`

Clone this repository and run the example "Hello, world!" app:

```
git clone https://github.com/compostsoftware/compost
cd compost
compost run 'examples/Hello World.yml'
```
