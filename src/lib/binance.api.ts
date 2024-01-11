import { Spot } from "@binance/connector-typescript";
import { convertSymbol } from "../utils/binance.util";

const API_KEY = "";
const API_SECRET = "";
const BASE_URL = "https://api.binance.com";

const client = new Spot(API_KEY, API_SECRET, { baseURL: BASE_URL });

type SymbolPrice = {
  symbol: string;
  price: string;
};

export async function getPriceForSymbols(symbols: string[]) {
  const parsedSymbols = symbols.map(convertSymbol);
  const res = (await client.symbolPriceTicker({
    symbols: `["${parsedSymbols.join('","')}"]`,
  })) as unknown as Promise<SymbolPrice[]>;
  return res;
}
