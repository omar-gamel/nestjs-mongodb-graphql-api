export function randomString(stringLength) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  let str = '';
  for (let i = 0; i < stringLength; i++) {
    let index = Math.floor(Math.random() * chars.length);
    str += chars.substring(index, index + 1);
  }
  return str;
}
