import { SwaggerUtils } from "@terradharitri/sdk-nestjs-common";
import { ApiProperty } from "@nestjs/swagger";

export class WaitingList {
  constructor(init?: Partial<WaitingList>) {
    Object.assign(this, init);
  }

  @ApiProperty({ type: String, example: 'drt1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycq0wn4su' })
  address: string = '';

  @ApiProperty({ type: Number, example: 46 })
  nonce: number = 0;

  @ApiProperty({ type: Number, example: 2 })
  rank: number = 0;

  @ApiProperty(SwaggerUtils.amountPropertyOptions())
  value: string = '';
}
