const API_BASE = "http://localhost:3000/api/user";


export async function getUserNidFromWallet(wallet:string) {
  try {
    const nid = await fetch(`${API_BASE}/nid-by-wallet/${wallet}`);
    if (!nid.ok) {
      throw new Error(`HTTP error! status: ${nid.status}`);
    }
    const data = await nid.json();
    return data.nidNumber;
  } catch (error) {
    console.error("Error fetching user by wallet:", error);
    return { success: false, message: "Failed to fetch user" };
  }
}