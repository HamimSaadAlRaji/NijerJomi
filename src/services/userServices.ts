import { API_BASE_URL } from "../config/constants";

const API_BASE = `${API_BASE_URL}/user`;

export async function getUserNidFromWallet(wallet: string) {
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


export async function getUserByWallet(wallet: string) {
  try {
    const user = await fetch(`${API_BASE}/${wallet}`);
    if (!user.ok) {
      throw new Error(`HTTP error! status: ${user.status}`);
    }
    const data = await user.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching user by wallet:", error);
    return { success: false, message: "Failed to fetch user" };
  }
}