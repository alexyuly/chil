# *This specification is a draft, with work in progress.*

# Chil Language Specification (Edition No. 1, June 2018)

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license. See LICENSE.

## Introduction

This standard defines the first edition of the Chil Language. Chil is a dynamic application programming language for expressing informational hierarchies formed by components. The *Chil* name is an acronym for *component hierarchy information language*.

Traditional object-oriented systems organize functions into in classes, which expose functions for objects to call in order to retrieve data or invoke actions. In terms of a directed object graph, functions result in a high degree of bidirectional data flow, since object A delegates control to a function of object B, which returns control to object A.

Moreover, pervasive object-oriented frameworks like C++, Java, and JavaScript, support freely inheriting and overriding functions in order to define the particular control flow of a class. Function inheritance and overrides cause a tight dependency of children on their parents, since a slight change in the behavior of a parent function may have unknown consequences on the behavior of child functions. This creates a domino effect which helps make software unmaintainable, by causing base classes to become both more rigid and more delicate over time.

Worse yet, objects may freely pass references around the object graph, allowing references to travel and live arbitrarily far from their point of construction. JavaScript wholeheartedly embraces the reference-passing approach, which for some applications can be brilliant. Unlimited object-oriented reflection might be a great way to build a compiler, but it's a lousy way to build a business product, which demands constant change, instant integration, and enforcement of rules.

Chil is a different kind of object-oriented system, built for business and consumer applications, to bridge the gaps between designers, engineers, and end users.

Chil organizes data into components, which are built from instances of other components. Functions are replaced by streams, which are organized into components instead of classes. In terms of data flow, streams are unidirectional while functions are bidirectional. Streams are autonomous, while functions are tools. A stream listens for incoming data and sends outgoing data, of its own accord. A function is called by a subject in order to manipulate an object. A stream gives to an object, while objects take from functions.

### Push and pull

Chil is a *push* system, in a world where most object-oriented languages are *pull* systems. *Push* is the design philosophy that objects should 1) report their own status, and 2) listen for the status of other objects. An object should never access the data of another object, nor should it ever directly control the behavior of another object. In this way, objects are well encapsulated, and data flow is separate from control flow.

*Pull* is the design philosophy that objects should 1) allow other objects to fetch their status, and 2) allow other objects to control their behavior. In this way, objects are not encapsulated at all, and data flow is mixed with control flow, which makes control flow harder to reason about.
