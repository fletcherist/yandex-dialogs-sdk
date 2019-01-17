export function generateRandomText(length: number = 25): string {
  const aCode = 'a'.charCodeAt(0);
  return Array(length)
      .fill(aCode)
      .map(code => String.fromCharCode(code + Math.floor(Math.random() * 26)))
      .join('');
}
