import { serverUrl } from "@/constants.ts";

export async function serverIsDown() {
  let isDown = true;

  try {
    const res = await fetch(`${serverUrl}/health-check`);

    if (res.status === 200) {
      isDown = false;
    }
  } catch (e) {
    console.log(e);
  }

  return isDown;
}
