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

Any type:
- `any` - union of all types

Primitive types:
- `number`: behaves like JavaScript `Number`
- `string`: behaves like JavaScript `String`
- `boolean`: behaves like JavaScript `Boolean` *(note - booleans are not frequently used)*
- `vector<Type>`: behaves like JavaScript `Array`, except all elements are of a single type
- `struct`: behaves like JavaScript `Object`

### Operations

#### Start operations
- `event<Value>`: synchronously sink `Value` on application start: `() -> Value`

#### Asynchronous operations
- `delay`: asynchronously sink a `null` event for each `feed` source event: `(feed:number) -> feed milliseconds later, sink null`

#### Generic operations
- `map<Feed, Sink>`: synchronously sink each `feed` source event (or 1 or more other events, depending on implementation): `(feed:Feed) -> feed:Sink`
- `reduce<Seed, Feed>`: once the first `seed` and `feed` source events have both arrived, and for each `feed` source event thereafter, sink the last `seed` event (or a function of `seed` and `feed`, depending on implementation): `(seed:Seed, feed:Feed) -> seed`
- `equal<Type>` implements `reduce<Type, Type>`: `(seed, feed) -> if feed == seed then feed` *(uses deep value equality)*
- `unequal<Type>` implements `reduce<Type, Type>`: `(seed, feed) -> if feed != seed then feed` *(uses deep value inequality)*

#### Skip and take
- `skip<Type>` implements `reduce<number, Type>`: for each `seed` source event, skip the next so many `feed` events
- `take<Type>` implements `reduce<number, Type>`: for each `seed` source event, take only the next so many `feed` events

#### Operations on numbers

- `negate` implements `map<number, number>`: `feed -> -feed`
- `invert` implements `map<number, number>`: `feed -> 1 / feed`
- `add` implements `reduce<number, number>`: `(seed, feed) -> feed + seed`
- `multiply` implements `reduce<number, number>`: `(seed, feed) -> feed * seed`
- `modulus` implements `reduce<number, number>`: `(seed, feed) -> feed % seed`
- `less` implements `reduce<number, number>`: `(seed, feed) -> if feed < seed then feed`
- `least` implements `reduce<number, number>`: `(seed, feed) -> if feed <= seed then feed`
- `greater` implements `reduce<number, number>`: `(seed, feed) -> if feed > seed then feed`
- `greatest` implements `reduce<number, number>`: `(seed, feed) -> if feed >= seed then feed`

#### Operations on vectors

- `append<Type>` implements `reduce<Type or vector<Type>, vector<Type>>`: `(seed, feed) -> feed.concat(seed)`
- `chain<Type>` implements `map<vector<Type>, Type>`: `feed -> for each in feed`
- `count<Type>` implements `map<vector<Type>, number>`: `feed -> feed.length`
- `reverse<Type>` implements `map<vector<Type>, vector<Type>>`: `feed -> [...feed.reverse()]`
- `slice<Type>` implements `reduce<number, vector<Type>>`: `(seed, feed) -> feed.slice(seed)`

#### Operations on structs

- `combine<...Sources>`: once all *n* source events have arrived, and for each of any event thereafter, synchronously sink an event that maps the last event from each source to a new `struct`: `(...sources) -> { ...sources }`

#### Higher-order operations

- `variable<Operation:operation, ...sources>`: for each `operation` source event, adopt the behavior of that operation for all sources and sink
