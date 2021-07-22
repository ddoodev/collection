import { CollectionFilterOptions } from '@src/interfaces/CollectionFilterOptions'
import { CollectionRandomOptions } from '@src/interfaces/CollectionRandomOptions'
import { CollectionEqualOptions } from '@src/interfaces/CollectionEqualOptions'
import { Predicate } from '@src/interfaces/Predicate'
import { equalFn } from '@src/interfaces/equalFn'
import { intoChunks } from '@src/utils/intoChunks'
import { range } from '@src/utils/range'
import { swap } from '@src/utils/swap'
import { CollectionConstructor } from '@src/interfaces/CollectionConstrcutor'

let lodashIsEqual: equalFn

try {
  lodashIsEqual = require('lodash/isEqual')
} catch (e) {} // eslint-disable-line no-empty


/**
 * An utility data structure used within the Discordoo.
 * */
export class Collection<K = any, V = any> extends Map<K, V> {
  /**
   * The Collection() constructor creates {@link Collection} objects.
   * @param iterable - An Array or other iterable object whose elements are key-value pairs such as [ [ 1, 'one' ], [ 2, 'two' ] ].
   * */
  [ 'constructor' ]: CollectionConstructor

  /**
   * Gets element from collection.
   * @param key - key of element
   * */
  get(key: K): V | undefined {
    return super.get(key)
  }

  /**
   * Sets a new element in the collection.
   * @param key - key of element
   * @param value - value (element) to set
   * */
  set(key: K, value: V): this {
    return super.set(key, value)
  }

  /**
   * Checks if an element exists in the collection.
   * @param key - key of element
   * */
  has(key: K): boolean {
    return super.has(key)
  }

  /**
   * Removes element from the collection.
   * @param key - key of element
   * */
  delete(key: K): boolean {
    return super.delete(key)
  }

  /**
   * Removes all elements from the collection.
   * */
  clear() {
    return super.clear()
  }

  /**
   * The amount of elements in this collection.
   * */
  get size(): number {
    return super.size
  }

  /**
   * The collection is empty or not.
   * */
  get empty(): boolean {
    return this.size === 0
  }

  /**
   * Gets a random value from collection.
   * */
  random(): V

  /**
   * Gets a random values from collection.
   * */
  random(amount: number): V[]

  /**
   * Gets a random values from collection (returnType values option is specified).
   * */
  random<T extends Array<V>>(amount: number, options: CollectionRandomOptions): V[]

  /**
   * Gets a random keys from collection (returnType keys option is specified).
   * */
  random<T extends Array<K>>(amount: number, options: CollectionRandomOptions): K[]

  /**
   * Gets a random blocks from collection (returnType blocks option is specified).
   * */
  random<T extends Array<[ K, V ]>>(amount: number, options: CollectionRandomOptions): Array<[ K, V ]>

  /**
   * Gets a random value from collection (returnType values option is specified, amount not provided).
   * */
  random<T extends V>(amount: undefined, options: CollectionRandomOptions): V

  /**
   * Gets a random key from collection (returnType keys option is specified, amount not provided).
   * */
  random<T extends K>(amount: undefined, options: CollectionRandomOptions): K

  /**
   * Gets a random block from collection (returnType block option is specified, amount not provided).
   * */
  random<T extends [ K, V ]>(amount: undefined, options: CollectionRandomOptions): [ K, V ]

  random(amount?: number, options: CollectionRandomOptions = {}): V  | K | [ K, V ] | V[] | K[] | Array<[ K, V ]> {
    const size = this.size, initialAmount = amount

    if (size < 1) throw new Error('Collection#random: Cannot get random elements from the empty collection')
    if (amount && amount > size) amount = size
    if (!amount || (amount && amount < 1)) amount = 1
    if (typeof options.unique !== 'boolean') options.unique = !!options.unique

    // switches the random numbers generation algorithm depending on the size of the collection and the size of the amount
    const largeAmount: boolean = Math.floor(amount / size * 100) > (size > 500 ? size > 1000 ? 15 : 50 : 80),
      arr = [ ...this.entries() ]
    let results: Array<[ K, V ]> = []

    // O(1) generation algorithm, https://stackoverflow.com/questions/196017/unique-non-repeating-random-numbers-in-o1
    if (largeAmount && options.unique) {
      let randomNumbers = range(size + 1),
        max = size

      for (let i = 0; i < size; i++) {
        const num = Math.floor(Math.random() * max)
        randomNumbers = swap(randomNumbers, num, max)
        max -= 1
      }

      for (let i = 0; i < amount; i++) {
        results.push(arr[randomNumbers[i]])
      }
    } else {
      const random: number[] = []

      // O(unknown) generation algorithm. works much faster in small collections, but much worse in big.
      // 1. gen
      // 2. if not unique, start from 1. else
      // 3. push to random numbers array
      if (options.unique) {
        for (let i = 0; i < amount; i++) {
          const num = Math.floor(Math.random() * size)
          random.indexOf(num) > -1 ? i -= 1 : random.push(num) // repeat iteration if number is not unique
        }
      } else {
        for (let i = 0; i < amount; i++) random.push(Math.floor(Math.random() * size))
      }

      results = random.map(r => arr[r])
    }

    let result: V[] | K[] | Array<[ K, V ]>

    switch (options?.returnType) {
      case 'keys':
        result = results.map(r => r[0])
        break
      case 'blocks':
        result = results
        break
      case 'values':
      default:
        result = results.map(r => r[1])
    }

    if ((typeof initialAmount === 'number' && initialAmount <= 1) || typeof initialAmount !== 'number') {
      return result[0]
    }

    return result
  }

  /**
   * Filters out the elements which don't meet requirements and returns array (default).
   * @param filter - function to use
   * @param options - filter options
   */
  filter<T extends Array<[ K, V ]> = Array<[ K, V ]>>(
    filter: Predicate<K, V, Collection<K, V>>, options?: CollectionFilterOptions
  ): Array<[ K, V ]>

  /**
   * Filters out the elements which don't meet requirements and returns map (return map option is specified).
   * @param filter - function to use
   * @param options - filter options
   */
  filter<T extends Map<K, V> = Map<K, V>>(
    filter: Predicate<K, V, Collection<K, V>>, options: CollectionFilterOptions
  ): Map<K, V>

  /**
   * Filters out the elements which don't meet requirements and returns collection (return collection option is specified).
   * @param filter - function to use
   * @param options - filter options
   */
  filter<T extends Collection = Collection<K, V>>(
    filter: Predicate<K, V, Collection<K, V>>, options: CollectionFilterOptions
  ): Collection<K, V>

  filter(
    filter: Predicate<K, V, Collection<K, V>>, options: CollectionFilterOptions = {}
  ): Collection<K, V> | Array<[ K, V ]> | Map<K, V> {
    let results, predicate: Predicate<K, V, Collection<K, V>>

    switch (options.return) {
      case 'map':
        results = new Map<K, V>()
        predicate = (v, k, c) => filter(v, k, c) && results.set(k, v)
        break
      case 'collection':
        results = new Collection<K, V>()
        predicate = (v, k, c) => filter(v, k, c) && results.set(k, v)
        break
      case 'array':
      default:
        results = []
        predicate = (v, k, c) => filter(v, k, c) && results.push([ k, v ])
        break
    }

    for (const [ key, value ] of this.entries()) {
      predicate(value, key, this)
    }

    return results
  }

  /**
   * Searches to the element in collection and returns it.
   * @param predicate - function to use
   * */
  find(predicate: Predicate<K, V, Collection<K, V>, boolean>): V | undefined {
    for (const [ key, value ] of this.entries()) {
      if (predicate(value, key, this)) return value
    }

    return undefined
  }

  /**
   * Executes a function on each of elements of collection.
   * @param predicate - function to use
   */
  forEach(predicate: Predicate<K, V, Collection<K, V>>) {
    super.forEach((v: V, k: K) => {
      predicate(v, k, this)
    })
  }

  /** Creates a new collection based on this one. */
  clone(): Collection<K, V> {
    return new Collection<K, V>([ ...this ])
  }

  /**
   * Checks if two collections are equal.
   * @param collection - collection to compare to
   * @param options - options to use
   */
  equal(collection: Collection<K, V>, options: CollectionEqualOptions = {}): boolean {
    if (this.size !== collection?.size) return false
    if (this === collection) return true

    let equal: equalFn = (arg1: any, arg2: any) => arg1 === arg2

    if (options.deep) {
      if (!lodashIsEqual) throw new Error('Collection#equal: cannot perform deep equal without lodash installed')
      else equal = (arg1: any, arg2: any) => lodashIsEqual(arg1, arg2)
    }

    for (const [ key, value ] of this.entries()) {
      switch (true) { // switch is faster than if, so we use it in the loop
        case !collection.has(key) || !equal(collection.get(key), value):
          return false
      }
    }

    return true
  }

  /**
   * Merges the specified collections into one and returns a new collection.
   * @param collections - collections to merge
   * */
  concat(collections: Collection<K, V>[]): Collection<K, V> {
    const merged = this.clone()

    for (const collection of collections) {
      if (!collection || !(collection instanceof Collection)) {
        continue
      }

      for (const [ key, value ] of collection.entries()) {
        merged.set(key, value)
      }
    }

    return merged
  }

  /**
   * Checks if any of values satisfies the condition.
   * @param predicate - function to use
   * */
  some(predicate: Predicate<K, V, Collection<K, V>, boolean>): boolean {
    for (const [ key, value ] of this.entries()) {
      if (predicate(value, key, this)) {
        return true
      }
    }

    return false
  }

  /**
   * Checks if all values satisfy the condition.
   * @param predicate - function to use
   * */
  every(predicate: Predicate<K, V, Collection<K, V>, boolean>): boolean {
    for (const [ key, value ] of this.entries()) {
      if (!predicate(value, key, this)) {
        return false
      }
    }

    return true
  }

  /**
   * Returns first collection value if it exists.
   * */
  first(): V | undefined

  /**
   * Returns first N collection values.
   * */
  first(amount: number): V[]

  first(amount?: number): V | V[] | undefined {
    if (!amount || amount <= 1) {
      return this.values().next().value
    }

    const values = [ ...this.values() ]

    amount = Math.min(values.length, amount)

    return values.slice(0, amount)
  }

  /**
   * Returns first collection key if it exists.
   * */
  firstKey(): K | undefined

  /**
   * Returns first N collection keys.
   * */
  firstKey(amount: number): K[]

  firstKey(amount?: number): K | K[] | undefined {
    if (!amount || amount <= 1) {
      return this.keys().next().value
    }

    const keys = [ ...this.keys() ]

    amount = Math.min(keys.length, amount)

    return keys.slice(0, amount)
  }

  /**
   * Returns last collection value if it exists.
   * */
  last(): V | undefined

  /**
   * Returns last N collection values.
   * */
  last(amount: number): V[]

  last(amount?: number): V | V[] | undefined {
    const values = [ ...this.values() ]

    if (!amount || amount <= 1) {
      return values[values.length - 1]
    }

    amount = Math.min(values.length, amount)

    return values.slice(-amount)
  }

  /**
   * Returns last collection key if it exists.
   * */
  lastKey(): K | undefined

  /**
   * Returns first N collection keys.
   * */
  lastKey(amount: number): K[]

  lastKey(amount?: number): K | K[] | undefined {
    const keys = [ ...this.keys() ]

    if (!amount || amount <= 1) {
      return keys[keys.length - 1]
    }

    amount = Math.min(keys.length, amount)

    return keys.slice(-amount)
  }

  /**
   * Maps each item to another value into an array.
   * @param predicate - function to use
   * */
  map<T = unknown>(predicate: Predicate<K, V, Collection<K, V>, T>): T[] {
    const result: T[] = []

    for (const [ key, value ] of this.entries()) {
      result.push(predicate(value, key, this))
    }

    return result
  }

  /**
  * Returns a collection chunked into several collections.
  * @param size - chunk size
  * */
  intoChunks(size?: number): Collection<K, V>[] {
    return intoChunks<[K, V]>([ ...this.entries() ], size)
      .map(e => new Collection(e))
  }
}
