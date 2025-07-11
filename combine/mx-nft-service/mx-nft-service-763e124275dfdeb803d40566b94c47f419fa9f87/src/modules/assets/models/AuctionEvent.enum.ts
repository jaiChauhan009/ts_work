export enum AuctionEventEnum {
  AuctionTokenEvent = 'auctionToken',
  EndAuctionEvent = 'endAuction',
  BidEvent = 'bid',
  BuySftEvent = 'buySft',
  WithdrawEvent = 'withdraw',
  WithdrawOffer = 'withdrawOffer',
  AcceptOffer = 'acceptOffer',
  SendOffer = 'sendOffer',
  WithdrawAuctionAndAcceptOffer = 'withdrawAuctionAndAcceptOffer',
  Withdraw_event = 'withdraw_event',
  Accept_offer_token_event = 'accept_offer_token_event',
}

export enum ExternalAuctionEventEnum {
  Listing = 'listing',
  ListNftOnMarketplace = 'listNftOnMarketplace',
  Buy = 'buy',
  BuyNft = 'buyNft',
  BuyFor = 'buyFor',
  BulkBuy = 'bulkBuy',
  ChangePrice = 'changePrice',
  UpdatePrice = 'updatePrice',
  UpdateListing = 'changeListing',
  ReturnListing = 'returnListing',
  AcceptOffer = 'acceptOffer',
  AcceptOfferFromAuction = 'acceptOfferFromAuction',
  UpdateOffer = 'update_offer_event',
  AcceptGlobalOffer = 'acceptGlobalOffer',
  ClaimBackNft = 'claimBackNft',
  EndTokenEvent = 'end_auction_event',
  UserDeposit = 'user_deposit',
}

export enum KroganSwapAuctionEventEnum {
  NftSwap = 'nftSwap',
  WithdrawSwap = 'withdrawSwap',
  NftSwapUpdate = 'nftSwapUpdate',
  NftSwapExtend = 'nftSwapExtend',
  Purchase = 'purchase',
  Bid = 'bid',
  UpdateListing = 'update_listing',
}

export enum NftEventEnum {
  DCDTNFTAddQuantity = 'DCDTNFTAddQuantity',
  DCDTNFTTransfer = 'DCDTNFTTransfer',
  MultiDCDTNFTTransfer = 'MultiDCDTNFTTransfer',
  DCDTNFTCreate = 'DCDTNFTCreate',
  DCDTNFTBurn = 'DCDTNFTBurn',
  DCDTNFTUpdateAttributes = 'DCDTNFTUpdateAttributes',
  DCDTMetaDataUpdate = 'DCDTMetaDataUpdate',
  DCDTMetaDataRecreate = 'DCDTMetaDataRecreate',
  DCDTModifyCreator = 'DCDTModifyCreator',
}

export enum NftEventTypeEnum {
  NftEventEnum = 'NftEventEnum',
  AuctionEventEnum = 'AuctionEventEnum',
  ExternalAuctionEventEnum = 'ExternalAuctionEventEnum',
  NumbatNftsSwapAuctionEventEnum = 'NumbatNftsSwapAuctionEventEnum',
}

export enum MinterEventEnum {
  brandCreated = 'brandCreated',
  callBack = 'callBack',
  buyRandomNft = 'buyRandomNft',
  nftGiveaway = 'nftGiveaway',
}

export enum CollectionEventEnum {
  IssueSemiFungible = 'issueSemiFungible',
  IssueNonFungible = 'issueNonFungible',
}

export enum MarketplaceEventEnum {
  SCUpgrade = 'SCUpgrade',
}
