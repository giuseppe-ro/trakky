import { makeOwners } from "@/lib/makeData.ts";
import axios from "axios";

import { baseApiCall, makeBaseRequest } from "@/infrastructure/base-api.ts";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Owner {
  id: number;
  name: string;
}

export async function fetchOwners(): Promise<Owner[]> {
  const config = makeBaseRequest("owners", "GET")

  const { data, error } = await baseApiCall<Owner[]>({ request: config, demoModeData: makeOwners });

  if (error) {
    console.log("Error while getting owners:", error);
  }

  return data ?? [];
}


export async function AddOwners(owners: Owner[]): Promise<boolean> {
  const config = makeBaseRequest("owners", "POST")
  config.data = owners;

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while adding owners:", error);
  }

  return data ?? false;
}

export async function EditOwner(owner: Owner): Promise<boolean> {
  const config = makeBaseRequest("owners", "PUT")
  config.data = owner;

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while editing owners:", error);
  }

  return data ?? false;
}

export async function DeleteOwners(ids: number[]): Promise<boolean> {
  const config = makeBaseRequest("owners", "DELETE")
  config.data = ids;

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while getting owners:", error);
  }

  return data ?? false;
}
