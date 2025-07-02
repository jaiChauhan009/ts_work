import BigNumber from 'bignumber.js';
import { EGLD_IDENTIFIER } from 'constants/general';
import { DcdtType, UserDcdtType } from 'types';

export const getSortedTokensByUsdValue = ({
  tokens,
  wrappedEgld
}: {
  tokens: UserDcdtType[];
  wrappedEgld?: DcdtType;
}) => {
  return tokens.sort((dcdt1, dcdt2) => {
    if (dcdt1.identifier === EGLD_IDENTIFIER) return -1;
    if (dcdt2.identifier === EGLD_IDENTIFIER) return 1;
    if (dcdt1.identifier === wrappedEgld?.identifier) return -1;
    if (dcdt2.identifier === wrappedEgld?.identifier) return 1;
    return new BigNumber(dcdt2.valueUSD).minus(dcdt1.valueUSD).toNumber();
  });
};
