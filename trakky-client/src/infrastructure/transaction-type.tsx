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

export async function AddTypes(types: Type[]): Promise<boolean> {
  if (demoMode) return true;

  try {
    const res = await axios.post(`${serverUrl}/types`, types);
    if (res.status === 200) {
      return true;
    } else {
      console.log(res);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function DeleteTypes(ids: number[]): Promise<boolean> {
  if (demoMode) return true;

  try {
    const res = await axios.delete(`${serverUrl}/types`, {
      data: ids,
    });

    if (res.status === 200) {
      return true;
    } else {
      console.log(res);
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}
