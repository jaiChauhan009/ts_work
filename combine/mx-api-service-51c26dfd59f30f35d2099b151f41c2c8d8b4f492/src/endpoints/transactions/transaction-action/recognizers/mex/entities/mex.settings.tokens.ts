export class MexSettingsToken {
  constructor(init?: Partial<MexSettingsToken>) {
    Object.assign(this, init);
  }

  wrewa: string = '';
  mex: string = '';
  busd: string = '';
  rewaMex: string = '';
  rewaUsd: string = '';

  mexFarm: string = '';
  rewaMexFarm: string = '';
  rewaUsdFarm: string = '';
}
