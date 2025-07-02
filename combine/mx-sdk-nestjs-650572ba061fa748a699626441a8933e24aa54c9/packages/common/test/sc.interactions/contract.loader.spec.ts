import { ContractLoader } from "../../src";
import * as fs from "fs";
import { SmartContract, AbiRegistry } from "@terradharitri/sdk-core";

describe("Contract loader", () => {
  const CONTRACT_ADDRESS = "drt1qqqqqqqqqqqqqpgqkdz87p5raf5tsyv66ld8cu49nf2dqpp9d8ssvxgg25";
  const ABI_PATH: string = 'test/sc.interactions/test.abi.json';
  const CONTRACT_INTERFACE: string = 'Metabonding';
  const contractLoader: ContractLoader = new ContractLoader(ABI_PATH, CONTRACT_INTERFACE);

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('Should load metabonding contract', async () => {
    const contract: SmartContract = await contractLoader.getContract(CONTRACT_ADDRESS);

    expect(contract.getAddress().bech32()).toStrictEqual(CONTRACT_ADDRESS);
  });

  it('Should load contract from memory once', async () => {
    const cLoader = new ContractLoader(ABI_PATH, CONTRACT_INTERFACE);
    const jsonContent: string = await fs.promises.readFile(ABI_PATH, { encoding: "utf8" });
    const json = JSON.parse(jsonContent);

    const abiRegistry = AbiRegistry.create(json);

    const loadSpy = jest
      .spyOn(ContractLoader.prototype as any, 'load')
      // eslint-disable-next-line require-await
      .mockImplementation(jest.fn(async () => AbiRegistry.create(abiRegistry)));

    await cLoader.getContract(CONTRACT_ADDRESS);

    expect(loadSpy).toHaveBeenCalled();
    expect(loadSpy.mock.calls.length).toStrictEqual(1);

    await cLoader.getContract(CONTRACT_ADDRESS);
    expect(loadSpy.mock.calls.length).toStrictEqual(1);
  });

  it('Should throw error, abi path is invalid', async () => {
    const cLoader = new ContractLoader("./invalid-path", CONTRACT_INTERFACE);

    await expect(cLoader.getContract(CONTRACT_ADDRESS)).rejects.toThrow(Error);
  });

  it('should retrieve multiple contracts with same abi', async () => {
    const cLoader = new ContractLoader(ABI_PATH, CONTRACT_INTERFACE);

    const c1 = await cLoader.getContract(CONTRACT_ADDRESS);

    expect(c1.getAddress().bech32()).toStrictEqual(CONTRACT_ADDRESS);

    const c2 = await cLoader.getContract('drt1qqqqqqqqqqqqqpgq50dge6rrpcra4tp9hl57jl0893a4r2r72jpstdjq3v');
    expect(c2.getAddress().bech32()).toStrictEqual('drt1qqqqqqqqqqqqqpgq50dge6rrpcra4tp9hl57jl0893a4r2r72jpstdjq3v');
  });
});
