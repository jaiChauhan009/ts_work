// Code generated by the dharitri-sc build system. DO NOT EDIT.

////////////////////////////////////////////////////
////////////////// AUTO-GENERATED //////////////////
////////////////////////////////////////////////////

// Init:                                 1
// Upgrade:                              1
// Endpoints:                           32
// Async Callback:                       1
// Total number of exported functions:  35

#![no_std]

dharitri_sc_wasm_adapter::allocator!();
dharitri_sc_wasm_adapter::panic_handler!();

dharitri_sc_wasm_adapter::endpoints! {
    token_manager
    (
        init => init
        upgrade => upgrade
        addFlowLimiter => add_flow_limiter
        removeFlowLimiter => remove_flow_limiter
        transferFlowLimiter => transfer_flow_limiter
        setFlowLimit => set_flow_limit
        giveToken => give_token
        takeToken => take_token
        donateTokens => donate_tokens
        deployInterchainToken => deploy_interchain_token
        mint => mint
        burn => burn
        getImplementationTypeAndTokenIdentifier => get_implementation_type_and_token_identifier
        isFlowLimiter => is_flow_limiter
        params => params
        optTokenIdentifier => get_opt_token_identifier
        interchainTokenService => interchain_token_service
        implementationType => implementation_type
        interchainTokenId => interchain_token_id
        tokenIdentifier => token_identifier
        flowOutAmount => get_flow_out_amount
        flowInAmount => get_flow_in_amount
        getFlowLimit => flow_limit
        transferOperatorship => transfer_operatorship
        proposeOperatorship => propose_operatorship
        acceptOperatorship => accept_operatorship
        isOperator => is_operator
        getAccountRoles => account_roles
        getProposedRoles => proposed_roles
        transferMintership => transfer_mintership
        proposeMintership => propose_mintership
        acceptMintership => accept_mintership
        isMinter => is_minter
        getMinterAddress => minter_address
    )
}

dharitri_sc_wasm_adapter::async_callback! { token_manager }
