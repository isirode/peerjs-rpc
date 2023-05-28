# Developer

## Participating

You can post an issue or you can open a PR, if there is a functionality that you think will be relevant to the project.

Your code will be posted using the same license as this project.

## Running tests

> npm test

Or

> yarn test

## Build

> npm run build

Or

> yarn build

## Features

- [ ] Expose a service
  - [ ] Expose objects, type, name etc

- [ ] Instantiate an object of a type
  - [ ] Local side
  - [ ] Remote side
  - [ ] Pick the users

- [x] Call methods of a synchronized object
  - [x ] Local side
  - [x] Remote side
  - [x] Pick the users
  - [x] With a return value
    - Need a Promise here

- [x] Synchronize variables of an object
  - Do not need a Promise
    - But require that you set them from time to time
    - In different directions
    - Ownership simplify this
  - [ ] Whitelist
  - [ ] Blacklist
  - [ ] Decorator
  - [ ] Callback when updated (propName, newValue, formerValue)

- [x] Handle async methods and await a response
  - Proxy will hardly know that it is an async method

- [x] Object argument

- [x] Variable arguments
  - The proxy do not indicate the name of the arguments
  - Using the spread operator give the error 'A spread argument must either have a tuple type or be passed to a rest parameter.'
    - It seem this is not supported in Typescript
    - But by casting to any, it does work

## TODO

- Implement the tests
