import { makeOwners } from "@/lib/makeData.ts";
import axios from "axios";
import {
  BaseFetchHandler,
  BaseHandler,
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
  return await BaseFetchHandler<Owner>(makeOwners, "owners", mapOwners);
}


export async function AddOwners(owners: Owner[]): Promise<boolean> {
  return await BaseHandler(axios.post, "owners", owners, HandleResponseBoolean, HandleExceptionBoolean, true)
}

export async function EditOwner(owner: Owner): Promise<boolean> {
  return await BaseHandler(axios.put, "owner", owner, HandleResponseBoolean, HandleExceptionBoolean, true)
}

export async function DeleteOwners(ids: number[]): Promise<boolean> {
  return await BaseHandler(axios.delete, "owners", {data: ids}, HandleResponseBoolean, HandleExceptionBoolean, true)
}
