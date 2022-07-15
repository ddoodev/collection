<p align="center">
  <a href="https://ddoo.dev/coll"><img width="520" src="https://cdn.discordapp.com/attachments/531549268033404928/891043294337982575/ddoologo_new_1.2_banner_collection.svg" alt=""></a>
</p>

<p align="center">
  <b>
    Discord bots. Simplified and boosted
    <span> · </span>
    <a href="https://ddoo.dev/coll">Docs</a>
    <span> · </span>
    <a href="https://github.com/ddoodev/discordoo/blob/develop/CONTRIBUTING.md">Contribute</a>
  </b>
</p>

<p align="center">
  <a href="https://github.com/ddoodev/collection/actions">
    <img src="https://github.com/ddoodev/collection/workflows/Tests/badge.svg" alt="Testing status" />
  </a>
  <a href="https://github.com/ddoodev/collection/actions">
    <img src="https://github.com/ddoodev/collection/workflows/Lint/badge.svg" alt="Linting status" />
  </a>
  <a href="https://ddoo.dev/discord">
    <img 
      src="https://img.shields.io/discord/811663819721539674?color=7280DA&label=Discord&logo=discord&logoColor=white" 
      alt="Online"
    >
  </a>
</p>
<hr>

# Discordoo Collection
A utility data structure used within the Discordoo, Discord API library.

## About
[Collection](https://ddoo.dev/coll) was created for use inside Discordoo, for storing the cache in it and for convenient interaction with local lists.

We decided to put the Collection in a separate repository, so that third-party developers can use it without installing the entire Discordoo.

## Quick Reference
* [Collection API Documentation](https://ddoo.dev/coll)
* Optionally lodash can be installed for deep equal processing
* Node.js 12.0.0 or newer required

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

const fn = (value, key, collection) => key % 2 !== 0

// also you can choose in wich format return filtered values
collection.filter(fn, { returnType: 'map' }) // return data stored in javascript Map
collection.filter(fn, { returnType: 'collection' }) // return data stored in collection
collection.filter(fn, { returnType: 'array' }) // return data stored in array (default)
```

#### How to use filter option 'return' for typescript users:
```ts
import { Collection } from '@discordoo/collection'

const collection = new Collection(), fn = () => {}

console.log(collection.filter<Collection>   (fn, { returnType: 'collection' }).size)
console.log(collection.filter<Map<any, any>>(fn, { returnType: 'map' })       .size)
console.log(collection.filter<Array<any>>   (fn, { returnType: 'array' })     .length)
console.log(collection.filter(fn).length) // default to Array<[ K, V ]>
```

#### How to use collection random:
```ts
import { Collection } from '@discordoo/collection'

const collection = new Collection()

collection.random() // get 1 random value from collection
const values = collection.random(32) // get 32 random values from collection
console.log(values) // [ value, value, value ]

// get random keys from collection
collection.random(11, { returnType: 'keys' })
// get random key from collection
collection.random(undefined /* or 1 */, { returnType: 'keys' })
```

#### How to use collection random returnType option for typescript users:
```ts
import { Collection } from '@discordoo/collection'

type K = number
type V = string

const collection = new Collection<K, V>() // number - key, string - value

collection.random<K[]>(5, { returnType: 'keys' }) // tell typescript that we are expect array of collection keys
collection.random<[ K, V ]>(undefined, { returnType: 'blocks' }) // tell typescript that we are expect 1 block
collection.random<Array<[ K, V ]>>(5, { returnType: 'blocks' }) // tell typescript that we are expect array of blocks
```


## Discord.js collection VS ddoo collection speed tests
Discord.js is the most popular library for developing bots, so we will compare with it.
(if you're interested, ddoo is roughly comparable to eris in collection speed)

Higher is better.

### Test: get random elements from collection
1. [100 elements in collection, 5 random elements](https://jsben.ch/mNKer) | [result](https://user-images.githubusercontent.com/44965055/126082272-a3e09d46-a67e-41f8-b000-b8315243c68e.png)
2. [800 elements in collection, 150 random elements](https://jsben.ch/en4FL) | [result](https://user-images.githubusercontent.com/44965055/126082328-312d7d77-f409-49fc-b382-dfb972b66567.png)
3. [10000 elements in collection, 1000 random elements](https://jsben.ch/86Fpd) | [result](https://user-images.githubusercontent.com/44965055/126082356-09a8bcc8-8bdd-4310-a6c2-e25674768a4c.png)
4. [10000 elements in collection, 8000 random elements](https://jsben.ch/q5IXT) | [result](https://user-images.githubusercontent.com/44965055/126082376-3a1e3c5d-3ab5-4c93-b8b3-a7c58cfe3deb.png)


### Test: filter 50% of elements from collection
1. [100 elements in collection](https://jsben.ch/coBir) | [result](https://user-images.githubusercontent.com/44965055/126082408-3ab9357b-36c4-4813-8905-f7b1b18f085d.png)
2. [800 elements in collection](https://jsben.ch/UcXNJ) | [result](https://user-images.githubusercontent.com/44965055/126082429-9bf00f20-b2a8-4566-a638-1d72193ce9ba.png)
3. [10000 elements in collection](https://jsben.ch/GYwWj) | [result](https://user-images.githubusercontent.com/44965055/126082458-7850537a-db4f-4877-ae6f-0972f1508a02.png)


### Test: map collection elements
1. [100 elements in collection](https://jsben.ch/Gqp0P) | [result](https://user-images.githubusercontent.com/44965055/126082472-6193b745-788f-4194-8355-4e52156b1f5c.png)
2. [800 elements in collection](https://jsben.ch/NNGE4) | [result](https://user-images.githubusercontent.com/44965055/126082498-2acc5ad3-0f22-4bb0-b6f6-9c455aca9c83.png)
3. [10000 elements in collection](https://jsben.ch/rMMWl) | [result](https://user-images.githubusercontent.com/44965055/126082513-32c06b67-9725-4d83-b1de-7224ce822ec9.png)

