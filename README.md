# chil

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license. See LICENSE.

## Introduction

Chil is a dynamic application programming language for expressing informational hierarchies formed by components. In fact, the name "chil" is an acronym for "component hierarchy information language".

### Comparison vs. traditional object-oriented systems

#### Components

Traditional object-oriented systems organize components in "classes", which exposes methods which other class instances may call to invoke some action or retrieve a piece of data. A chil component's interface consists of any number of inputs and one output. The flow of control is inverted. This means that components are not responsible for proactively controlling another component's behavior or reading from its data. They are only responsible for communicating their own status.

#### Hierarchy

Traditional object-oriented systems implement some form of communication hierarchy through keywords like "public" and "private". Components are limited in what methods they can call. But this limitation is arbitraily defined. In chil, communication hierarchy is explicit. Components are purely encapsulated, and communication is only allowed between directly connected components, through explicitly connected input/output channels.

#### Information

Traditional object-oriented systems typically use "getters" and "setters" to read and write data. Chil components never read or mutate another component's data. Instead, they inform other components of some intention. Component communication is purely based on messages. Once a component receives a message, it decides what actions to take. This results in 100% component encapsulation and decoupling.

## Motivation



## Specification


