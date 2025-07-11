import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { Address, ApiNetworkProvider } from "@terradharitri/sdk-core";
import { z } from "zod";
import { USER_AGENT } from "./constants.js";
import { getApiUrl, loadNetworkFromEnv } from "./utils.js";

export async function getTokens(
  address: string,
  size?: number
): Promise<CallToolResult> {
  let addressObj: Address;

  try {
    addressObj = Address.newFromBech32(address);
  } catch {
    return {
      content: [
        {
          type: "text",
          text: "Invalid address. Please provide a bech32 address (drt1...)",
        },
      ],
    };
  }

  const network = loadNetworkFromEnv();
  const api = new ApiNetworkProvider(getApiUrl(network), {
    clientName: USER_AGENT,
  });

  const numberOfTokens = size ? size : 25;

  const dcdts = await api.doGetGeneric(
    `accounts/${addressObj.toBech32()}/tokens?size=${numberOfTokens}`
  );

  const nfts = await api.doGetGeneric(
    `accounts/${addressObj.toBech32()}/nfts?size=${numberOfTokens}`
  );

  return {
    content: [
      {
        type: "text",
        text: `Found ${
          dcdts.length + nfts.length
        } tokens:\n\nFungible tokens: ${JSON.stringify(
          dcdts,
          null,
          2
        )}\n\nNon-fungible tokens: ${JSON.stringify(nfts, null, 2)}`,
      },
    ],
  };
}

export const getTokensToolName = "get-tokens-of-address";
export const getTokensToolDescription =
  "Get the tokens of an address. Returns the first 25 fungible tokens and the first 25 NFTs, SFTs and MetaDCDT. To get more tokens, specify the number of tokens you want to get. Will return the specified number of fungible tokens and the same number of non-fungible. The returned list will contain twice the number of tokens specified, if tokens are available.";
export const getTokensParamScheme = {
  address: z.string().describe("The bech32 address of the account (drt1...)"),
  size: z
    .number()
    .optional()
    .describe(
      "The number of each token type to be returned. By default, the number is 25."
    ),
};
