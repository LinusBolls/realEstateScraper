const parser = require("node-html-parser");

const { fetchTriano } = require("./util");

const fetchPages = async (url, numPages) => {
  const results = [];
  for (let i = 1; i <= numPages; i++) {
    console.log(`fetching listing page ${i} / ${numPages}...`);
    const data = await fetchTriano(url + "?page=" + i);
    results.push(data);
  }
  return results;
};
async function fetchLinks(url) {
  const link_list = [];
  const text = await fetchTriano(url);
  const root = parser.parse(text);
  const numPages = root.querySelectorAll(".roster-pagination li").length - 1;
  const page_list = await fetchPages(url, numPages);

  for (const page of page_list) {
    const pageRoot = parser.parse(page);
    const offer_list = pageRoot.querySelectorAll(
      ".c-snippet, .snippet.slide, .snipped.invest-project"
    );

    for (const offer of offer_list) {
      const offerRoot = parser.parse(offer.innerHTML);
      const a_el = offerRoot.querySelector(
        ".c-snippet-title a, .snippet-img, a"
      );

      if (a_el == null) continue;

      link_list.push("https://tranio.com" + a_el.getAttribute("href"));
    }
  }
  return link_list;
}
module.exports = { fetchLinks };
