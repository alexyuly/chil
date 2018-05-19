# chil

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license. See LICENSE.

## Introduction

Chil is a dynamic application programming language for expressing informational hierarchies formed by components. In fact, the name "chil" is an acronym for "component hierarchy information language".

### Comparison vs. traditional object-oriented systems

#### Components

Traditional object-oriented systems organize components in "classes", which expose methods which other class instances may call to invoke some action or retrieve a piece of data. In chil, the flow of control is inverted. This means that components are not responsible for proactively controlling another component's behavior or reading from its data. They are only responsible for communicating their own status through an output, which is connected to other component inputs.

#### Hierarchy

Traditional object-oriented systems implement some form of communication hierarchy through keywords like "public" and "private". Components are limited in what methods they can call, but there is no explicit contract between each pair of components. Any component may "talk" to any other component which has a public interface. Chil has a sense of physical space, within a hierachical graph of component instances. Communication is only allowed between components which have explicitly connected input/output channels.

#### Information

Traditional object-oriented systems typically use "getters" and "setters" to read and write data. Chil components never read or mutate another component's data. Instead, they inform other components of some intention. Component communication is purely based on messages. Once a component receives a message, it decides what actions to take. This results in 100% component encapsulation and decoupling.

## Motivation

Most traditional systems of any scope devolve into chaos. Chil consciously imposes severe constraints on the construction of application systems, in order to make reasoning and iterating on applications easier and quicker. It also facilitates development through GUIs, eliminating the need for code at all. There is a one-to-one relationship between chil code and a graph structure which can be represented directly in a GUI.

## Specification


