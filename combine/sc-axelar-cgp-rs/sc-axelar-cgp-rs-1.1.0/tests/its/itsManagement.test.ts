import { afterEach, assert, beforeEach, describe, test } from 'vitest';
import { assertAccount, e, Encodable, LSWallet, LSWorld } from 'xsuite';
import {
  ADDRESS_ZERO,
  CHAIN_NAME,
  INTERCHAIN_TOKEN_ID,
  MESSAGE_ID,
  OTHER_CHAIN_ADDRESS,
  OTHER_CHAIN_NAME,
  OTHER_CHAIN_TOKEN_ADDRESS,
  TOKEN_IDENTIFIER,
  TOKEN_IDENTIFIER2,
  TOKEN_MANAGER_ADDRESS,
  TOKEN_MANAGER_ADDRESS_2,
  TOKEN_SALT,
  TOKEN_SALT2,
} from '../helpers';
import {
  baseItsKvs,
  computeLinkedTokenId,
  deployContracts,
  gasService,
  gateway,
  its,
  ITS_HUB_ADDRESS,
  TOKEN_MANAGER_TYPE_LOCK_UNLOCK,
  tokenManager,
} from '../itsHelpers';

let world: LSWorld;
let deployer: LSWallet;
let collector: LSWallet;
let user: LSWallet;
let otherUser: LSWallet;

beforeEach(async () => {
  world = await LSWorld.start();
  await world.setCurrentBlockInfo({
    nonce: 0,
    epoch: 0,
  });

  collector = await world.createWallet();
  deployer = await world.createWallet({
    balance: 10_000_000_000n,
    kvs: [
      e.kvs.Dcdts([
        {
          id: TOKEN_IDENTIFIER,
          amount: 100_000,
        },
        {
          id: TOKEN_IDENTIFIER2,
          amount: 10_000,
        },
      ]),
    ],
  });
  user = await world.createWallet({
    balance: BigInt('10000000000000000'),
    kvs: [
      e.kvs.Dcdts([
        {
          id: TOKEN_IDENTIFIER,
          amount: 100_000,
        },
        {
          id: TOKEN_IDENTIFIER2,
          amount: 10_000,
        },
      ]),
    ],
  });
  otherUser = await world.createWallet({
    balance: BigInt('10000000000000000'),
  });
});

afterEach(async () => {
  await world.terminate();
});

test(
  'Init errors',
  async () => {
    await deployContracts(deployer, collector, false);

    for (let i = 0; i < 4; i++) {
      const codeArgs: Encodable[] = [
        gateway,
        gasService,
        tokenManager,
        deployer,
        e.Str(CHAIN_NAME),
        e.Str(ITS_HUB_ADDRESS),

        e.U32(1),
        e.Str(OTHER_CHAIN_NAME),
      ];

      codeArgs[i] = e.Addr(ADDRESS_ZERO);

      await deployer
        .deployContract({
          code: 'file:interchain-token-service/output/interchain-token-service.wasm',
          codeMetadata: ['upgradeable'],
          gasLimit: 100_000_000,
          codeArgs,
        })
        .assertFail({ code: 4, message: 'Zero address' });
    }

    await deployer
      .deployContract({
        code: 'file:interchain-token-service/output/interchain-token-service.wasm',
        codeMetadata: ['upgradeable'],
        gasLimit: 100_000_000,
        codeArgs: [
          gateway,
          gasService,
          tokenManager,
          deployer,
          e.Str(''),
          e.Str(ITS_HUB_ADDRESS),

          e.U32(1),
          e.Str(OTHER_CHAIN_NAME),
        ],
      })
      .assertFail({ code: 4, message: 'Invalid chain name' });

    await deployer
      .deployContract({
        code: 'file:interchain-token-service/output/interchain-token-service.wasm',
        codeMetadata: ['upgradeable'],
        gasLimit: 100_000_000,
        codeArgs: [
          gateway,
          gasService,
          tokenManager,
          deployer,
          e.Str(CHAIN_NAME),
          e.Str(''),

          e.U32(1),
          e.Str(OTHER_CHAIN_NAME),
        ],
      })
      .assertFail({ code: 4, message: 'Invalid its hub address' });

    await deployer
      .deployContract({
        code: 'file:interchain-token-service/output/interchain-token-service.wasm',
        codeMetadata: ['upgradeable'],
        gasLimit: 100_000_000,
        codeArgs: [
          gateway,
          gasService,
          tokenManager,
          deployer,
          e.Str(CHAIN_NAME),
          e.Str(ITS_HUB_ADDRESS),

          e.U32(1),
          e.Str(''),
        ],
      })
      .assertFail({ code: 4, message: 'Zero string length' });
  },
  { timeout: 30_000 }
);

describe('Operatorship', () => {
  test('Transfer', async () => {
    await deployContracts(deployer, collector);

    await user
      .callContract({
        callee: its,
        funcName: 'transferOperatorship',
        gasLimit: 10_000_000,
        funcArgs: [user],
      })
      .assertFail({ code: 4, message: 'Missing any of roles' });

    await deployer.callContract({
      callee: its,
      funcName: 'transferOperatorship',
      gasLimit: 10_000_000,
      funcArgs: [user],
    });

    let kvs = await its.getAccount();
    assertAccount(kvs, {
      balance: 0n,
      kvs: [...baseItsKvs(user)],
    });

    // Check that operator was changed
    await user.callContract({
      callee: its,
      funcName: 'transferOperatorship',
      gasLimit: 10_000_000,
      funcArgs: [user],
    });
  });

  test('Propose', async () => {
    await deployContracts(deployer, collector);

    await user
      .callContract({
        callee: its,
        funcName: 'proposeOperatorship',
        gasLimit: 10_000_000,
        funcArgs: [user],
      })
      .assertFail({ code: 4, message: 'Missing any of roles' });

    await deployer.callContract({
      callee: its,
      funcName: 'proposeOperatorship',
      gasLimit: 10_000_000,
      funcArgs: [user],
    });

    let kvs = await its.getAccount();
    assertAccount(kvs, {
      balance: 0n,
      kvs: [...baseItsKvs(deployer), e.kvs.Mapper('proposed_roles', deployer, user).Value(e.U32(0b00000010))],
    });

    // Proposed operator can not call this function
    await user
      .callContract({
        callee: its,
        funcName: 'proposeOperatorship',
        gasLimit: 10_000_000,
        funcArgs: [user],
      })
      .assertFail({ code: 4, message: 'Missing any of roles' });

    // If called multiple times, multiple entries are added
    await deployer.callContract({
      callee: its,
      funcName: 'proposeOperatorship',
      gasLimit: 10_000_000,
      funcArgs: [otherUser],
    });

    kvs = await its.getAccount();
    assertAccount(kvs, {
      balance: 0n,
      kvs: [
        ...baseItsKvs(deployer),

        e.kvs.Mapper('proposed_roles', deployer, user).Value(e.U32(0b00000010)),
        e.kvs.Mapper('proposed_roles', deployer, otherUser).Value(e.U32(0b00000010)),
      ],
    });
  });

  test('Accept', async () => {
    await deployContracts(deployer, collector);

    await user
      .callContract({
        callee: its,
        funcName: 'acceptOperatorship',
        gasLimit: 10_000_000,
        funcArgs: [deployer],
      })
      .assertFail({ code: 4, message: 'Invalid proposed roles' });

    await deployer.callContract({
      callee: its,
      funcName: 'proposeOperatorship',
      gasLimit: 10_000_000,
      funcArgs: [user],
    });

    // Propose other
    await deployer.callContract({
      callee: its,
      funcName: 'proposeOperatorship',
      gasLimit: 10_000_000,
      funcArgs: [otherUser],
    });

    await deployer
      .callContract({
        callee: its,
        funcName: 'acceptOperatorship',
        gasLimit: 10_000_000,
        funcArgs: [user],
      })
      .assertFail({ code: 4, message: 'Invalid proposed roles' });

    await user.callContract({
      callee: its,
      funcName: 'acceptOperatorship',
      gasLimit: 10_000_000,
      funcArgs: [deployer],
    });

    let kvs = await its.getAccount();
    assertAccount(kvs, {
      balance: 0n,
      kvs: [...baseItsKvs(user), e.kvs.Mapper('proposed_roles', deployer, otherUser).Value(e.U32(0b00000010))],
    });

    // otherUser can no longer accept because user doesn't have operator role anymore
    await otherUser
      .callContract({
        callee: its,
        funcName: 'acceptOperatorship',
        gasLimit: 10_000_000,
        funcArgs: [deployer],
      })
      .assertFail({ code: 4, message: 'Missing all roles' });
  });
});

describe('Pause unpause', () => {
  test('Pause', async () => {
    await deployContracts(deployer, collector);

    await user
      .callContract({
        callee: its,
        funcName: 'pause',
        gasLimit: 10_000_000,
        funcArgs: [],
      })
      .assertFail({ code: 4, message: 'Endpoint can only be called by owner' });

    await deployer.callContract({
      callee: its,
      funcName: 'pause',
      gasLimit: 10_000_000,
      funcArgs: [],
    });

    const kvs = await its.getAccount();
    assertAccount(kvs, {
      balance: 0n,
      kvs: [...baseItsKvs(deployer), e.kvs.Mapper('pause_module:paused').Value(e.Bool(true))],
    });

    await user
      .callContract({
        callee: its,
        funcName: 'registerCustomToken',
        gasLimit: 20_000_000,
        funcArgs: [
          e.TopBuffer(TOKEN_SALT),
          e.Str(TOKEN_IDENTIFIER2),
          e.U8(TOKEN_MANAGER_TYPE_LOCK_UNLOCK),
          e.Addr(ADDRESS_ZERO),
        ],
      })
      .assertFail({ code: 4, message: 'Contract is paused' });

    await user
      .callContract({
        callee: its,
        funcName: 'linkToken',
        gasLimit: 20_000_000,
        funcArgs: [
          e.TopBuffer(TOKEN_SALT),
          e.Str(OTHER_CHAIN_NAME),
          e.Str(OTHER_CHAIN_TOKEN_ADDRESS),
          e.U8(TOKEN_MANAGER_TYPE_LOCK_UNLOCK),
          e.Buffer(''),
        ],
      })
      .assertFail({ code: 4, message: 'Contract is paused' });

    await user
      .callContract({
        callee: its,
        funcName: 'deployInterchainToken',
        gasLimit: 100_000_000,
        value: 0,
        funcArgs: [
          e.TopBuffer(TOKEN_SALT),
          e.Str('Token Name'),
          e.Str('TOKEN-SYMBOL'),
          e.U8(18),
          e.U(0),
          e.TopBuffer(user.toTopU8A()), // minter
        ],
      })
      .assertFail({ code: 4, message: 'Contract is paused' });

    await user
      .callContract({
        callee: its,
        funcName: 'interchainTransfer',
        gasLimit: 20_000_000,
        funcArgs: [
          e.TopBuffer(INTERCHAIN_TOKEN_ID),
          e.Str(OTHER_CHAIN_NAME),
          e.Str(OTHER_CHAIN_ADDRESS),
          e.Buffer(''),
          e.U(0),
        ],
      })
      .assertFail({ code: 4, message: 'Contract is paused' });

    await user
      .callContract({
        callee: its,
        funcName: 'execute',
        gasLimit: 50_000_000,
        funcArgs: [e.Str(OTHER_CHAIN_NAME), e.Str(MESSAGE_ID), e.Str(OTHER_CHAIN_ADDRESS), e.Buffer('')],
      })
      .assertFail({ code: 4, message: 'Contract is paused' });
  });

  test('Unpause', async () => {
    await deployContracts(deployer, collector);

    // Mock paused
    await its.setAccount({
      ...(await its.getAccount()),
      kvs: [...baseItsKvs(deployer), e.kvs.Mapper('pause_module:paused').Value(e.Bool(true))],
    });

    await user
      .callContract({
        callee: its,
        funcName: 'unpause',
        gasLimit: 10_000_000,
        funcArgs: [],
      })
      .assertFail({ code: 4, message: 'Endpoint can only be called by owner' });

    await deployer.callContract({
      callee: its,
      funcName: 'unpause',
      gasLimit: 10_000_000,
      funcArgs: [],
    });

    const kvs = await its.getAccount();
    assertAccount(kvs, {
      balance: 0n,
      kvs: [...baseItsKvs(deployer), e.kvs.Mapper('pause_module:paused').Value(e.Bool(false))],
    });

    // Call works
    await user.callContract({
      callee: its,
      funcName: 'registerCustomToken',
      gasLimit: 20_000_000,
      funcArgs: [e.TopBuffer(TOKEN_SALT), e.Str(TOKEN_IDENTIFIER2), e.U8(TOKEN_MANAGER_TYPE_LOCK_UNLOCK), e.Addr(ADDRESS_ZERO)],
    });
  });
});

describe('Address tracker', () => {
  test('Set trusted chain', async () => {
    await deployContracts(deployer, collector);

    const someChainName = 'SomeChain';

    await user
      .callContract({
        callee: its,
        funcName: 'setTrustedChain',
        gasLimit: 10_000_000,
        funcArgs: [e.Str(someChainName)],
      })
      .assertFail({ code: 4, message: 'Endpoint can only be called by owner' });

    await deployer
      .callContract({
        callee: its,
        funcName: 'setTrustedChain',
        gasLimit: 10_000_000,
        funcArgs: [e.Str('')],
      })
      .assertFail({ code: 4, message: 'Zero string length' });

    await deployer.callContract({
      callee: its,
      funcName: 'setTrustedChain',
      gasLimit: 10_000_000,
      funcArgs: [e.Str(someChainName)],
    });

    const kvs = await its.getAccount();
    assertAccount(kvs, {
      balance: 0n,
      kvs: [
        ...baseItsKvs(deployer),

        e.kvs.Mapper('trusted_chains').UnorderedSet([e.Str(OTHER_CHAIN_NAME), e.Str(someChainName)]),
      ],
    });
  });

  test('Remove trusted chain', async () => {
    await deployContracts(deployer, collector);

    await user
      .callContract({
        callee: its,
        funcName: 'removeTrustedChain',
        gasLimit: 10_000_000,
        funcArgs: [e.Str(OTHER_CHAIN_NAME)],
      })
      .assertFail({ code: 4, message: 'Endpoint can only be called by owner' });

    await deployer
      .callContract({
        callee: its,
        funcName: 'removeTrustedChain',
        gasLimit: 10_000_000,
        funcArgs: [e.Str('')],
      })
      .assertFail({ code: 4, message: 'Zero string length' });

    await deployer.callContract({
      callee: its,
      funcName: 'removeTrustedChain',
      gasLimit: 10_000_000,
      funcArgs: [e.Str(OTHER_CHAIN_NAME)],
    });

    const kvs = await its.getAccount();
    assertAccount(kvs, {
      balance: 0n,
      kvs: [
        ...baseItsKvs(deployer),

        e.kvs.Mapper('chain_name').Value(e.Str(CHAIN_NAME)),

        // OTHER_CHAIN_NAME was deleted
        e.kvs.Mapper('trusted_chains').UnorderedSet([]),
        e.kvs.Mapper('trusted_chains.index', e.Str(OTHER_CHAIN_NAME)).Value(e.Str('')),
        e.kvs.Mapper('trusted_chains.item', e.U32(1)).Value(e.Str('')),
      ],
    });
  });

  test('Address tracker storage mapper views', async () => {
    await deployContracts(deployer, collector);

    let result = await world.query({
      callee: its,
      funcName: 'chainName',
      funcArgs: [],
    });

    assert(result.returnData[0] === e.Str(CHAIN_NAME).toTopHex());

    result = await world.query({
      callee: its,
      funcName: 'trustedChains',
      funcArgs: [],
    });

    assert(result.returnData[0] === e.Str(OTHER_CHAIN_NAME).toTopHex());

    result = await world.query({
      callee: its,
      funcName: 'itsHubAddress',
      funcArgs: [],
    });

    assert(result.returnData[0] === e.Str(ITS_HUB_ADDRESS).toTopHex());
  });
});

describe('Set flow limits', () => {
  test('Set', async () => {
    await deployContracts(deployer, collector);

    await user.callContract({
      callee: its,
      funcName: 'registerCustomToken',
      gasLimit: 20_000_000,
      funcArgs: [e.TopBuffer(TOKEN_SALT), e.Str(TOKEN_IDENTIFIER), e.U8(TOKEN_MANAGER_TYPE_LOCK_UNLOCK), e.Addr(ADDRESS_ZERO)],
    });

    await user.callContract({
      callee: its,
      funcName: 'registerCustomToken',
      gasLimit: 20_000_000,
      funcArgs: [
        e.TopBuffer(TOKEN_SALT2),
        e.Str(TOKEN_IDENTIFIER2),
        e.U8(TOKEN_MANAGER_TYPE_LOCK_UNLOCK),
        e.Addr(ADDRESS_ZERO),
      ],
    });

    const computedTokenId = computeLinkedTokenId(user);
    const computedTokenId2 = computeLinkedTokenId(user, TOKEN_SALT2);

    await deployer.callContract({
      callee: its,
      funcName: 'setFlowLimits',
      gasLimit: 20_000_000,
      funcArgs: [
        e.U32(2),
        e.TopBuffer(computedTokenId),
        e.TopBuffer(computedTokenId2),
        e.U32(2),
        e.Option(e.U(99)),
        e.Option(e.U(100)),
      ],
    });

    let tokenManager = await world.newContract(TOKEN_MANAGER_ADDRESS);
    let tokenManagerKvs = await tokenManager.getAccount();
    assertAccount(tokenManagerKvs, {
      balance: 0n,
      kvs: [
        e.kvs.Mapper('interchain_token_service').Value(its),
        e.kvs.Mapper('implementation_type').Value(e.U8(TOKEN_MANAGER_TYPE_LOCK_UNLOCK)),
        e.kvs.Mapper('interchain_token_id').Value(e.TopBuffer(computedTokenId)),
        e.kvs.Mapper('token_identifier').Value(e.Str(TOKEN_IDENTIFIER)),
        e.kvs.Mapper('account_roles', e.Addr(ADDRESS_ZERO)).Value(e.U32(0b00000110)), // flow limit & operator roles
        e.kvs.Mapper('account_roles', its).Value(e.U32(0b00000110)),

        e.kvs.Mapper('flow_limit').Value(e.Option(e.U(99))),
      ],
    });

    tokenManager = await world.newContract(TOKEN_MANAGER_ADDRESS_2);
    tokenManagerKvs = await tokenManager.getAccount();
    assertAccount(tokenManagerKvs, {
      balance: 0n,
      kvs: [
        e.kvs.Mapper('interchain_token_service').Value(its),
        e.kvs.Mapper('implementation_type').Value(e.U8(TOKEN_MANAGER_TYPE_LOCK_UNLOCK)),
        e.kvs.Mapper('interchain_token_id').Value(e.TopBuffer(computedTokenId2)),
        e.kvs.Mapper('token_identifier').Value(e.Str(TOKEN_IDENTIFIER2)),
        e.kvs.Mapper('account_roles', e.Addr(ADDRESS_ZERO)).Value(e.U32(0b00000110)), // flow limit & operator roles
        e.kvs.Mapper('account_roles', its).Value(e.U32(0b00000110)),

        e.kvs.Mapper('flow_limit').Value(e.Option(e.U(100))),
      ],
    });
  });

  test('Errors', async () => {
    await deployContracts(deployer, collector);

    const computedTokenId = computeLinkedTokenId(user);

    await user
      .callContract({
        callee: its,
        funcName: 'setFlowLimits',
        gasLimit: 20_000_000,
        funcArgs: [e.U32(1), e.TopBuffer(computedTokenId), e.U32(1), e.Option(e.U(99))],
      })
      .assertFail({ code: 4, message: 'Missing any of roles' });

    await deployer
      .callContract({
        callee: its,
        funcName: 'setFlowLimits',
        gasLimit: 20_000_000,
        funcArgs: [e.U32(1), e.TopBuffer(computedTokenId), e.U32(2), e.Option(e.U(99)), e.Option(e.U(100))],
      })
      .assertFail({ code: 4, message: 'Length mismatch' });

    await deployer
      .callContract({
        callee: its,
        funcName: 'setFlowLimits',
        gasLimit: 20_000_000,
        funcArgs: [e.U32(1), e.TopBuffer(computedTokenId), e.U32(1), e.Option(e.U(100))],
      })
      .assertFail({ code: 4, message: 'Token manager does not exist' });

    await user.callContract({
      callee: its,
      funcName: 'registerCustomToken',
      gasLimit: 20_000_000,
      funcArgs: [
        e.TopBuffer(TOKEN_SALT),
        e.Str(TOKEN_IDENTIFIER),
        e.U8(TOKEN_MANAGER_TYPE_LOCK_UNLOCK),
        e.Buffer(user.toTopU8A()),
      ],
    });

    // Remove its as flow limiter for token manager
    let tokenManager = world.newContract(TOKEN_MANAGER_ADDRESS);
    await user.callContract({
      callee: tokenManager,
      funcName: 'removeFlowLimiter',
      gasLimit: 5_000_000,
      funcArgs: [its],
    });

    // ITS not flow limiter of token manager
    await deployer
      .callContract({
        callee: its,
        funcName: 'setFlowLimits',
        gasLimit: 20_000_000,
        funcArgs: [e.U32(1), e.TopBuffer(computedTokenId), e.U32(1), e.Option(e.U(100))],
      })
      .assertFail({ code: 10, message: 'error signalled by smartcontract' });
  });
});
