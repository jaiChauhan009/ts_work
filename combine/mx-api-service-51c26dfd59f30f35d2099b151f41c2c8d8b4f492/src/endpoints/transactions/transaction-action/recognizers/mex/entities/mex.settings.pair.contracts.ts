export class MexSettingsPairContracts {
  constructor(init?: Partial<MexSettingsPairContracts>) {
    Object.assign(this, init);
  }

  rewaMex: string = '';
  rewaUsd: string = '';
}
