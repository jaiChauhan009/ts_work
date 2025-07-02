import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '@terradharitri/sdk-nestjs-cache';
import { Constants } from '@terradharitri/sdk-nestjs-common';
import { AuctionEntity } from 'src/db/auctions';
import { RedisKeyValueDataloaderHandler } from 'src/modules/common/redis-key-value-dataloader.handler';
import { RedisValue } from 'src/modules/common/redis-value.dto';

@Injectable()
export class AuctionsForAssetRedisHandler extends RedisKeyValueDataloaderHandler<string> {
  constructor(redisCacheService: RedisCacheService) {
    super(redisCacheService, 'default_auctions');
  }

  mapValues(returnValues: { key: string; value: any }[], auctionsIdentifiers: { [key: string]: AuctionEntity[] }) {
    const redisValues = [];
    for (const item of returnValues) {
      if (item.value === null) {
        item.value = auctionsIdentifiers[item.key] ? auctionsIdentifiers[item.key] : [];
        redisValues.push(item);
      }
    }

    return [
      new RedisValue({
        values: redisValues,
        ttl: 30 * Constants.oneSecond(),
      }),
    ];
  }
}
