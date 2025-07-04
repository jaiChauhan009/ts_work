import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { Account } from "@terradharitri/sdk-core";
import { z } from "zod";
import {
  getEntrypoint,
  getExplorerUrl,
  loadNetworkFromEnv,
  loadPemWalletFromEnv,
} from "./utils.js";

export async function createTokens(
  tokenIdentifier: string,
  name: string,
  initialQuantity: string,
  royalties?: string
): Promise<CallToolResult> {
  const pem = loadPemWalletFromEnv();
  const account = new Account(pem.secretKey);

  const network = loadNetworkFromEnv();
  const entrypoint = getEntrypoint(network);

  account.nonce = await entrypoint.recallAccountNonce(account.address);

  const controller = entrypoint.createTokenManagementController();

  let quantity = initialQuantity ? BigInt(initialQuantity) : 1n;

  //   in case the token is MetaDCDT, we need to multiply the desired minted amount with the number of decimals
  const api = entrypoint.createNetworkProvider();
  const collection = await api.getDefinitionOfTokenCollection(tokenIdentifier);
  if (collection.type === "MetaDCDT") {
    quantity = quantity * 10n ** BigInt(collection.decimals);
  }

  tokenIdentifier = collection.collection;

  let transaction = await controller.createTransactionForCreatingNft(
    account,
    account.getNonceThenIncrement(),
    {
      tokenIdentifier: tokenIdentifier,
      initialQuantity: quantity,
      name: name,
      royalties: royalties ? Number(royalties) * 100 : 0,
      hash: "",
      attributes: new Uint8Array(),
      uris: [""],
    }
  );

  const hash = await entrypoint.sendTransaction(transaction);

  const explorer = getExplorerUrl(network);
  return {
    content: [
      {
        type: "text",
        text: `Token created for collection ${tokenIdentifier} . Check out the transaction here: ${explorer}/transactions/${hash}.`,
      },
    ],
  };
}

export const createTokensToolName = "create-sft-nft-mdcdt-tokens";
export const createTokensToolDescription = `Create a transaction to issue a semi-fungible token (SFT), or a non-fungible token (NFT), or a MetaDCDT token for a collection and send it.
Please also specify the initial quantity and the royalties.`;
export const createTokensParamScheme = {
  tokenIdentifier: z.string().describe("The identifier of the collection."),
  name: z.string().describe("The name of the token."),
  initialQuantity: z
    .string()
    .describe(
      "The initial quantity(number of tokens) that will be minted. If not provided, defaults to 1."
    ),
  royalties: z.string().optional().describe("The royalties you'll receive."),
};
