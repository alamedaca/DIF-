// EXACT SAME JS — unchanged per requirement

const state = {
  dif: { category: "", units: "", sqft: "" },
  cfg: { currency: "en-US|USD|2" }
};

function fmtCurrency(v){
  const parts = state.cfg.currency.split("|");
  return new Intl.NumberFormat(parts[0], {
    style: "currency",
    currency: parts[1],
    minimumFractionDigits: 2
  }).format(v || 0);
}

const DIF_RATES = {
  "res-sf": { basis:"per-unit", publicSafety:2664, publicFacilities:1725, transportation:2799, parks:10151 },
  "res-mf": { basis:"per-unit", publicSafety:2114, publicFacilities:1368, transportation:2173, parks:7416 },
  "res-adu": { basis:"per-unit", publicSafety:0, publicFacilities:0, transportation:0, parks:0 },
  "nr-retail": { basis:"per-ksf", publicSafety:587, publicFacilities:380, transportation:5243, parks:0 },
  "nr-office": { basis:"per-ksf", publicSafety:1078, publicFacilities:694, transportation:5159, parks:0 },
  "nr-warehouse": { basis:"per-ksf", publicSafety:401, publicFacilities:259, transportation:4341, parks:0 }
};

function calcDIFAmounts(){
  const def = DIF_RATES[state.dif.category];
  if (!def) return { publicSafety:0, publicFacilities:0, transportation:0, parks:0, total:0 };

  let multiplier = def.basis === "per-unit"
    ? Number(state.dif.units || 0)
    : Number(state.dif.sqft || 0) / 1000;

  const publicSafety = def.publicSafety * multiplier;
  const publicFacilities = def.publicFacilities * multiplier;
  const transportation = def.transportation * multiplier;
  const parks = def.parks * multiplier;

  return {
    publicSafety,
    publicFacilities,
    transportation,
    parks,
    total: publicSafety + publicFacilities + transportation + parks
  };
}

function renderDIF(){
  const a = calcDIFAmounts();
  document.getElementById("difPublicSafetyDisplay").textContent = fmtCurrency(a.publicSafety);
  document.getElementById("difPublicFacilitiesDisplay").textContent = fmtCurrency(a.publicFacilities);
  document.getElementById("difTransportationDisplay").textContent = fmtCurrency(a.transportation);
  document.getElementById("difParksDisplay").textContent = fmtCurrency(a.parks);
  document.getElementById("difTotalDisplay").textContent = fmtCurrency(a.total);
}

function init(){
  document.getElementById("difCategory").addEventListener("change", e => {
    state.dif.category = e.target.value;
    renderDIF();
  });

  document.getElementById("difUnitsInput").addEventListener("input", e => {
    state.dif.units = e.target.value;
    renderDIF();
  });

  document.getElementById("difSqftInput").addEventListener("input", e => {
    state.dif.sqft = e.target.value;
    renderDIF();
  });

  document.getElementById("clearButton").addEventListener("click", () => {
    state.dif = { category:"", units:"", sqft:"" };
    document.querySelectorAll("input, select").forEach(el => el.value = "");
    renderDIF();
  });

  document.getElementById("printButton").addEventListener("click", () => window.print());

  renderDIF();
}

document.addEventListener("DOMContentLoaded", init);