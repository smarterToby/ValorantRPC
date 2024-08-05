import axios from "axios";

export async function fetchClientVersion(): Promise<string> {
  const res = await axios.get('https://valorant-api.com/v1/version');
  return res.data.data.version;
}
