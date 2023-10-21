import { demoMode, serverUrl } from "@/constants.ts";
import { makeTypes } from "@/lib/makeData.ts";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Type {
  id: number;
  name: string;
}

export async function fetchTypes(): Promise<Type[]> {
  if (demoMode) return makeTypes();

  let response = await axios.get(`${serverUrl}/types`);
  return (await response.data) as Type[];
}
