import {
  DevnetEntrypoint,
  MainnetEntrypoint,
  TestnetEntrypoint,
  UserPem,
} from "@terradharitri/sdk-core";
import { BigNumber } from "bignumber.js";
import * as fs from "fs";
import { REWA_NUM_DECIMALS } from "./constants.js";

const API_URLS = {
  devnet: "https://devnet-api.dharitri.org",
  testnet: "https://testnet-api.dharitri.org",
  mainnet: "https://api.dharitri.org",
};

const CLIENT_NAME = "mvx-mcp";

const ENTRYPOINTS = {
  devnet: new DevnetEntrypoint(undefined, undefined, CLIENT_NAME),
  testnet: new TestnetEntrypoint(undefined, undefined, CLIENT_NAME),
  mainnet: new MainnetEntrypoint(undefined, undefined, CLIENT_NAME),
};

const EXPLORER_URLS = {
  devnet: "https://devnet-explorer.dharitri.org",
  testnet: "https://testnet-explorer.dharitri.org",
  mainnet: "https://explorer.dharitri.org",
};

export const getApiUrl = (network: string): string => {
  if (!(network in API_URLS)) {
    throw Error(
      `Invalid network: ${network}. Allowed values: ${Object.keys(
        API_URLS
      ).join(", ")}`
    );
  }
  return API_URLS[network as keyof typeof API_URLS];
};

export const loadNetworkFromEnv = (): string => {
  const network = process.env.DRT_NETWORK;

  if (!network) {
    throw new Error("Network is not set in config file.");
  }

  return network;
};

export const loadPemWalletFromEnv = (): UserPem => {
  const walletPath = process.env.DRT_WALLET;

  if (!walletPath) {
    throw new Error("Wallet path not set in config file.");
  }

  if (!fs.existsSync(walletPath)) {
    throw new Error(`Wallet file does not exist at: ${walletPath}`);
  }

  if (fs.statSync(walletPath).isDirectory()) {
    throw new Error(
      `DRT_WALLET points to a directory, not a file: ${walletPath}`
    );
  }

  // fs.chmodSync(walletPath, 0o644);
  return UserPem.fromFile(walletPath);
};

export const getEntrypoint = (network: string) => {
  if (!(network in ENTRYPOINTS)) {
    throw Error(
      `Invalid network: ${network}. Allowed values: ${Object.keys(
        ENTRYPOINTS
      ).join(", ")}`
    );
  }
  return ENTRYPOINTS[network as keyof typeof ENTRYPOINTS];
};

export const denominateRewaValue = (value: string): bigint => {
  return denominateValueWithDecimals(value, REWA_NUM_DECIMALS);
};

export const getExplorerUrl = (network: string): string => {
  if (!(network in EXPLORER_URLS)) {
    throw Error(
      `Invalid network: ${network}. Allowed values: ${Object.keys(
        EXPLORER_URLS
      ).join(", ")}`
    );
  }
  return EXPLORER_URLS[network as keyof typeof EXPLORER_URLS];
};

export const denominateValueWithDecimals = (
  value: string,
  decimals: number
): bigint => {
  const factor = new BigNumber(10).pow(decimals);
  const denominated = new BigNumber(value).times(factor).toFixed(0);
  return BigInt(denominated);
};

export const isTokenNameValid = (name: string): boolean => {
  if (name.length < 3 || name.length > 20) {
    return false;
  }

  if (!isAlphanumeric(name)) {
    return false;
  }

  return true;
};

export const isTokenTickerValid = (ticker: string): boolean => {
  if (ticker.length < 3 || ticker.length > 10) {
    return false;
  }
  return true;
};

function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}
