export class MexSettingsFarmContracts {
  constructor(init?: Partial<MexSettingsFarmContracts>) {
    Object.assign(this, init);
  }

  rewaMex: string = '';
  rewaUsd: string = '';
  mex: string = '';
  exit: string = '';
}
