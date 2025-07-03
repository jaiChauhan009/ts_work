import { BytesValue, TokenIdentifierValue } from '@terradharitri/sdk-core';

import { BrandInfo } from './BrandInfoAbi';
import { TierInfoAbi } from './TierInfoAbi';

export interface BrandInfoViewResultType {
  brand_id: BytesValue;
  nft_token_id: TokenIdentifierValue;
  brand_info: BrandInfo;
  tier_info_entries: Array<TierInfoAbi>;
}
