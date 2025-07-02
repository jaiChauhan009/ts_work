import { Field, InputType } from '@nestjs/graphql';
import { mxConfig } from 'src/config';

@InputType()
export class TokenFilter {
  @Field(() => String)
  token: string = mxConfig.rewa;
  constructor(init?: Partial<TokenFilter>) {
    Object.assign(this, init);
  }
}
