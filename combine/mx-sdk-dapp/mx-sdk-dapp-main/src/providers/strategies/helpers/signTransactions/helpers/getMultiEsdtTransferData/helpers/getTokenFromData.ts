import { Address } from '@terradharitri/sdk-core';
import BigNumber from 'bignumber.js';
import { TransactionTypesEnum } from 'types/enums.types';
import { decodePart } from 'utils/decoders/decodePart';
import { addressIsValid } from 'utils/validation/addressIsValid';

const noData = {
  tokenId: '',
  amount: ''
};

export const decodeData = (data: string) => {
  const nonceIndex = 2;
  const amountIndex = 3;
  const parts = data.split('@');
  const decodedParts = parts.map((part, i) =>
    [nonceIndex, amountIndex].includes(i) ? part : decodePart(part)
  );
  return decodedParts;
};

export function getTokenFromData(data?: string): {
  tokenId: string;
  amount: string;
  collection?: string;
  nonce?: string;
  receiver?: string;
} {
  if (!data) {
    return noData;
  }

  const isTokenTransfer = data.startsWith(TransactionTypesEnum.DCDTTransfer);
  const isNftTransfer =
    data.startsWith(TransactionTypesEnum.DCDTNFTTransfer) && data.includes('@');
  const isNftBurn =
    data.startsWith(TransactionTypesEnum.DCDTNFTBurn) && data.includes('@');

  if (isTokenTransfer) {
    const [, encodedToken, encodedAmount] = data.split('@');
    try {
      const tokenId = Buffer.from(encodedToken, 'hex').toString('ascii');

      if (!tokenId) {
        return noData;
      }

      const amount = new BigNumber(
        '0x' + encodedAmount.replace('0x', '')
      ).toString(10);

      return {
        tokenId,
        amount
      };
    } catch (e) {
      console.error('Error getting token from transaction data', e);
    }
  }

  if (isNftTransfer) {
    try {
      const [, /*DCDTNFTTransfer*/ collection, nonce, quantity, receiver] =
        decodeData(data);
      if (
        [collection, nonce, quantity, receiver].every((el) => Boolean(el)) &&
        addressIsValid(new Address(receiver).bech32())
      ) {
        return {
          tokenId: `${collection}-${nonce}`,
          amount: new BigNumber(quantity, 16).toString(10),
          collection,
          nonce,
          receiver: new Address(receiver).bech32()
        };
      }
    } catch (_err) {
      /* empty */
    }
  }

  if (isNftBurn) {
    try {
      const [, /*DCDTNFTBurn*/ collection, nonce, quantity] = decodeData(data);
      if ([collection, nonce, quantity].every((el) => Boolean(el))) {
        return {
          tokenId: `${collection}-${nonce}`,
          amount: new BigNumber(quantity, 16).toString(10),
          collection,
          nonce
        };
      }
    } catch (_err) {
      /* empty */
    }
  }

  return noData;
}
