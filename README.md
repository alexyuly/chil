# chil

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license. See LICENSE.

## Introduction

Chil is a dynamic application programming language for expressing informational hierarchies formed by components. In fact, the name "chil" is an acronym for "component hierarchy information language".

### Components

In any programming environment, a component encapsulates the implementation of a single piece of functionality within a well-defined interface. Consumers of a component are concerned with what the component does in terms of common abstractions, but they're not concerned with how it gets done. A chil component's interface consists of any number of inputs and one output. These inputs and outputs can be connected with others to describe the flow of information through an application.

### Hierarchy

Traditional object-oriented systems implement some form of communication hierarchy through keywords like "public" and "private". Components are limited in what methods they can call. But this limitation is arbitraily defined. In chil, communication hierarchy is explicit. Components are purely encapsulated, and communication is only allowed between directly connected components, through explicitly connected input/output channels.

### Information

Traditional object-oriented systems typically use "getters" and "setters" to read and write data. Chil components never read or mutate another component's data. Instead, they inform other components some intention. Component communication is purely based on messages. Once a component receives a message, it decides what actions to take. This results in 100% component encapsulation and decoupling.

## Motivation



## Specification


