import { demoMode } from "@/constants.ts";
import { BaseFetchHandler } from "@/infrastructure/base.tsx";

export async function serverIsDown() {
  if(demoMode) return false;

  let isDown = false;

  try {
    const res = await BaseFetchHandler("health-check");

    if (res.status !== 200) {
      isDown = true;
    }
  } catch (e) {
    isDown = true;
    console.log(e);
  }

  return isDown;
}
