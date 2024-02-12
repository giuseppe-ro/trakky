import { makeOwners } from "@/lib/makeData.ts";
import axios from "axios";

import { Endpoint } from "@/constants.ts";
import { baseApiCall, baseRequestData, makeBaseRequest } from "@/infrastructure/base-api.ts";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Owner {
  id: number;
  name: string;
}

export interface ErrorResponse {
  message: string;
}

export async function getOwners(signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Owners, "GET", signal);

  const { data, error} = await baseApiCall<Owner[]>({ request: config, demoModeData: makeOwners });

  return { data: data ?? [], error };
}


export async function AddOwners(owners: Owner[], signal?: AbortSignal): Promise<boolean> {
  const config = makeBaseRequest(Endpoint.Owners, "POST", signal)

  config.data = baseRequestData(owners);

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while adding owners:", error);
  }

  return data ?? false;
}

export async function EditOwner(owner: Owner): Promise<boolean> {
  const config = makeBaseRequest(Endpoint.Owners, "PUT")
  config.data = baseRequestData(owner);

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while editing owners:", error);
  }

  return data ?? false;
}

export async function DeleteOwners(ids: number[], signal?: AbortSignal): Promise<boolean> {
  const config = makeBaseRequest(Endpoint.Owners, "DELETE", signal)
  config.data = baseRequestData(ids);

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while getting owners:", error);
  }

  return data ?? false;
}
