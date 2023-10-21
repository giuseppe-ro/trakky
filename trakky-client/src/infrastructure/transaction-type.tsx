import { demoMode } from "@/constants.ts";
import { makeTypes } from "@/lib/makeData.ts";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Type {
  id: number;
  name: string;
}

export async function fetchTypes(): Promise<Type[]> {
  if (demoMode) return makeTypes();

  return [
    { id: 1, name: "Food" },
    { id: 2, name: "Bills" },
    { id: 3, name: "Transport" },
    { id: 4, name: "Personal" },
    { id: 5, name: "General" },
    { id: 6, name: "House" },
  ];

  // let response = await axios.get(`${serverUrl}/types`);
  // return (await response.data) as Type[];
}
