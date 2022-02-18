import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService<T> {
  private cache: Map<string, T>;

  constructor() {
    this.cache = new Map<string, T>();
  }

  get(key: string): T {
    return this.cache.get(key);
  }

  getAll(): T[] {
    return Array.from(this.cache.values());
  }

  set(key: string, value: T): void {
    this.cache = this.cache.set(key, value);
  }

  delete(key: string) {
    this.cache.delete(key);
  }
}
