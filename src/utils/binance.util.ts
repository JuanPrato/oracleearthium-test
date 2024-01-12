export function convertSymbol(s: string) {
  return `${s}FDUSD`;
}

export function parseSymbolResponse(s: string) {
  return s.replace("FDUSD", "");
}
