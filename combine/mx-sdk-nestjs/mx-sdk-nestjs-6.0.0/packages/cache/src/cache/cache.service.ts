import asyncPool from 'tiny-async-pool';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { OriginLogger, BatchUtils, PendingExecuter } from '@terradharitri/sdk-nestjs-common';
import '@terradharitri/sdk-nestjs-common/lib/utils/extensions/array.extensions';
import { InMemoryCacheService } from '../in-memory-cache/in-memory-cache.service';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { CachingModuleOptions } from '../entities/caching.module.options';
import { ADDITIONAL_CACHING_OPTIONS } from '../entities/common';

@Injectable()
export class CacheService {
  private readonly pendingExecuter: PendingExecuter;
  private readonly logger = new OriginLogger(CacheService.name);

  constructor(
    @Optional() @Inject(ADDITIONAL_CACHING_OPTIONS) private readonly options: CachingModuleOptions,
    private readonly inMemoryCacheService: InMemoryCacheService,
    private readonly redisCacheService: RedisCacheService,
  ) {
    this.pendingExecuter = new PendingExecuter();
  }

  getLocal<T>(
    key: string,
  ): T | undefined {
    return this.inMemoryCacheService.get<T>(key);
  }

  getManyLocal<T>(
    keys: string[],
  ): (T | undefined)[] {
    return this.inMemoryCacheService.getMany<T>(keys);
  }

  setLocal<T>(
    key: string,
    value: T,
    ttl: number,
    cacheNullable: boolean = true,
  ): void {
    return this.inMemoryCacheService.set<T>(key, value, ttl, cacheNullable);
  }

  setManyLocal<T>(
    keys: string[],
    values: T[],
    ttl: number,
    cacheNullable: boolean = true,
  ): void {
    return this.inMemoryCacheService.setMany(keys, values, ttl, cacheNullable);
  }

  deleteLocal(
    key: string,
  ): void {
    return this.inMemoryCacheService.delete(key);
  }

  deleteManyLocal(
    keys: string[],
  ): void {
    keys.map(key => this.inMemoryCacheService.delete(key));
  }

  getOrSetLocal<T>(
    key: string,
    createValueFunc: () => Promise<T>,
    ttl: number,
    cacheNullable: boolean = true,
  ): Promise<T> {
    return this.inMemoryCacheService.getOrSet<T>(
      key,
      () => {
        return this.executeWithPendingPromise(key, createValueFunc);
      },
      ttl,
      cacheNullable
    );
  }

  setOrUpdateLocal<T>(
    key: string,
    createValueFunc: () => Promise<T>,
    ttl: number,
    cacheNullable: boolean = true,
  ): Promise<T> {
    return this.inMemoryCacheService.setOrUpdate<T>(key, createValueFunc, ttl, cacheNullable);
  }

  getRemote<T>(
    key: string,
  ): Promise<T | undefined> {
    return this.redisCacheService.get<T>(key);
  }

  getManyRemote<T>(
    keys: string[]
  ): Promise<(T | undefined | null)[]> {
    return this.redisCacheService.getMany(keys);
  }

  setRemote<T>(
    key: string,
    value: T,
    ttl: number | null = null,
    cacheNullable: boolean = true,
  ): Promise<void> {
    return this.redisCacheService.set<T>(key, value, ttl, cacheNullable);
  }

  async setManyRemote<T>(
    keys: string[],
    values: T[],
    ttl: number,
    cacheNullable: boolean = true,
  ): Promise<void> {
    await this.redisCacheService.setMany(keys, values, ttl, cacheNullable);
  }

  setTtlRemote(
    key: string,
    ttl: number,
  ): Promise<void> {
    return this.redisCacheService.expire(key, ttl);
  }

  deleteRemote(
    key: string,
  ): Promise<void> {
    return this.redisCacheService.delete(key);
  }

  deleteManyRemote(
    keys: string[],
  ): Promise<void> {
    return this.redisCacheService.deleteMany(keys);
  }

  flushDbRemote(): Promise<void> {
    return this.redisCacheService.flushDb();
  }

  getKeys(key: string): Promise<string[]> {
    return this.redisCacheService.keys(key);
  }

  getOrSetRemote<T>(
    key: string,
    createValueFunc: () => Promise<T>,
    ttl: number,
    cacheNullable: boolean = true,
  ): Promise<T> {
    return this.redisCacheService.getOrSet<T>(
      key,
      () => {
        return this.executeWithPendingPromise(key, createValueFunc);
      },
      ttl,
      cacheNullable,
    );
  }

  setOrUpdateRemote<T>(
    key: string,
    createValueFunc: () => Promise<T>,
    ttl: number,
    cacheNullable: boolean = true,
  ): Promise<T> {
    return this.redisCacheService.setOrUpdate<T>(key, createValueFunc, ttl, cacheNullable);
  }

  incrementRemote(
    key: string,
    ttl: number | null = null,
  ): Promise<number> {
    return this.redisCacheService.increment(key, ttl);
  }

  zIncrementRemote(
    key: string,
    increment: number,
    member: string
  ): Promise<string> {
    return this.redisCacheService.zincrby(key, member, increment);
  }

  zRangeRemote(
    key: string,
    from: number,
    to: number,
  ): Promise<string[]> {
    return this.redisCacheService.zrange(key, from, to, { withScores: true });
  }

  zRangeByScoreRemote(
    key: string,
    from: number,
    to: number,
  ): Promise<string[]> {
    return this.redisCacheService.zrangebyscore(key, from, to, { withScores: true });
  }

  decrementRemote(
    key: string,
    ttl: number | null = null,
  ): Promise<number> {
    return this.redisCacheService.decrement(key, ttl);
  }

  async get<T>(
    key: string,
  ): Promise<T | undefined> {
    const inMemoryCacheValue = this.inMemoryCacheService.get<T>(key);
    if (inMemoryCacheValue) {
      return inMemoryCacheValue;
    }

    return await this.redisCacheService.get<T>(key);
  }

  async getMany<T>(
    keys: string[],
  ): Promise<(T | undefined)[]> {
    const values = this.getManyLocal<T>(keys);

    const missingIndexes: number[] = [];
    values.forEach((value, index) => {
      if (!value) {
        missingIndexes.push(index);
      }
    });

    const missingKeys: string[] = [];
    for (const missingIndex of missingIndexes) {
      missingKeys.push(keys[missingIndex]);
    }

    const remoteValues = await this.getManyRemote<T>(missingKeys);

    for (const [index, missingIndex] of missingIndexes.entries()) {
      const remoteValue = remoteValues[index];
      values[missingIndex] = remoteValue ? remoteValue : undefined;
    }

    return values;
  }

  async set<T>(
    key: string,
    value: T,
    ttl: number,
    inMemoryTtl: number = ttl,
    cacheNullable: boolean = true,
  ): Promise<void> {
    const setInMemoryCachePromise = this.inMemoryCacheService.set<T>(key, value, inMemoryTtl, cacheNullable);
    const setRedisCachePromise = this.redisCacheService.set<T>(key, value, ttl, cacheNullable);

    await Promise.all([setInMemoryCachePromise, setRedisCachePromise]);
  }

  async setMany<T>(
    keys: string[],
    values: T[],
    ttl: number,
    cacheNullable: boolean = true,
  ): Promise<void> {
    await Promise.all([
      this.setManyRemote(keys, values, ttl, cacheNullable),
      this.setManyLocal(keys, values, ttl, cacheNullable),
    ]);
  }

  async delete(
    key: string,
  ): Promise<void> {
    const deleteRemotePromise = this.redisCacheService.delete(key);
    this.inMemoryCacheService.delete(key);
    await deleteRemotePromise;
  }

  async deleteMany(
    keys: string[],
  ): Promise<void> {
    const deleteManyRemotePromise = this.deleteManyRemote(keys);
    this.deleteManyLocal(keys);
    await deleteManyRemotePromise;
  }

  async getOrSet<T>(
    key: string,
    createValueFunc: () => Promise<T>,
    ttl: number,
    inMemoryTtl: number = ttl,
    cacheNullable: boolean = true
  ): Promise<T> {
    const internalCreateValueFunc = this.buildInternalCreateValueFunc<T>(key, createValueFunc);
    const getOrAddFromRedisFunc = async (): Promise<T> => {
      return await this.redisCacheService.getOrSet<T>(key, internalCreateValueFunc, ttl, cacheNullable);
    };

    return await this.inMemoryCacheService.getOrSet<T>(key, getOrAddFromRedisFunc, inMemoryTtl, cacheNullable);
  }

  async setOrUpdate<T>(
    key: string,
    createValueFunc: () => Promise<T>,
    ttl: number,
    inMemoryTtl: number = ttl,
    cacheNullable: boolean = true,
  ): Promise<T> {
    const internalCreateValueFunc = this.buildInternalCreateValueFunc<T>(key, createValueFunc);
    const value = await internalCreateValueFunc();
    if (value !== undefined) {
      await this.set<T>(key, value, ttl, inMemoryTtl, cacheNullable);
    }
    return value;
  }

  async refreshLocal<T>(key: string, ttl: number = this.getCacheTtl()): Promise<T | undefined> {
    const value = await this.getRemote<T>(key);
    if (value) {
      this.setLocal<T>(key, value, ttl);
    } else {
      this.logger.log(`Deleting local cache key '${key}'`);
      this.deleteLocal(key);
    }

    return value;
  }

  async batchGetManyRemote<T>(keys: string[]): Promise<(T | undefined | null)[]> {
    const chunks = BatchUtils.splitArrayIntoChunks(keys, 100);

    const result = [];

    for (const chunkKeys of chunks) {

      const chunkValues = await this.redisCacheService.getMany<T>(chunkKeys);
      result.push(...chunkValues);
    }

    return result;
  }

  async batchProcess<IN, OUT>(payload: IN[], cacheKeyFunction: (element: IN) => string, handler: (generator: IN) => Promise<OUT>, ttl: number = this.getCacheTtl(), skipCache: boolean = false): Promise<OUT[]> {
    const result: OUT[] = [];

    const chunks = BatchUtils.splitArrayIntoChunks(payload, 100);

    for (const [_, chunk] of chunks.entries()) {
      // this.logger.log(`Loading ${index + 1} / ${chunks.length} chunks`);

      let retries = 0;
      while (true) {
        try {
          const processedChunk = await this.batchProcessChunk(chunk, cacheKeyFunction, handler, ttl, skipCache);
          result.push(...processedChunk);
          break;
        } catch (error) {
          this.logger.error(error);
          this.logger.log(`Retries: ${retries}`);
          retries++;
          if (retries >= 3) {
            throw error;
          }
        }
      }
    }

    return result;
  }

  async batchProcessChunk<IN, OUT>(payload: IN[], cacheKeyFunction: (element: IN) => string, handler: (generator: IN) => Promise<OUT>, ttl: number = this.getCacheTtl(), skipCache: boolean = false): Promise<OUT[]> {
    const keys = payload.map(element => cacheKeyFunction(element));

    let cached: OUT[] = [];
    if (skipCache) {
      cached = new Array(keys.length).fill(null);
    } else {
      cached = await this.batchGetManyRemote(keys) as OUT[];
    }

    const missing = cached
      .map((element, index) => (element === null ? index : false))
      .filter((element) => element !== false)
      .map(element => element as number);

    let values: OUT[] = [];

    if (missing.length) {
      values = await asyncPool(
        this.options?.poolLimit || 100,
        missing.map((index) => payload[index]),
        handler
      );

      const params = {
        keys: keys.filter((_, index) => missing.includes(index)),
        values,
        ttls: values.map((value) => (value ? ttl : Math.min(ttl, this.options?.processTtl))),
      };

      await this.batchSet(params.keys, params.values, params.ttls);
    }

    return keys.map((_, index) =>
      missing.includes(index) ? values[missing.indexOf(index)] : cached[index]
    );
  }

  async batchGet<TIN, TOUT>(
    elements: TIN[],
    cacheKeyFunc: (element: TIN) => string,
    getter: (elements: TIN[]) => Promise<{ [key: string]: TOUT; }>,
    ttl: number,
    chunkSize: number = 100,
  ): Promise<{ [key: string]: TOUT; }> {
    return await BatchUtils.batchGet<TIN, TOUT>(
      elements,
      cacheKeyFunc,
      [
        {
          // eslint-disable-next-line require-await
          getter: async elements => {
            const result: { [key: string]: TOUT; } = {};

            for (const element of elements) {
              const key = cacheKeyFunc(element);
              const value = this.getLocal<TOUT>(key);
              if (value !== undefined) {
                result[key] = value;
              }
            }

            return result;
          },
          // eslint-disable-next-line require-await
          setter: async elements => {
            for (const key of Object.keys(elements)) {
              this.setLocal(key, elements[key], ttl);
            }
          },
        },
        {
          getter: async elements => {
            const result: { [key: string]: TOUT; } = {};
            const keys = elements.map(element => cacheKeyFunc(element));

            const getResults = await this.batchGetManyRemote<TOUT>(keys);

            for (const [index, element] of elements.entries()) {
              if (getResults[index] !== null) {
                result[cacheKeyFunc(element)] = getResults[index] as TOUT;
              }
            }

            return result;
          },
          setter: async elements => {
            const keys = Object.keys(elements);
            const values = Object.values(elements);
            const ttls = values.map(() => this.spreadTtl(ttl));

            await this.batchSet(keys, values, ttls);
          },
        },
        {
          getter,
        },
      ],
      chunkSize,
    );
  }

  async setAddRemote(key: string, ...values: string[]): Promise<void> {
    await this.redisCacheService.sadd(key, ...values);
  }

  async setCountRemote(key: string): Promise<number> {
    return await this.redisCacheService.scard(key);
  }

  async hashGetRemote<T>(hash: string, field: string): Promise<T | null> {
    return await this.redisCacheService.hget<T>(hash, field);
  }

  async hashGetAllRemote(hash: string): Promise<Record<string, any> | null> {
    return await this.redisCacheService.hgetall(hash);
  }

  async hashSetRemote<T>(
    hash: string,
    field: string,
    value: T,
    cacheNullable: boolean = true,
  ): Promise<number> {
    return await this.redisCacheService.hset<T>(hash, field, value, cacheNullable);
  }

  async hashSetManyRemote(
    hash: string,
    fieldsValues: [string, any][],
    cacheNullable: boolean = true,
  ): Promise<number> {
    return await this.redisCacheService.hsetMany(hash, fieldsValues, cacheNullable);
  }

  async hashIncrementRemote(
    hash: string,
    field: string,
    increment: number | string,
  ): Promise<number> {
    return await this.redisCacheService.hincrby(hash, field, increment);
  }

  async hashKeysRemote(hash: string): Promise<string[]> {
    return await this.redisCacheService.hkeys(hash);
  }

  async batchSet(keys: string[], values: any[], ttls: number[], setLocalCache: boolean = true, spreadTtl: boolean = true) {
    if (!ttls) {
      ttls = new Array(keys.length).fill(this.getCacheTtl());
    }

    if (spreadTtl) {
      ttls = ttls.map(ttl => this.spreadTtl(ttl));
    }

    if (setLocalCache) {
      for (const [index, key] of keys.entries()) {
        const value = values[index];
        const ttl = ttls[index];

        this.setLocal(key, value, ttl);
      }
    }

    const chunks = BatchUtils.splitArrayIntoChunks(
      keys.map((key, index) => {
        const element: any = {};
        element[key] = index;
        return element;
      }),
      25,
    );

    const sets = [];

    for (const chunk of chunks) {
      const chunkKeys = chunk.map((element: any) => Object.keys(element)[0]);
      const chunkValues = chunk.map((element: any) => values[Object.values(element)[0] as number]);

      sets.push(
        ...chunkKeys.map((key: string, index: number) => {
          return ['set', key, JSON.stringify(chunkValues[index]), 'ex', ttls[index]];
        })
      );
    }
    await this.redisCacheService.asyncMulti(sets);
  }

  async batchApplyAll<TIN, TOUT>(
    elements: TIN[],
    cacheKeyFunc: (element: TIN) => string,
    getter: (element: TIN) => Promise<TOUT>,
    setter: (element: TIN, value: TOUT, fromGetter: boolean) => void,
    ttl: number,
    chunkSize: number = 100,
  ): Promise<void> {
    await this.batchApply(
      elements,
      cacheKeyFunc,
      elements => elements.toRecordAsync(element => cacheKeyFunc(element), element => getter(element)),
      setter,
      ttl,
      chunkSize,
    );
  }

  async batchApply<TIN, TOUT>(
    elements: TIN[],
    cacheKeyFunc: (element: TIN) => string,
    getter: (elements: TIN[]) => Promise<{ [key: string]: TOUT; }>,
    setter: (element: TIN, value: TOUT, fromGetter: boolean) => void,
    ttl: number,
    chunkSize: number = 100,
  ): Promise<void> {
    const keysFromGetter = new Set<string>();

    const batchGetResult = await this.batchGet(
      elements,
      cacheKeyFunc,
      async (elements: TIN[]) => {
        const results = await getter(elements);
        for (const key of Object.keys(results)) {
          keysFromGetter.add(key);
        }

        return results;
      },
      ttl,
      chunkSize,
    );

    const indexedElements: { [key: string]: TIN; } = {};
    for (const element of elements) {
      indexedElements[cacheKeyFunc(element)] = element;
    }

    for (const key of Object.keys(batchGetResult)) {
      const value = batchGetResult[key];
      if (value === undefined) {
        continue;
      }

      const element = indexedElements[key];
      if (element === undefined) {
        continue;
      }

      setter(element, value, keysFromGetter.has(key));
    }
  }

  async batchGetAll<TIN, TOUT>(
    elements: TIN[],
    cacheKeyFunc: (element: TIN) => string,
    getter: (element: TIN) => Promise<TOUT>,
    ttl: number,
    chunkSize: number = 100,
  ): Promise<{ [key: string]: TOUT; }> {
    return await this.batchGet(
      elements,
      cacheKeyFunc,
      elements => elements.toRecordAsync(element => cacheKeyFunc(element), element => getter(element)),
      ttl,
      chunkSize,
    );
  }

  private spreadTtl(ttl: number): number {
    const threshold = 300; // seconds after which to start spreading ttls
    const spread = 10; // percent ttls spread

    if (ttl >= threshold) {
      const sign = Math.round(Math.random()) * 2 - 1;
      const amount = Math.floor(Math.random() * ((ttl * spread) / 100));

      ttl = ttl + sign * amount;
    }

    return ttl;
  }

  async batchDelCache(keys: string[]) {
    for (const key of keys) {
      this.deleteLocal(key);
    }

    const dels = keys.map(key => ['del', key]);
    await this.redisCacheService.asyncMulti(dels);
  }

  private executeWithPendingPromise<T>(
    key: string,
    promise: () => Promise<T>,
  ): Promise<T> {
    return this.pendingExecuter.execute(key, promise);
  }

  private buildInternalCreateValueFunc<T>(
    key: string,
    createValueFunc: () => Promise<T>,
  ): () => Promise<T> {
    return async () => {
      try {
        const data = await this.executeWithPendingPromise(key, createValueFunc);
        return data;
      } catch (error) {
        if (error instanceof Error) {
          this.logger.error('Caching - An error occurred while trying to load value.', {
            error: error?.toString(),
            key,
          });
        }
        throw error;
      }
    };
  }

  async deleteInCache(key: string): Promise<string[]> {
    const invalidatedKeys = [];

    if (key.includes('*')) {
      const allKeys = await this.getKeys(key);
      for (const key of allKeys) {

        const deleteRemotePromise = this.redisCacheService.delete(key);
        this.deleteLocal(key);
        await deleteRemotePromise;

        invalidatedKeys.push(key);
      }
    } else {
      const deleteRemotePromise = this.redisCacheService.delete(key);
      this.deleteLocal(key);
      invalidatedKeys.push(key);

      await deleteRemotePromise;
    }

    return invalidatedKeys;
  }

  private getCacheTtl(): number {
    return 6;
  }
}
