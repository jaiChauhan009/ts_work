import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  createTokens,
  createTokensParamScheme,
  createTokensToolDescription,
  createTokensToolName,
} from "./tools/createTokens.js";
import {
  createWallet,
  createWalletToolDescription,
  createWalletToolName,
} from "./tools/createWallet.js";
import {
  getAddress,
  getAddressToolDescription,
  getAddressToolName,
} from "./tools/getAddress.js";
import {
  getBalance,
  getBalanceParamScheme,
  getBalanceToolDescription,
  getBalanceToolName,
} from "./tools/getBalance.js";
import {
  getNetwork,
  getNetworkToolDescription,
  getNetworkToolName,
} from "./tools/getNetwork.js";
import {
  getTokens,
  getTokensParamScheme,
  getTokensToolDescription,
  getTokensToolName,
} from "./tools/getTokens.js";
import {
  issueFungible,
  issueFungibleParamScheme,
  issueFungibleToolDescription,
  issueFungibleToolName,
} from "./tools/issueFungible.js";
import {
  issueMetaDcdtCollection,
  issueMetaDcdtCollectionParamScheme,
  issueMetaDcdtCollectionToolDescription,
  issueMetaDcdtCollectionToolName,
} from "./tools/issueMetaDcdtCollection.js";
import {
  issueNftCollection,
  issueNftCollectionParamScheme,
  issueNftCollectionToolDescription,
  issueNftCollectionToolName,
} from "./tools/issueNftCollection.js";
import {
  issueSemiFungibleCollection,
  issueSemiFungibleCollectionParamScheme,
  issueSemiFungibleCollectionToolDescription,
  issueSemiFungibleCollectionToolName,
} from "./tools/issueSemiFungibleCollection.js";
import {
  sendRewa,
  sendRewaParamScheme,
  sendRewaToolDescription,
  sendRewaToolName,
} from "./tools/sendRewa.js";
import {
  sendRewaToMultipleReceivers,
  sendRewaToMultipleReceiversParamScheme,
  sendRewaToMultipleReceiversToolDescription,
  sendRewaToMultipleReceiversToolName,
} from "./tools/sendRewaToMultipleReceivers.js";
import {
  sendFungible,
  sendFungibleParamScheme,
  sendFungibleToolDescription,
  sendFungibleToolName,
} from "./tools/sendFungible.js";
import {
  sendTokens,
  sendTokensParamScheme,
  sendTokensToolDescription,
  sendTokensToolName,
} from "./tools/sendTokens.js";

const server = new McpServer({
  name: "dharitri-mcp",
  version: "1.0.0",
});

server.tool(
  getBalanceToolName,
  getBalanceToolDescription,
  getBalanceParamScheme,
  ({ address }) => getBalance(address)
);

server.tool(getAddressToolName, getAddressToolDescription, getAddress);

server.tool(createWalletToolName, createWalletToolDescription, createWallet);

server.tool(
  sendRewaToolName,
  sendRewaToolDescription,
  sendRewaParamScheme,
  ({ amount, receiver }) => sendRewa(amount, receiver)
);

server.tool(
  sendFungibleToolName,
  sendFungibleToolDescription,
  sendFungibleParamScheme,
  ({ token, amount, receiver }) => sendFungible(token, amount, receiver)
);

server.tool(
  sendTokensToolName,
  sendTokensToolDescription,
  sendTokensParamScheme,
  ({ token, amount, receiver }) => sendTokens(receiver, token, amount)
);

server.tool(
  issueFungibleToolName,
  issueFungibleToolDescription,
  issueFungibleParamScheme,
  ({ tokenName, tokenTicker, initialSupply, numDecimals }) =>
    issueFungible(tokenName, tokenTicker, initialSupply, numDecimals)
);

server.tool(
  issueSemiFungibleCollectionToolName,
  issueSemiFungibleCollectionToolDescription,
  issueSemiFungibleCollectionParamScheme,
  ({ tokenName, tokenTicker }) =>
    issueSemiFungibleCollection(tokenName, tokenTicker)
);

server.tool(
  issueNftCollectionToolName,
  issueNftCollectionToolDescription,
  issueNftCollectionParamScheme,
  ({ tokenName, tokenTicker }) => issueNftCollection(tokenName, tokenTicker)
);

server.tool(
  issueMetaDcdtCollectionToolName,
  issueMetaDcdtCollectionToolDescription,
  issueMetaDcdtCollectionParamScheme,
  ({ tokenName, tokenTicker, numDecimals }) =>
    issueMetaDcdtCollection(tokenName, tokenTicker, numDecimals)
);

server.tool(
  createTokensToolName,
  createTokensToolDescription,
  createTokensParamScheme,
  ({ tokenIdentifier, name, initialQuantity, royalties }) =>
    createTokens(tokenIdentifier, name, initialQuantity, royalties)
);

server.tool(
  getTokensToolName,
  getTokensToolDescription,
  getTokensParamScheme,
  ({ address, size }) => getTokens(address, size)
);

server.tool(
  sendRewaToMultipleReceiversToolName,
  sendRewaToMultipleReceiversToolDescription,
  sendRewaToMultipleReceiversParamScheme,
  ({ amount, receivers }) => sendRewaToMultipleReceivers(amount, receivers)
);

server.tool(getNetworkToolName, getNetworkToolDescription, getNetwork);

export { server };
