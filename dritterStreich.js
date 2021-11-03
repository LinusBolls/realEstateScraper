const getValueFromStr = (str, key) => {
  if (str == null || key == null) return null;
  const first = str.split(key)[1];
  if (first == null) return null;
  return first.split("\n")[0];
};
const priceStrToInt = priceStr =>
  parseInt(priceStr.split(",").join("").split(" €")[0]);

/* ===== this right here is the juice ===== */

function refineOffer(offer) {
  for (const key of Object.keys(offer)) {
    const knownKeys = [
      "Built in",
      "Completion in",
      "link",
      "Yield",
      "Tenants",
      "totalCost",
      "costPerSquareMeter",
      "Property parameters",
      "Financial performance",
      "Transaction costs",
      "Rental rate (m²/month)",
      "Total area",
      "Land area",
      "Property status",
      "Features",
      "Bathrooms",
      "Bedrooms",
    ];
    if (!knownKeys.includes(key))
      console.log(
        `unknown key ${key} with value ${offer[key]} found while refining offer`
      );
  }
  let { totalCost, costPerSquareMeter } = offer;
  totalCost = totalCost ? priceStrToInt(totalCost) : null;
  costPerSquareMeter = costPerSquareMeter
    ? priceStrToInt(costPerSquareMeter)
    : null;

  const isApartment = "Bathrooms" in offer || "Bedrooms" in offer;
  const isCompleted = !("Completion in" in offer);
  const completedYear = offer["Built in"] ?? offer["Completion in"];
  const link = offer["link"];
  const yield = offer["yield"];
  const tenants = offer["Tenants"];
  const features = offer["features"];
  const propertyStatus = offer["Property status"];
  const parameters = offer["Property parameters"];
  const performance = offer["Financial performance"];
  const rentalRate = offer["Rental rate (m²/month)"];
  const transactionCosts = offer["Transaction costs"];

  let totalApartments = getValueFromStr(parameters, "Total apartments: ");
  totalApartments = totalApartments ? parseInt(totalApartments) : null;

  const isOccupied = tenants != null && tenants !== "No tenants";
  const landArea =
    getValueFromStr(parameters, "Land area: ") || offer["Land area"];
  const costPerApartment =
    totalCost && totalApartments
      ? Math.floor(totalCost / parseInt(totalApartments))
      : null;

  return {
    link,
    totalCost,
    totalApartments,
    costPerSquareMeter,
    costPerApartment,
    yield,
    performance,
    rentalRate,
    propertyStatus,
    features,
    isApartment,
    constructionYear: completedYear,
    isCompleted,
    tenants,
    isOccupied,
    landArea,
  };
}

/* ===== that was it ===== */

function refineOffers(offer_list) {
  return offer_list.map(refineOffer);
}
module.exports = { refineOffers };
