# `vinescape`
a specification for informative applications, for Node.js and Chrome

Copyright &copy; 2017 Alex Yuly

## Motivation

Many software applications deal with processing and delivering *information* to users, but most of these applications model information indirectly in terms of *instructions* delivered to computers. This makes application development needlessly inefficient, because these models must be reduced to information at runtime, which obscures it during development. Many possible sets of instructions exist to model any set of information, so application developers tend to repeatedly solve the same problems for users in various suboptimal ways.

If modeling user experience is more important than modeling CPU execution and memory allocation, then all imperative processing should be entirely encapsulated in a lower level of abstraction. In this user-oriented model, a finite set of strongly typed operations are chained into reusable components that represent nodes on a directed graph through which data "flows". Each node is solely responsible for *when* and *what* data it broadcasts to a constant set of other nodes: This stands in stark contrast to many so-called "object oriented" systems in which any node may be responsible for controlling the behavior of any other nodes. In a *control-oriented* system, data and control are swimming in a mixed up sea of concepts, but in a user-first *informative* system, the relationship between data is fully abstract.
