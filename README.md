![compost](https://github.com/compostsoftware/compost/blob/master/images/masthead.png)

*Compost: The Environmentally Friendly Framework*

**Reduce** your code. **Reuse** your apps. **Recycle** your data.

#### Legal

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license. See LICENSE.

## What is Compost?

Compost is a framework for building apps on top of Node.js, *with as little code as possible*. **Please be aware that Compost is incomplete and under active development, so there are tons more code, docs, and features coming every week. Stay tuned.**

### Components

Every Compost app is a **component**. A component has at least one input, and at most one output.

#### Streams

Component inputs and outputs are **streams**, which send values to other streams. A component defines how its streams send values, according whether the component is a "leaf" or a "branch".

#### Leaf Components

A **leaf component**, or simply "leaf", has no children. Instead, it has a Node.js module which uses code to define how and when its input streams send values to its output stream. Soon, you'll learn how to write leafs. For now, you just need to know to use them.

#### Branch Components

A **branch component**, or "branch", has **children** which are other components (which can be leafs or branches). A branch also has **connections** which define how its streams send values.

You can't connect just any stream to any other stream. A connection is limited to one of three forms:
- a branch input to a child input
- a child output to a child input
- a child output to the branch output

These limits exist, because of the following rules:
- Each component is responsible for connecting its own inputs, so a branch can't connect its children's inputs.
- Each component is responsible for connecting its children's outputs, so a branch can't connect its own output.
