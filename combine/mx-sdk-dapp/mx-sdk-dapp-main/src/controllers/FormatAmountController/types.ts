import { FormatAmountPropsType } from 'lib/sdkDappUtils';

export interface FormatAmountControllerPropsType extends FormatAmountPropsType {
  rewaLabel?: string;
  token?: string;
}

export interface FormatedAmountType {
  isValid: boolean;
  label?: string;
  valueDecimal: string;
  valueInteger: string;
}
