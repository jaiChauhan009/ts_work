import { SwaggerUtils } from "@terradharitri/sdk-nestjs-common";
import { ApiProperty } from "@nestjs/swagger";
import { AccountAssets } from "src/common/assets/entities/account.assets";

export class TokenAccount {
  constructor(init?: Partial<TokenAccount>) {
    Object.assign(this, init);
  }

  @ApiProperty({ type: String, example: 'drt1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycq0wn4su' })
  address: string = "";

  @ApiProperty(SwaggerUtils.amountPropertyOptions())
  balance: string = "";

  @ApiProperty({ type: String, nullable: true })
  identifier: string | undefined = undefined;

  @ApiProperty({ type: String, nullable: true })
  attributes: string | undefined = undefined;

  @ApiProperty({ type: AccountAssets, nullable: true, description: 'Account assets' })
  assets: AccountAssets | undefined = undefined;
}
