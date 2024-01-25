import { makeOwners } from "@/lib/makeData.ts";
import axios from "axios";
import {
  BaseFetchResultHandler,
  BaseResultHandler,
  HandleExceptionBoolean,
  HandleResponseBoolean
} from "@/infrastructure/base.tsx";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Owner {
  id: number;
  name: string;
}

function mapOwners<T>(data: any): T[] {
  return data;
}

export async function fetchOwners(): Promise<Owner[]> {
  return await BaseFetchResultHandler<Owner>(makeOwners, "owners", mapOwners);
}


export async function AddOwners(owners: Owner[]): Promise<boolean> {
  return await BaseResultHandler(axios.post, "owners", owners, HandleResponseBoolean, HandleExceptionBoolean, true)
}

export async function EditOwner(owner: Owner): Promise<boolean> {
  return await BaseResultHandler(axios.put, "owner", owner, HandleResponseBoolean, HandleExceptionBoolean, true)
}

export async function DeleteOwners(ids: number[]): Promise<boolean> {
  return await BaseResultHandler(axios.delete, "owners", {data: ids}, HandleResponseBoolean, HandleExceptionBoolean, true)
}
