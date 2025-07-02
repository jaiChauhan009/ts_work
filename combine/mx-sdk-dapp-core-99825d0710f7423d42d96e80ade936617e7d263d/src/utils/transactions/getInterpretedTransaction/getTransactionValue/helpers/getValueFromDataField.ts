import BigNumber from 'bignumber.js';
import { InterpretedTransactionType } from 'types/serverTransactions.types';
import { decodeBase64 } from 'utils/decoders';
import { getRewaValueData } from './getRewaValueData';

let warningLogged = false;

export function getValueFromDataField(transaction: InterpretedTransactionType) {
  try {
    const data = decodeBase64(transaction.data);
    const encodedValue = data.replace(`${transaction.action?.name}@`, '');
    const value = new BigNumber(encodedValue, 16);
    if (!value.isNaN()) {
      return getRewaValueData(value.toString(10));
    }
  } catch {
    if (!warningLogged) {
      console.error(
        `Unable to extract value for txHash: ${transaction.txHash}`
      );
      warningLogged = true;
    }
  }

  // fallback on transaction value
  return getRewaValueData(transaction.value);
}
