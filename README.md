# *This specification is a draft, with work in progress.*

# Chil Language Specification (Edition No. 1, June 2018)

Copyright (c) 2017-2018 Alex Yuly. Distributed under the MIT license. See LICENSE.

## Introduction

This standard defines the first edition of the Chil Language. Chil is a dynamic application programming language for expressing informational hierarchies formed by components. The *Chil* name is an acronym for *component hierarchy information language*.

Traditional object-oriented systems organize functions into classes, which expose functions for objects to call in order to retrieve data or invoke actions. In terms of a directed object graph, functions result in a high degree of bidirectional data flow, since object A delegates control to a function of object B, which returns control to object A.

Moreover, pervasive object-oriented frameworks like C++, Java, and JavaScript, support freely inheriting and overriding functions in order to define the particular control flow of a class. Function inheritance and overrides cause a tight dependency of children on their parents, since a slight change in the behavior of a parent function may have unknown consequences on the behavior of child functions. This creates a domino effect which helps make software unmaintainable, by causing base classes to become both more rigid and more delicate over time.

Worse yet, objects may freely pass references around the object graph, allowing references to travel and live arbitrarily far from their point of construction. JavaScript wholeheartedly embraces the reference-passing approach, which for some applications can be brilliant. Unlimited object-oriented reflection might be a great way to build a compiler, but it's a lousy way to build a consumer product which demands constant change, instant integration, and enforcement of business rules.

Chil is a different kind of object-oriented system, built for business and consumer applications, to bridge the gaps between designers, engineers, and end users.

Chil is organized around components, which are built from instances of other components. Functions are replaced by streams, which are organized into components instead of classes. In terms of data flow, streams are unidirectional while functions are bidirectional. Streams are autonomous, while functions are tools. A stream listens for incoming data and sends outgoing data, of its own accord. A function is called by a subject in order to manipulate an object. A stream gives to an object, while objects take from functions.

Chil is a *push* system, in a world where most object-oriented languages are *pull* systems. *Push* is the design philosophy that objects should 1) report their own status, and 2) listen for the status of other objects. An object should never access the data of another object, nor should it ever directly control the behavior of another object. In this way, object responsibilities are well encapsulated, and data flow is separate from control flow.

*Pull* is the design philosophy that objects should 1) allow other objects to fetch their status, and 2) allow other objects to directly control their behavior. In this way, object responsibilities are not encapsulated at all, and data and control flow are mixed, which makes control flow harder to reason about, and data flow harder to change.

## 1 Compiler architecture

Chil is designed to be universally applicable to, and agnostic of the differences between, various runtime environments, where appropriate. Source code expressed as any number of YAML files is sent to the Chil compiler, which outputs *Chil intermediate code* (*CIC*), expressed as a single JSON file. CIC is parsed by a Chil runtime engine which executes the code on a specific platform such as Node.js.

A single source file is passed as an argument to the compiler *shell*, which enters the object graph at that point and builds a consolidated representation of the parent-child relationship tree, combined with the sibling relationship graph encapsulated by each object.

![Figure 1.1: a visual representation of parent-child relationships (overlapping circles) and sibling relationships (connected circles)](images/Figure-1-1.png)

Figure 1.1: a visual representation of parent-child relationships (overlapping circles) and sibling relationships (connected circles)

## 2 Component behavior

Chil is organized around the *component*, which is a collection of streams which receive input and send output on behalf of the component. 

## 3 Source code

Chil source code is formatted according to the [YAML 1.2 specification](http://yaml.org/spec/1.2/spec.html). Each source file has an extension of either `.layout` or `.domain`, according to its purpose. The purpose of a layout source file is to define the flow of data through each input stream of a component. The purpose of a domain source file is to define the types of data permitted to be sent to each input stream of the same component. So, there is a 1:1 mapping of a component to a set of layout and domain files. Within this set, the domain file is optional. If nonexistent, then the type of data permitted for each input is the union of all possible types of data.

### 3.1 Domain source files

The domain source file for a given component is expressed as a YAML document with a dictionary mapping names of input streams, to the types of data permitted to be sent to those inputs. A type of data is defined as a set of values. Some types are inherent to chil and may be referenced in any domain file.

#### 3.1.1 Numbers

The type of data which includes all valid JSON numbers is expressed as `number`. So, a simple domain file for a component with one input which accepts only numbers looks like:

```yaml
main: number
```
