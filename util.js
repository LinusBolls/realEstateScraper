const fs = require("fs");

const fetch = require("node-fetch");

const trianoOptions = {
  headers: {
    Cookie: JSON.parse(fs.readFileSync("./config.json")).tranioCookie,
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:93.0) Gecko/20100101 Firefox/93.0",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "If-None-Match": 'W/"91f280569a9506df419d0b1a859bcdbb"',
    "Cache-Control": "max-age=0",
  },
  method: "GET",
  mode: "cors",
};
async function fetchTriano(path) {
  const url = path.startsWith("https://") ? path : "https://tranio.com" + path;
  const res = await fetch(url, trianoOptions);

  const status_code_category = res.status.toString()[0];
  if (status_code_category != 2) throw Error(res);

  return await res.text();
}
const promiseJSONFile = async path =>
  new Promise(res =>
    fs.readFile(path, "utf8", (err, data) => {
      if (err) throw err;
      res(JSON.parse(data));
    })
  );

const dumpJSON = (path, data) =>
  fs.writeFile(path, JSON.stringify(data), err => {
    if (err) throw err;
  });

module.exports = { promiseJSONFile, dumpJSON, fetchTriano };
