import { DCDTTransferTypesEnum, TypesOfSmartContractCallsEnum } from 'types';
import { isStringBase64 } from 'utils/decoders/base64Utils';
import { addressIsValid } from './addressIsValid';
import { Address } from 'lib/sdkCore';

export function isContract(
  receiver: string,
  sender?: string,
  data = ''
): boolean {
  const isValid = addressIsValid(receiver);

  if (!isValid) {
    return false;
  }

  const isContractAddress = new Address(receiver).isContractAddress();

  if (isContractAddress) {
    return true;
  }

  const extractedAddress = getAddressFromDataField({ receiver, data });

  if (!extractedAddress) {
    return false;
  }

  const isExtractedAddressContractCall = new Address(
    extractedAddress
  ).isSmartContract();

  return (
    isExtractedAddressContractCall || isSelfDCDTContract(receiver, sender, data)
  );
}

const isHexValidCharacters = (str: string) => {
  return str.toLowerCase().match(/[0-9a-f]/g);
};
const isHexValidLength = (str: string) => {
  return str.length % 2 === 0;
};

export function isSelfDCDTContract(
  receiver: string,
  sender?: string,
  data?: string
) {
  const parts = data?.split('@');
  if (parts == null) {
    return false;
  }
  const [type, ...restParts] = parts;
  const isSelfTransaction =
    sender != null && receiver != null && receiver === sender;
  const isCorrectDCDTType = Object.values(DCDTTransferTypesEnum).includes(
    type as DCDTTransferTypesEnum
  );
  const areDataPartsValid = restParts.every(
    (part) => isHexValidCharacters(part) && isHexValidLength(part)
  );
  return isSelfTransaction && isCorrectDCDTType && areDataPartsValid;
}

export function getAddressFromDataField({
  receiver,
  data
}: {
  receiver: string;
  data: string;
}) {
  try {
    if (!data) {
      return receiver;
    }
    const parsedData = isStringBase64(data)
      ? Buffer.from(data, 'base64').toString()
      : data;

    const addressIndex = getAddressIndex(parsedData);

    const parts = parsedData.split('@');
    return addressIndex > -1 ? parts[addressIndex] : receiver;
  } catch (err) {
    console.log(err);
    return;
  }
}

function getAddressIndex(data: string) {
  if (data.includes(TypesOfSmartContractCallsEnum.MultiDCDTNFTTransfer)) {
    return 1;
  }
  if (data.includes(TypesOfSmartContractCallsEnum.DCDTNFTTransfer)) {
    return 4;
  }
  return -1;
}
