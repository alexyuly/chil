# `vinescape`
a specification for code-free applications

Copyright &copy; 2017 Alex Yuly

## Motivation

Many software applications are primarily concerned with delivering *information* to users. However, most such applications are developed in terms of *instructions* delivered to computers. Traditional code creates a model of computers as "puppets", which are controlled by sequences of commands that lead to some desired information for users. Often, information is not directly modeled in code. This makes application development needlessly inefficient, because these models depend on instructions that must be reduced to information, rather than directly relying on information. There is a one-to-many mapping of any set of information to possible sets of instructions that may produce it, so application developers tend to repeatedly solve the same problems for users in various suboptimal ways.

*What the user will consume and why* is more important than what the computer will do and when. Computer instructions can be managed at a lower level of abstraction than business logic. We can create a model of computer as "plumbing" or "scaffolding", by defining components based on a finite set of abstract operations that conditionally transform and send information to other components.

## Types, Operations, Components: The Building Blocks of `vinescape`

`vinescape` defines applications in terms of *operations*. An operation is a unit of processing that has *n* named inputs called *sources* and one output called the *sink*. A component likewise has sources and a sink, and additionally it defines a set of relationships between instances of operations and components and their sources and sinks. A component with 1 or more *start operations* may be executed as an application.

### Types

`vinescape` is notated with JSON (JavaScript Object Notation), so its primitive types come from JSON. Operations and components are also types.
