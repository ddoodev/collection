export interface CollectionRandomOptions {
  /**
   * Random returns non-unique elements by default,
   * but you can request unique elements using this option.
   * Please note that this reduces performance.
   * */
  unique?: boolean
  /**
   * Random returns only value(s) by default,
   * but you can specify what to return using this option
   * */
  returnType?: 'values' | 'keys' | 'blocks'
}
