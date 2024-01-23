import { demoMode, serverUrl } from "@/constants.ts";
import { makeOwners } from "@/lib/makeData.ts";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Owner {
  id: number;
  name: string;
}

export async function fetchOwners(): Promise<Owner[]> {
  if (demoMode) return makeOwners();

  let response = await axios.get(`${serverUrl}/owners`);
  return (await response.data) as Owner[];
}


export async function AddOwners(owners: Owner[]): Promise<boolean> {
  if (demoMode) return true;

  try {
    const res = await axios.post(`${serverUrl}/owners`, owners);
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

export async function EditOwner(owner: Owner): Promise<boolean> {
  if (demoMode) return true;

  try {
    const res = await axios.put(`${serverUrl}/owner`, owner);
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

export async function DeleteOwners(ids: number[]): Promise<boolean> {
  if (demoMode) return true;

  try {
    const res = await axios.delete(`${serverUrl}/owners`, {
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
