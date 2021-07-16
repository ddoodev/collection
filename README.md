# Discordoo Collection
A utility data structure used within the Discordoo, Discord API library.

## About
Collection was created for use inside Discordoo, for storing the cache in it and for convenient interaction with local lists.

We decided to put the Collection in a separate repository, so that third-party developers can use it without installing the entire Discordoo.

## Examples

#### How to use collection filter:
```js
import { Collection } from '@discordoo/collection'

const collection = new Collection()

collection.set(1, 2).set(2, 3).set(3, 4).set(4, 5).set(5, 6)

// filter out elements that does not match filter fn
const filtered = collection.filter((value, key, collection) => key % 2 !== 0) // returns array

// do something with filtered elements
console.log(filtered.length) // 3
filtered.forEach(v => console.log(v[0])) // log all keys of filtered elements
filtered.forEach(v => console.log(v[1])) // log all values of filtered elements

/**
 * Filtered elements array looks like this:
 * [ [ FilteredKey, FilteredValue ], [ FilteredKey, FilteredValue ], [ FilteredKey, FilteredValue ] ]
 * which means that this
 * Collection [Map] {
 *   1 => 2,
 *   2 => 3,
 *   3 => 4,
 *   4 => 5,
 *   5 => 6
 * }
 * after this
 * collection.filter((value, key, collection) => key % 2 !== 0)
 * turns into this
 * [ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ] ]
 * */
```

#### How to use filter option 'return' for typescript users:
```ts
import { Collection } from '@discordoo/collection'

const collection = new Collection(), fn = () => {}

console.log(collection.filter<Collection>   (fn, { return: 'collection' }).size)
console.log(collection.filter<Map<any, any>>(fn, { return: 'map' })       .size)
console.log(collection.filter<Array<any>>   (fn, { return: 'array' })     .length)
console.log(collection.filter(fn).length) // default to Array<[ K, V ]>
```

#### How to use collection random
```ts
import { Collection } from '@discordoo/collection'

const collection = new Collection()

collection.random() // get 1 random value from collection
const values = collection.random(32) // get 32 random values from collection
console.log(values) // [ value, value, value ]

// get random elements, not values from collection
```


## D.js collection VS ddoo collection speed tests
Discord.js is the most popular library for developing bots, so we will compare with it.
(if you're interested, ddoo is roughly comparable to eris in collection speed)

### Test: get random elements from collection
1. [100 elements in collection, 5 random elements](https://jsben.ch/mNKer)
2. [800 elements in collection, 150 random elements](https://jsben.ch/en4FL)
3. [10000 elements in collection, 1000 random elements](https://jsben.ch/86Fpd)
4. [10000 elements in collection, 8000 random elements](https://jsben.ch/q5IXT)

### Test: filter 50% of elements from collection
1. [100 elements in collection](https://jsben.ch/coBir)
2. [800 elements in collection](https://jsben.ch/UcXNJ)
3. [10000 elements in collection](https://jsben.ch/GYwWj)

### Test: map collection elements
1. [100 elements in collection](https://jsben.ch/Gqp0P)
2. [800 elements in collection](https://jsben.ch/NNGE4)
3. [10000 elements in collection](https://jsben.ch/rMMWl)
