const parser = require("node-html-parser");

const { fetchTriano } = require("./util");

async function getLinkData(link) {
  const text = await fetchTriano(link);
  const pageRoot = parser.parse(text);
  const attributes = pageRoot.querySelectorAll(".ap-attr");
  const features = pageRoot.querySelectorAll(".ap-features > li");
  const isInBerlin = pageRoot
    .querySelector("h1")
    .innerText.toLowerCase()
    .includes("berlin");

  if (!isInBerlin) return null;

  /* ===== building the return data ===== */

  const data = {};

  data["link"] = link;
  data["totalCost"] = pageRoot.querySelector(".ap-price-main span")?.innerHTML;
  data["costPerSquareMeter"] =
    pageRoot.querySelector(".ap-price-sub span")?.innerHTML;

  for (const attribute of attributes) {
    const attributeRoot = parser.parse(attribute.innerHTML);

    const key = attributeRoot.querySelector(".ap-attr-title").innerText.trim();
    const value = attributeRoot
      .querySelector(".ap-attr-options")
      .innerText.trim();

    data[key] = value;
  }
  for (const feature of features) {
    const featureRoot = parser.parse(feature.innerHTML);

    const key = featureRoot
      .querySelector(".ap-features-title")
      .innerText.trim();
    const value = featureRoot
      .querySelector(".ap-features-val")
      .innerText.trim();

    data[key] = value;
  }
  return data;
}
async function fetchOffers(link_list) {
  const data = [];

  for (const [idx, link] of link_list.entries()) {
    console.log(`fetching offer ${idx + 1} / ${link_list.length}...`);
    const linkData = await getLinkData(link);
    if (linkData) data.push(linkData);
  }
  return data;
}
module.exports = { fetchOffers };
