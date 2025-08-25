// Bidding service functions to call backend APIs
const API_BASE = "http://localhost:3000/api/bidding"; // Adjust if your backend route is different

export async function getAllBids() {
  try {
    const res = await fetch(`${API_BASE}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching all bids:", error);
    return { success: false, message: "Failed to fetch bids" };
  }
}

export async function getBidById(id: string) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching bid by ID:", error);
    return { success: false, message: "Failed to fetch bid" };
  }
}

export async function getBidsByPropertyId(propertyId: number) {
  try {
    const res = await fetch(`${API_BASE}/property/${propertyId}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching bids by property ID:", error);
    return { success: false, data: [] };
  }
}

export async function createBid(
  bid: { propertyId: number; bidder: string; bidAmount: number },
  token?: string
) {
  try {
    const res = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(bid),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error creating bid:", error);
    return { success: false, message: "Failed to create bid" };
  }
}

export async function updateBid(
  id: string,
  bid: Partial<{ propertyId: number; bidder: string; bidAmount: number }>,
  token?: string
) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(bid),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error updating bid:", error);
    return { success: false, message: "Failed to update bid" };
  }
}

export async function deleteBid(id: string, token?: string) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error deleting bid:", error);
    return { success: false, message: "Failed to delete bid" };
  }
}


// Delete all biddings of a property
export async function deleteBiddingsByPropertyId(propertyId: number, token?: string) {
  try {
    const res = await fetch(`${API_BASE}/property/${propertyId}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error deleting biddings by property ID:", error);
    return { success: false, message: "Failed to delete biddings" };
  }
}