import { demoMode, serverUrl } from "@/constants.ts";
import { makeTypes } from "@/lib/makeData.ts";
import axios from "axios";
import { BaseHandler, HandleExceptionBoolean, HandleResponseBoolean } from "@/infrastructure/base.tsx";

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
  return await BaseHandler(axios.post, "types", types, HandleResponseBoolean, HandleExceptionBoolean, true)
}

export async function DeleteTypes(ids: number[]): Promise<boolean> {
  return await BaseHandler(axios.delete, "types", {data: ids}, HandleResponseBoolean, HandleExceptionBoolean, true)
}
