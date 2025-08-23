// Bidding service functions to call backend APIs
const API_BASE = "http://localhost:3000/api/bidding"; // Adjust if your backend route is different

export async function getAllBids() {
	const res = await fetch(`${API_BASE}`);
	return res.json();
}

export async function getBidById(id: string) {
	const res = await fetch(`${API_BASE}/${id}`);
	return res.json();
}

export async function getBidsByPropertyId(propertyId: number) {
	const res = await fetch(`${API_BASE}/property/${propertyId}`);
	return res.json();
}

export async function createBid(bid: { propertyId: number; bidder: string; bidAmount: number }, token?: string) {
	const res = await fetch(`${API_BASE}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {})
		},
		body: JSON.stringify(bid)
	});
	return res.json();
}

export async function updateBid(id: string, bid: Partial<{ propertyId: number; bidder: string; bidAmount: number }>, token?: string) {
	const res = await fetch(`${API_BASE}/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {})
		},
		body: JSON.stringify(bid)
	});
	return res.json();
}

export async function deleteBid(id: string, token?: string) {
	const res = await fetch(`${API_BASE}/${id}`, {
		method: "DELETE",
		headers: {
			...(token ? { Authorization: `Bearer ${token}` } : {})
		}
	});
	return res.json();
}