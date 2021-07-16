import { Collection } from '@src/Collection'

describe('Collection', () => {
  const collection = new Collection()
  collection.set(1, '2').set(3, '4').set(5, '6')

  test('should contain 3 elements', () => {
    expect(
      collection.size
    ).toBe(3)
  }, 1000)

  test('should filter values and return collection', () => {
    expect(
      collection.filter<Collection>(value => value === '4', { return: 'collection' }).size
    ).toBe(1)
  })

  test('should filter values and return array', () => {
    expect(
      collection.filter<Array<any>>(value => value === '4', { return: 'array' }).length
    ).toBe(1)
  })

  test('should filter values and return array without any options', () => {
    expect(
      collection.filter<Array<any>>(value => value === '4' || value === '6' || value === '2').length
    ).toBe(3)
  })

  test('should return 1 random value', () => {
    expect(
      typeof collection.random()
    ).toBe('string')
  })

  test('should return 1 random value with 0 amount specified', () => {
    expect(
      typeof collection.random(0)
    ).toBe('string')
  })

  test('should return 1 random key', () => {
    expect(
      typeof collection.random(undefined, { returnType: 'keys' })
    ).toBe('number')
  })

  test('should return 1 random block', () => {
    expect(
      Array.isArray(collection.random(undefined, { returnType: 'blocks' }))
    ).toBe(true)
  })

  test('should return 2 random values', () => {
    expect(
      collection.random(2).filter(v => typeof v === 'string').length
    ).toBe(2)
  })

  test('should return 2 random values with option', () => {
    expect(
      collection.random(2, { returnType: 'values' }).filter(v => typeof v === 'string').length
    ).toBe(2)
  })

  test('should return 2 random keys', () => {
    expect(
      collection.random(2, { returnType: 'keys' }).filter(k => typeof k === 'number').length
    ).toBe(2)
  })

  test('should return 2 random blocks', () => {
    expect(
      collection
        .random(2, { returnType: 'blocks' })
        .filter(b => Array.isArray(b) && typeof b[0] === 'number' && typeof b[1] === 'string').length
    ).toBe(2)
  })

  test('should return 2 random unique values', () => {
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

  test('should return 2 random unique keys', () => {
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

  test('should return 2 random unique blocks', () => {
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
})
