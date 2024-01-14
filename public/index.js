const list = document.getElementById("crypto-list");

async function getCryptos() {
  list.innerHTML = "";

  const res = await fetch("http://localhost:3000/crypto", { headers: { Content: "application/json" }, method: "GET" })
  const cryptos = await res.json();

  for (const [crypto, value] of Object.entries(cryptos)) {
    const li = document.createElement("li");
    
    li.innerText = `${crypto} : ${Number(value).toFixed(2)}`;

    list.appendChild(li);
  };
}

getCryptos().then(() => {
  setInterval(() => {
    getCryptos();
  }, 10 * 60 * 1000);
});
