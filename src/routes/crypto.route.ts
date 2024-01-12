import { app } from "../app";
import { prices } from "../caches/price.cache";

app.get("/crypto", (_, res) => {
  res.json(
    Array.from(prices.entries()).reduce((acc, [n, v]) => {
      return {
        ...acc,
        [n]: v,
      };
    }, {})
  );
});
