import { Collection } from '@src/Collection'

/*
* Copyright 2015 - 2021 Amish Shah
*
* Licensed under the Apache License, Version 2.0 (the "License");
* http://www.apache.org/licenses/LICENSE-2.0
* http://github.com/discordjs/collection/blob/main/LICENSE
* http://github.com/discordjs/collection/blob/d0e4d766004cb31792ad7c0d66c9888f13027ce4/src/index.ts#L1
* */

/**
 * Collection constructor typings
 * */
export interface CollectionConstructor {
  new <K = any, V = any>(entries?: ReadonlyArray<readonly [K, V]> | null): Collection<K, V>
  new <K = any, V = any>(iterable: Iterable<readonly [K, V]>): Collection<K, V>
  readonly prototype: Collection
  readonly [Symbol.species]: CollectionConstructor
}
