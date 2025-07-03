export class GatewayNft {
  constructor(init?: Partial<GatewayNft>) {
    Object.assign(this, init);
  }

  attributes: string = '';
  balance: string = '0';
  creator: string = '';
  hash: string = '';
  name: string = '';
  nonce: number = 0;
  royalties: string = '0';
  tokenIdentifier: string = '';
  uris: string[] = [];
  timestamp?: number;
}
