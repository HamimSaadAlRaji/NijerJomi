export enum UserRole {
  ADMIN = "ADMIN",
  REGISTRAR = "REGISTRAR",
  COURT = "COURT",
  TAX_AUTHORITY = "TAX_AUTHORITY",
  CITIZEN = "CITIZEN", // Not a real role in contract, but a useful client-side status
  NONE = "NONE",
}

export interface User {
  address: string;
  role: UserRole;
  isVerified: boolean;
}

// Data fetched from the off-chain tokenURI
export interface PropertyMetadata {
  location: string;
  area: number; // in square feet
  imageUrl: string;
}

// Combined on-chain and off-chain data for a property
export interface Property extends PropertyMetadata {
  id: number;
  ownerAddress: string;
  tokenURI: string;
  isForSale: boolean;
  hasDispute: boolean;
  marketValue: bigint;
}

export interface TransferRequest {
  id: number;
  propertyId: number;
  seller: string;
  buyer: string;
  agreedPrice: bigint;
  buyerApproved: boolean;
  sellerApproved: boolean;
  registrarApproved: boolean;
  completed: boolean;
}

export interface BribeData {
  reason: string;
  percentage: number;
}

export interface Web3State {
  isLoading: boolean;
  account: string | null;
  role: UserRole;
  provider: any | null;
  contract: any | null;
}

export interface ContractEvent {
  name: string;
  blockNumber: number;
  transactionHash: string;
  args: Record<string, any>;
}

export interface Bid {
  _id: string;
  propertyId: number;
  bidder: string;
  bidAmount: number;
  createdAt: string;
}
