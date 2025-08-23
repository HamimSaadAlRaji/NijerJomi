import { ethers } from "ethers";
import {
  Property,
  PropertyMetadata,
  TransferRequest,
  UserRole,
  ContractEvent,
} from "../../types";

// Helper to fetch and parse JSON from a URI (like IPFS)
// const fetchMetadata = async (tokenURI: string): Promise<PropertyMetadata | null> => {
//     // A real app would use a dedicated IPFS gateway or client.
//     // For demonstration, we'll assume the URI is a direct link or can be resolved.
//     // This basic resolver handles common IPFS gateway links.
//     const url = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
//     try {
//         const response = await fetch(url);
//         console.log(`Fetching metadata from ${url}`);
//         if (!response.ok) {
//             throw new Error(`Failed to fetch metadata from ${url}`);
//         }
//         const data = await response.json();
//         // Basic validation
//         if (data.location && data.area && data.imageUrl) {
//             return data as PropertyMetadata;
//         }
//         return null;
//     } catch (error) {
//         console.error("Error fetching metadata:", error);
//         return null;
//     }
// };

function resolveIpfsUrl(ipfsUrl: string): string {
  if (!ipfsUrl) return "";
  if (ipfsUrl.startsWith("ipfs://")) {
    return ipfsUrl.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  }
  return ipfsUrl;
}

const fetchMetadata = async (
  tokenURI: string
): Promise<PropertyMetadata | null> => {
  const url = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
  console.log(`Fetching metadata from: ${url}`);
  try {
    console.log("Fetching metadata from:", url);
    const response = await fetch(url);
    const text = await response.text();
    console.log("Fetched raw metadata:", text);

    const data = JSON.parse(text);
    if (data.name && data.description && data.image) {
      return data;
    } else {
      console.warn("Incomplete metadata structure", data);
    }
    return data;
  } catch (err) {
    console.error("Metadata fetch error:", err);
    return null;
  }
};

// === READ METHODS ===

// export const getPropertyData = async (contract: ethers.Contract, propertyId: number): Promise<Property | null> => {
//     try {
//         const onChainData = await contract.properties(propertyId);
//         const tokenURI = await contract.tokenURI(propertyId);

//         // ** CRITICAL FIX **: Use ownerOf as the source of truth for ownership, not the properties struct.
//         // The struct's owner is not updated on _transfer. ownerOf() is always correct for ERC721.
//         const ownerAddress = await contract.ownerOf(propertyId);

//         const [id, _structOwner, isForSale, hasDispute, marketValue] = onChainData;

//         const metadata = await fetchMetadata(tokenURI);

//         if (!metadata) {
//             console.error(`Could not fetch metadata for property ${propertyId}`);
//             // Return with defaults if metadata fails
//             return {
//                 id: Number(id),
//                 ownerAddress, // Use the correct owner from ownerOf
//                 tokenURI,
//                 isForSale,
//                 hasDispute,
//                 marketValue,
//                 location: "Metadata not found",
//                 area: 0,
//                 imageUrl: "https://placehold.co/800x600?text=No+Image"
//             };
//         }

//         return {
//             id: Number(id),
//             ownerAddress, // Use the correct owner from ownerOf
//             tokenURI,
//             isForSale,
//             hasDispute,
//             marketValue,
//             ...metadata
//         };
//     } catch (error) {
//         console.error(`Error fetching data for property ${propertyId}:`, error);
//         return null;
//     }
// }

export const getPropertyData = async (
  contract: ethers.Contract,
  propertyId: number
): Promise<Property | null> => {
  try {
    const onChainData = await contract.properties(propertyId);
    const tokenURI = await contract.tokenURI(propertyId);
    const ownerAddress = await contract.ownerOf(propertyId);
    console.log(tokenURI);

    const [id, _structOwner, isForSale, hasDispute, marketValue] = onChainData;

    let metadata: PropertyMetadata | null = null;
    try {
      metadata = await fetchMetadata(tokenURI);
      console.log(
        "Fetched metadata:",
        metadata.location,
        metadata.area,
        metadata.imageUrl
      );
    } catch (e) {
      console.warn(`Metadata fetch error for tokenURI: ${tokenURI}`, e);
    }

    // Fallback values for missing metadata
    const location = metadata?.location || "Unknown Location";
    const area = metadata?.area ?? 0;
    let imageUrl = metadata?.imageUrl;

    //Fallback image if not provided or invalid
    if (!imageUrl || imageUrl.trim() === "") {
      imageUrl =
        "https://gateway.pinata.cloud/ipfs/bafkreierbmgzqa4h7hpcdsyxjvcjromsamqbffj4z2zwv2dyjk3ttaubcu";
    }

    return {
      id: Number(id),
      ownerAddress,
      tokenURI,
      isForSale,
      hasDispute,
      marketValue,
      location,
      area,
      imageUrl,
    };
  } catch (error) {
    console.error(`Error fetching data for property ${propertyId}:`, error);
    return null;
  }
};

export const getAllProperties = async (
  contract: ethers.Contract
): Promise<Property[]> => {
  try {
    const nextId = await contract.nextPropertyId();
    const properties: Property[] = [];
    // Property IDs start from 0
    for (let i = 0; i < Number(nextId); i++) {
      const prop = await getPropertyData(contract, i);
      if (prop) {
        properties.push(prop);
      }
    }
    return properties;
  } catch (error) {
    console.error("Error fetching all properties:", error);
    return [];
  }
};

interface PropertyFilters {
  isForSale?: boolean;
  hasDispute?: boolean;
}

export const getProperties = async (
  contract: ethers.Contract,
  filters: PropertyFilters
): Promise<Property[]> => {
  let properties = await getAllProperties(contract);

  if (filters.isForSale !== undefined) {
    properties = properties.filter((p) => p.isForSale === filters.isForSale);
  }
  if (filters.hasDispute !== undefined) {
    properties = properties.filter((p) => p.hasDispute === filters.hasDispute);
  }

  return properties;
};

export const getPropertiesByOwner = async (
  contract: ethers.Contract,
  ownerAddress: string
): Promise<Property[]> => {
  try {
    const nextId = await contract.nextPropertyId();
    const userProperties: Property[] = [];

    // Check each property to see if user owns it
    for (let i = 0; i < Number(nextId); i++) {
      try {
        const currentOwner = await contract.ownerOf(i);
        if (currentOwner.toLowerCase() === ownerAddress.toLowerCase()) {
          const property = await getPropertyData(contract, i);
          if (property) {
            userProperties.push(property);
          }
        }
      } catch (error) {
        // Property might not exist, continue to next
        console.warn(`Property ${i} not found or error:`, error);
        continue;
      }
    }
    return userProperties;
  } catch (error) {
    console.error("Error fetching user properties:", error);
    return [];
  }
};

export const getAllTransferRequests = async (
  contract: ethers.Contract
): Promise<TransferRequest[]> => {
  try {
    const nextId = await contract.nextTransferId();
    const requests: TransferRequest[] = [];
    for (let i = 0; i < Number(nextId); i++) {
      const reqData = await contract.transferRequests(i);
      // Check if it's a valid request (not empty/initial state)
      if (reqData.seller !== ethers.ZeroAddress) {
        requests.push({
          id: i,
          propertyId: Number(reqData.propertyId),
          seller: reqData.seller,
          buyer: reqData.buyer,
          agreedPrice: reqData.agreedPrice,
          buyerApproved: reqData.buyerApproved,
          sellerApproved: reqData.sellerApproved,
          registrarApproved: reqData.registrarApproved,
          completed: reqData.completed,
        });
      }
    }
    return requests;
  } catch (error) {
    console.error("Error fetching all transfer requests:", error);
    return [];
  }
};

export const getTransferRequest = async (
  contract: ethers.Contract,
  transferId: number
): Promise<TransferRequest | null> => {
  try {
    const reqData = await contract.transferRequests(transferId);
    if (reqData.seller !== ethers.ZeroAddress) {
      return {
        id: transferId,
        propertyId: Number(reqData.propertyId),
        seller: reqData.seller,
        buyer: reqData.buyer,
        agreedPrice: reqData.agreedPrice,
        buyerApproved: reqData.buyerApproved,
        sellerApproved: reqData.sellerApproved,
        registrarApproved: reqData.registrarApproved,
        completed: reqData.completed,
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching transfer request ${transferId}:`, error);
    return null;
  }
};

export const getContractEvents = async (
  contract: ethers.Contract
): Promise<ContractEvent[]> => {
  try {
    const eventNames = [
      "PropertyRegistered",
      "OwnershipTransferred",
      "TransferRequested",
      "TransferApproved",
      "DisputeReported",
    ];
    const eventFilters = eventNames.map((name) => contract.filters[name]());

    let allEvents: ContractEvent[] = [];

    for (const filter of eventFilters) {
      const logs = await contract.queryFilter(filter, 0, "latest");
      const parsedLogs = logs
        .map((log) => {
          const parsed = contract.interface.parseLog(log);
          if (!parsed) return null;
          return {
            name: parsed.name,
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
            args: Object.fromEntries(
              Object.entries(parsed.args).map(([key, value]) => [
                key,
                value.toString(),
              ])
            ),
          };
        })
        .filter(Boolean) as ContractEvent[];
      allEvents = [...allEvents, ...parsedLogs];
    }

    // Sort all events chronologically by block number
    allEvents.sort((a, b) => b.blockNumber - a.blockNumber);

    return allEvents;
  } catch (error) {
    console.error("Error fetching contract events:", error);
    return [];
  }
};

// === WRITE METHODS (execute transactions) ===

export const registerProperty = async (
  contract: ethers.Contract,
  owner: string,
  tokenURI: string,
  marketValue: string
) => {
  const tx = await contract.registerProperty(
    owner,
    tokenURI,
    ethers.parseEther(marketValue)
  );
  await tx.wait(); // Wait for transaction to be mined
};

export const setForSale = async (
  contract: ethers.Contract,
  propertyId: number,
  forSale: boolean
) => {
  const tx = await contract.setForSale(propertyId, forSale);
  await tx.wait();
};

export const requestTransfer = async (
  contract: ethers.Contract,
  propertyId: number,
  buyer: string,
  agreedPrice: bigint
) => {
  // The contract logic doesn't require sending value here, the transfer struct holds the price.
  // If the contract required payment upfront, you would add { value: agreedPrice }
  const tx = await contract.requestTransfer(propertyId, buyer, agreedPrice);
  await tx.wait();
};

export const approveTransferAsBuyer = async (
  contract: ethers.Contract,
  transferId: number
) => {
  const tx = await contract.approveTransferAsBuyer(transferId);
  await tx.wait();
};

export const approveTransferAsRegistrar = async (
  contract: ethers.Contract,
  transferId: number
) => {
  const tx = await contract.approveTransferAsRegistrar(transferId);
  await tx.wait();
};

export const reportDispute = async (
  contract: ethers.Contract,
  propertyId: number
) => {
  const tx = await contract.reportDispute(propertyId);
  await tx.wait();
};

export const resolveDispute = async (
  contract: ethers.Contract,
  propertyId: number,
  resolved: boolean
) => {
  const tx = await contract.resolveDispute(propertyId, resolved);
  await tx.wait();
};

export const markTaxPaid = async (
  contract: ethers.Contract,
  propertyId: number
) => {
  const tx = await contract.markTaxPaid(propertyId);
  await tx.wait();
};

export const verifyUser = async (
  contract: ethers.Contract,
  userAddress: string
) => {
  const tx = await contract.verifyUser(userAddress);
  await tx.wait();
};

export const setRole = async (
  contract: ethers.Contract,
  userAddress: string,
  roleName: UserRole
) => {
  const roleMap = {
    [UserRole.REGISTRAR]: await contract.REGISTRAR_ROLE(),
    [UserRole.COURT]: await contract.COURT_ROLE(),
    [UserRole.TAX_AUTHORITY]: await contract.TAX_AUTHORITY_ROLE(),
    [UserRole.ADMIN]: await contract.DEFAULT_ADMIN_ROLE(),
  };

  const role = roleMap[roleName as keyof typeof roleMap];
  if (!role) {
    throw new Error(`Invalid role specified: ${roleName}`);
  }

  // The ABI has grantRole from AccessControl, which is the correct way to assign roles.
  const tx = await contract.grantRole(role, userAddress);
  await tx.wait();
};

// Check if a user is verified
// Note: This function attempts to check verification status but may not be available in all contract versions
export const isUserVerified = async (
  contract: ethers.Contract,
  userAddress: string
): Promise<boolean> => {
  try {
    // Try to call the isVerifiedUser function if it exists
    const isVerified = await contract.isVerifiedUser(userAddress);
    return isVerified;
  } catch (error) {
    console.warn(
      "isVerifiedUser function not available in contract:",
      error.message
    );
    // If the function doesn't exist in the contract, we can't pre-check verification
    // The verification will be checked when actual transactions are performed
    // For now, return false to show the verification warning to users
    return false;
  }
};
