async function dexieAction<T>(action: Promise<T>) {
  const response = await action;

  return response;
}

export default dexieAction;
