import { demoMode, serverUrl } from "@/constants.ts";

export async function serverIsDown() {
  if(demoMode) return false;

  let isDown = false;

  try {
    const res = await fetch(`${serverUrl}/health-check`);

    if (res.status !== 200) {
      isDown = true;
    }
  } catch (e) {
    isDown = true;
    console.log(e);
  }

  return isDown;
}
