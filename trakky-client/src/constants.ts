export const serverUrl = "http://trakky-api.localdomain";

export const demoMode = (): boolean => {
  let demoMode = false;
  try {
    demoMode = process.env.REACT_APP_DEMO_MODE === "true";
  } catch (e) {
    demoMode = false;
  }

  return demoMode;
};
