const { promiseJSONFile, dumpJSON } = require("./util");
const { fetchLinks } = require("./ersterStreich");
const { fetchOffers } = require("./zweiterStreich");
const { refineOffers } = require("./dritterStreich");

async function main(config) {
  let srcStep1;
  let srcStep2;
  let srcStep3;

  if (config.doStep0) {
    console.log("\n========== Starting Step 0 ==========\n");
    srcStep1 = await fetchLinks(config.targetUrl);

    dumpJSON(config.outputStep0, srcStep1);
    console.log(`> wrote ${srcStep1.length} links to ${config.outputStep0}`);
  } else srcStep1 = await promiseJSONFile(config.inputStep1);

  if (config.doStep1) {
    console.log("\n========== Starting Step 1 ==========\n");
    srcStep2 = await fetchOffers(srcStep1);

    dumpJSON(config.outputStep1, srcStep2);
    console.log(`> wrote ${srcStep2.length} offers to ${config.outputStep1}`);
  } else srcStep2 = await promiseJSONFile(config.inputStep2);

  if (config.doStep2) {
    console.log("\n========== Starting Step 2 ==========\n");
    srcStep3 = refineOffers(srcStep2);

    dumpJSON(config.outputStep2, srcStep3);
    console.log(
      `> wrote ${srcStep3.length} refined offers to ${config.outputStep2}`
    );
  }
}
promiseJSONFile("./config.json").then(main);
