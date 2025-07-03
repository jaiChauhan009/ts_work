import LRU from 'lru-cache';
import { Injectable, Inject, Optional } from '@nestjs/common';
import { IN_MEMORY_CACHE_OPTIONS, LRU_CACHE_MAX_ITEMS } from './entities/common.constants';
import { InMemoryCacheOptions } from './entities/in-memory-cache-options.interface';

@Injectable()
export class InMemoryCacheService {
  private static localCache: LRU<any, any>;
  constructor(
    @Optional() @Inject(IN_MEMORY_CACHE_OPTIONS) private readonly inMemoryCacheOptions?: InMemoryCacheOptions
  ) {
    if (!InMemoryCacheService.localCache) {
      InMemoryCacheService.localCache = new LRU({
        max: this.inMemoryCacheOptions?.maxItems ?? LRU_CACHE_MAX_ITEMS,
        allowStale: false,
        updateAgeOnGet: false,
        updateAgeOnHas: false,
      });
    }
  }

  get<T>(
    key: string,
  ): T | undefined {
    const data = InMemoryCacheService.localCache.get(key);

    if (this.inMemoryCacheOptions?.skipItemsSerialization) {
      return data;
    }

    const parsedData = data ? data.serialized === true
      ? JSON.parse(data.value)
      : data.value : undefined;

    return parsedData;
  }

  getMany<T>(
    keys: string[],
  ): (T | undefined)[] {
    return keys.map(key => this.get<T>(key));
  }

  set<T>(
    key: string,
    value: T,
    ttl: number,
    cacheNullable: boolean = true,
  ): void {
    if (value === undefined) {
      return;
    }

    if (!cacheNullable && value == null) {
      return;
    }

    let writeValue: any = value;
    if (!this.inMemoryCacheOptions?.skipItemsSerialization) {
      writeValue = typeof value === 'object'
        ? {
          serialized: true,
          value: JSON.stringify(value),
        }
        : {
          serialized: false,
          value,
        };
    }

    const ttlToMilliseconds = ttl * 1000; // Convert to milliseconds

    if (ttlToMilliseconds > 0) { // Save only if ttl is greater than 0
      InMemoryCacheService.localCache.set(key, writeValue, {
        ttl: ttlToMilliseconds,
      });
    }
  }

  setMany<T>(
    keys: string[],
    values: T[],
    ttl: number,
    cacheNullable: boolean = true,
  ): void {
    for (const [index, key] of keys.entries()) {
      this.set(key, values[index], ttl, cacheNullable);
    }
  }

  delete(
    key: string,
  ): void {
    InMemoryCacheService.localCache.delete(key);
  }

  async getOrSet<T>(
    key: string,
    createValueFunc: () => Promise<T>,
    ttl: number,
    cacheNullable: boolean = true
  ): Promise<T> {
    const cachedData = await this.get<any>(key);
    if (cachedData !== undefined) {
      return cachedData;
    }

    const internalCreateValueFunc = this.buildInternalCreateValueFunc<T>(createValueFunc);
    const value = await internalCreateValueFunc();
    this.set<T>(key, value, ttl, cacheNullable);
    return value;
  }

  async setOrUpdate<T>(
    key: string,
    createValueFunc: () => Promise<T>,
    ttl: number,
    cacheNullable: boolean = true
  ): Promise<T> {
    const internalCreateValueFunc = this.buildInternalCreateValueFunc(createValueFunc);
    const value = await internalCreateValueFunc();
    this.set<T>(key, value, ttl, cacheNullable);
    return value;
  }

  private buildInternalCreateValueFunc<T>(
    createValueFunc: () => Promise<T>,
  ): () => Promise<T> {
    return () => {
      return createValueFunc();
    };
  }
}
