import { Collection } from '@src/Collection'

describe('Collection', () => {
  const collection = new Collection()
  collection.set(1, '2').set(3, '4').set(5, '6')

  test('must contain 3 elements', () => {
    expect(
      collection.size
    ).toBe(3)
  }, 1000)

  test('must filter values and return collection', () => {
    expect(
      collection.filter<Collection>(value => value === '4', { return: 'collection' }).size
    ).toBe(1)
  })

  test('must filter values and return array', () => {
    expect(
      collection.filter<Array<any>>(value => value === '4', { return: 'array' }).length
    ).toBe(1)
  })

  test('must filter values and return array without any options', () => {
    expect(
      collection.filter<Array<any>>(value => value === '4' || value === '6' || value === '2').length
    ).toBe(3)
  })

  test('must return 1 random value', () => {
    expect(
      typeof collection.random()
    ).toBe('string')
  })

  test('must return 1 random value with 0 amount specified', () => {
    expect(
      typeof collection.random(0)
    ).toBe('string')
  })

  test('must return 1 random key', () => {
    expect(
      typeof collection.random(undefined, { returnType: 'keys' })
    ).toBe('number')
  })

  test('must return 1 random block', () => {
    expect(
      Array.isArray(collection.random(undefined, { returnType: 'blocks' }))
    ).toBe(true)
  })

  test('must return 2 random values', () => {
    expect(
      collection.random(2).filter(v => typeof v === 'string').length
    ).toBe(2)
  })

  test('must return 2 random values with option', () => {
    expect(
      collection.random(2, { returnType: 'values' }).filter(v => typeof v === 'string').length
    ).toBe(2)
  })

  test('must return 2 random keys', () => {
    expect(
      collection.random(2, { returnType: 'keys' }).filter(k => typeof k === 'number').length
    ).toBe(2)
  })

  test('must return 2 random blocks', () => {
    expect(
      collection
        .random(2, { returnType: 'blocks' })
        .filter(b => Array.isArray(b) && typeof b[0] === 'number' && typeof b[1] === 'string').length
    ).toBe(2)
  })

  test('must return 2 random unique values', () => {
    const results: any[] = []
    let nonRandom = 0

    const random = collection.random(2, { unique: true })

    random.forEach(v => {
      if (results.includes(v)) nonRandom++
      else results.push(v)
    })

    expect(
      nonRandom
    ).toBe(0)
  })

  test('must return 2 random unique keys', () => {
    const results: any[] = []
    let nonRandom = 0

    const random = collection.random(2, { unique: true, returnType: 'keys' })

    random.forEach(k => {
      if (results.includes(k)) nonRandom++
      else results.push(k)
    })

    expect(
      nonRandom
    ).toBe(0)
  })

  test('must return 2 random unique blocks', () => {
    const results: any[] = []
    let nonRandom = 0

    const random = collection.random(2, { unique: true, returnType: 'blocks' })

    random.forEach(b => {
      if (results.find(r => r[0] === b[0] && r[1] === b[1])) nonRandom++
      else results.push(b)
    })

    expect(
      nonRandom
    ).toBe(0)
  })

  test('must reduce keys', () => {
    expect(
      collection.reduce<number>((prev, currValue, currKey) => {
        return prev + currKey
      }, 0)
    ).toBe(9)
  })

  test('must reduce values', () => {
    expect(
      collection.reduce<string>((prev, currValue) => {
        return prev + currValue
      }, '')
    ).toBe('246')
  })

  test('must split into chunks', () => {
    expect(
      collection.intoChunks(1).length
    ).toBe(3)

    expect(
      collection.intoChunks(2).length
    ).toBe(2)

    expect(
      collection.intoChunks(1).every(v => v instanceof Collection)
    ).toBe(true)
  })

  test('must return first key', () => {
    const first = collection.entries().next().value[0]

    expect(
      collection.firstKey()
    ).toBe(first)
  })

  test('must return first value', () => {
    const first = collection.entries().next().value[1]

    expect(
      collection.first()
    ).toBe(first)
  })

  test('must return first 2 keys', () => {
    const entries = collection.entries()
    const first = [ entries.next().value[0], entries.next().value[0] ]

    expect(
      collection.firstKey(2).every(v => first.includes(v))
    ).toBe(true)
  })

  test('must return first 2 values', () => {
    const entries = collection.entries()
    const first = [ entries.next().value[1], entries.next().value[1] ]

    expect(
      collection.first(2).every(v => first.includes(v))
    ).toBe(true)
  })

  test('must return last value', () => {
    let last

    collection.forEach(v => last = v)

    expect(
      collection.last()
    ).toBe(last)
  })

  test('must return last key', () => {
    let last

    collection.forEach((v, k) => last = k)

    expect(
      collection.lastKey()
    ).toBe(last)
  })

  test('must return 2 last values', () => {
    let last: any[] = []

    collection.forEach(v => {
      last.push(v)

      if (last.length > 2) {
        last = last.slice(last.length - 2)
      }
    })

    expect(
      collection.last(2)
    ).toEqual(last)
  })

  test('must return 2 last keys', () => {
    let last: any[] = []

    collection.forEach((v, k) => {
      last.push(k)

      if (last.length > 2) {
        last = last.slice(last.length - 2)
      }
    })

    expect(
      collection.lastKey(2)
    ).toEqual(last)
  })

  test('some must work', () => {
    expect(
      collection.some(v => v === '6')
    ).toBe(true)
  })

  test('every must work', () => {
    expect(
      collection.every(v => [ '2', '4', '6' ].includes(v))
    ).toBe(true)
  })

  test('equal must work', () => {
    const collection1 = new Collection(collection),
      collection2 = new Collection()

    expect(
      collection.equal(collection1)
    ).toBe(true)

    expect(
      collection.equal(collection)
    ).toBe(true)

    expect(
      collection.equal(collection2)
    ).toBe(false)
  })

  test('find must work', () => {
    expect(
      collection.find(v => v === '6')
    ).toBe('6')

    expect(
      collection.find(v => v === '4')
    ).toBe('4')
  })

  test('findKey must work', () => {
    expect(
      collection.findKey(v => v === '6')
    ).toBe(5)
  })

  test('clone must work', () => {
    expect(
      collection.clone().equal(collection)
    ).toBe(true)
  })

  test('empty getter must work', () => {
    expect(
      collection.empty
    ).toBe(false)

    expect(
      new Collection().empty
    ).toBe(true)
  })

  test('must map values', () => {
    expect(
      collection.map(v => v)
    ).toEqual([ '2', '4', '6' ])
  })
})
