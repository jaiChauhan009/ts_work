import { EGLD_IDENTIFIER } from 'constants/general';
import { DECIMALS } from 'lib';
import { DcdtType, PairType } from 'types';

export const getTokenDecimals = ({
  pairs,
  identifier
}: {
  pairs: PairType[];
  identifier: string;
}) => {
  const isEgld =
    identifier === EGLD_IDENTIFIER ||
    identifier.startsWith(`W${EGLD_IDENTIFIER}-`);

  if (isEgld) {
    return DECIMALS;
  }

  let token: DcdtType | undefined;
  pairs.forEach(({ firstToken, secondToken }) => {
    if (firstToken.identifier === identifier) {
      token = firstToken;
      return;
    }

    if (secondToken.identifier === identifier) {
      token = secondToken;
      return;
    }
  });

  return token?.decimals ?? 0;
};
