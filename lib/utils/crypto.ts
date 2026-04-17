export function generateRandomString(
  length: number,
  charset: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset[array[i] % charset.length];
  }

  return result;
}

export function generateUUID(): string {
  return crypto.randomUUID();
}
