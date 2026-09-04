import assert from "node:assert/strict";
import test from "node:test";

const toolRoutes = [
  ["dimensional-weight-calculator", "FedEx, UPS, USPS &amp; DHL Dimensional Weight Comparison", "18 lb"],
  ["cbm-calculator", "CBM Calculator — Cubic Metres for Freight &amp; Shipping", "2.016 m³"],
  ["carton-fit-calculator", "Carton Fit Calculator", "50 items"],
  ["pallet-load-calculator", "Pallet Loading Calculator", "3 pallets"],
  ["container-loading-calculator", "Container Loading Calculator", "270 cartons"],
  ["package-girth-calculator", "Package Length + Girth Calculator", "112 in"],
  ["shipping-unit-converter", "Shipping Unit Converter", "39.370079 in"],
  ["corrugated-box-cost-calculator", "Corrugated Box Cost Calculator", "$534.60"],
  ["shipping-cost-estimator", "Shipping Cost Estimator", "$69.01"],
  ["ecommerce-margin-calculator", "Ecommerce Margin Calculator", "$24.53"],
  ["freight-density-calculator", "Freight Density Calculator", "234.8 kg/m³"],
  ["air-freight-chargeable-weight-calculator", "Air Freight Chargeable Weight Calculator", "160 kg"],
  ["lcl-chargeable-volume-calculator", "LCL Chargeable Volume Calculator", "6.4 W/M"],
  ["load-meter-calculator", "Load Meter Calculator", "4 LDM"],
  ["landed-cost-calculator", "Landed Cost Calculator", "$13,191.36"],
  ["reorder-point-calculator", "Reorder Point Calculator", "498 units"],
  ["eoq-calculator", "Economic Order Quantity Calculator", "548 units"],
  ["warehouse-storage-cost-calculator", "Warehouse Storage Cost Calculator", "$2,091.00"],
  ["pallet-stack-height-calculator", "Pallet Stack Height Calculator", "140 cm"],
  ["packaging-waste-calculator", "Packaging Waste Calculator", "10.8%"],
];

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("server-renders the finished ShipMathLab homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /ShipMathLab/);
  assert.match(html, /20 packaging &amp; freight calculators/);
  assert.match(html, /All 20 calculators/);
  assert.match(html, /Browse all [\s\S]{0,30}25[\s\S]{0,30} guides/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/);
  for (const [slug] of toolRoutes) assert.match(html, new RegExp(`/tools/${slug}`));
});

test("Dutch visitors get a first-party localized load-meter calculator", async () => {
  const response = await render("/nl/tools/laadmeter-calculator");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Laadmeters berekenen/);
  assert.match(html, /Nederlandse taal en Europese maten/);
  assert.match(html, /Europallet \(EPAL 1\)/);
  assert.match(html, /result-primary[^>]*>4(?:<!-- -->)? LDM/);
  assert.match(html, /hrefLang="nl-NL"/);
  assert.match(html, /href="\/tools\/load-meter-calculator"/);
  assert.doesNotMatch(html, /Google Translate|browser translation/i);
});

test("all twenty calculator routes render their working interface", async () => {
  for (const [slug, title, expectedResult] of toolRoutes) {
    const response = await render(`/tools/${slug}`);
    assert.equal(response.status, 200, slug);
    const html = await response.text();
    assert.match(html, new RegExp(escapeRegExp(title)), slug);
    assert.match(html, /guided-promise/, slug);
    assert.match(html, /Updates live/, slug);
    assert.match(html, /result-card/, slug);
    assert.match(html, new RegExp(`result-primary[^>]*>${escapeRegExp(expectedResult)}`), `${slug} default result`);
    assert.match(html, /How this estimate works/, slug);
    assert.match(html, /Copy result summary/, slug);
  }
});

test("priority calculators start from facts a non-specialist already knows", async () => {
  const dimensional = await render("/tools/dimensional-weight-calculator");
  const dimensionalHtml = await dimensional.text();
  assert.match(dimensionalHtml, /Enter the package once/);
  assert.match(dimensionalHtml, /Scale weight for one parcel/);
  assert.match(dimensionalHtml, /UPS Retail/);
  assert.match(dimensionalHtml, /Likely billed-weight range/);

  const pallet = await render("/tools/pallet-load-calculator");
  const palletHtml = await pallet.text();
  assert.match(palletHtml, /Which pallet are you using/);
  assert.match(palletHtml, /Planning limits in use/);
  assert.match(palletHtml, /Total cartons in this shipment/);
  assert.match(palletHtml, /Partial final pallet/);

  const lcl = await render("/tools/lcl-chargeable-volume-calculator");
  const lclHtml = await lcl.text();
  assert.match(lclHtml, /No W\/M knowledge or freight quote required/);
  assert.match(lclHtml, /Add quote prices if needed/);
});

test("supporting trust pages render", async () => {
  for (const [path, expected] of [["/about", "Useful answers"], ["/methodology", "Trace the answer"], ["/changelog", "What changed"], ["/privacy", "Privacy, in plain English"], ["/internal-traffic", "Keep our visits out of public traffic"]]) {
    const response = await render(path);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(expected));
  }
});

test("guides and monetisation resources render", async () => {
  const guides = await render("/guides");
  assert.equal(guides.status, 200);
  const guideHtml = await guides.text();
  assert.match(guideHtml, /25[\s\S]{0,30} guides for packaging/);
  assert.match(guideHtml, /dimensional-weight-packaging-audit/);

  const article = await render("/guides/landed-cost-model-for-imports");
  assert.equal(article.status, 200);
  assert.match(await article.text(), /Build a landed-cost model/);

  const resources = await render("/resources");
  assert.equal(resources.status, 200);
  const resourceHtml = await resources.text();
  assert.match(resourceHtml, /FreightKit Operations Workbook/);
  assert.match(resourceHtml, /product-price[^>]*>\$<!-- -->19/);
  assert.match(resourceHtml, /checkout not connected/);
  assert.match(resourceHtml, /dim-divisor-reference\.csv/);
  assert.match(resourceHtml, /lcl-quote-audit-checklist\.csv/);
});

test("focus tools expose trusted references and free embeds", async () => {
  for (const slug of ["dimensional-weight-calculator", "pallet-load-calculator", "lcl-chargeable-volume-calculator"]) {
    const tool = await render(`/tools/${slug}`);
    assert.equal(tool.status, 200, slug);
    const toolHtml = await tool.text();
    assert.match(toolHtml, /Free to embed/, slug);
    assert.match(toolHtml, /References/, slug);
    assert.match(toolHtml, /application\/ld\+json/, slug);
    assert.match(toolHtml, /formula-flow/, slug);

    const embed = await render(`/embed/${slug}`);
    assert.equal(embed.status, 200, `embed ${slug}`);
    assert.match(await embed.text(), /Powered by ShipMathLab/, `embed ${slug}`);
  }
});

test("new search clusters render and link to their calculators", async () => {
  const clusterRoutes = [
    ["dimensional-weight-carrier-divisors", "dimensional-weight-calculator"],
    ["dimensional-weight-rounding-examples", "dimensional-weight-calculator"],
    ["actual-weight-vs-dimensional-weight", "dimensional-weight-calculator"],
    ["standard-pallet-sizes-carton-fit", "pallet-load-calculator"],
    ["pallet-height-weight-stability-limits", "pallet-load-calculator"],
    ["pallet-loading-calculation-mistakes", "pallet-load-calculator"],
    ["calculate-lcl-wm-multiple-cartons", "lcl-chargeable-volume-calculator"],
    ["lcl-minimum-charges-local-fees", "lcl-chargeable-volume-calculator"],
    ["cbm-vs-weight-ton-vs-wm-lcl", "lcl-chargeable-volume-calculator"],
  ];
  for (const [guideSlug, toolSlug] of clusterRoutes) {
    const response = await render(`/guides/${guideSlug}`);
    assert.equal(response.status, 200, guideSlug);
    assert.match(await response.text(), new RegExp(`/tools/${toolSlug}`), guideSlug);
  }
});

test("three topic hubs render citation-ready answers and structured data", async () => {
  const topicRoutes = [
    ["dimensional-weight", "dimensional-weight-calculator", "What is dimensional weight?"],
    ["pallet-loading", "pallet-load-calculator", "How many cartons fit on a pallet?"],
    ["lcl-weight-measure", "lcl-chargeable-volume-calculator", "What does W/M mean in LCL freight?"],
  ];

  for (const [topicSlug, toolSlug, question] of topicRoutes) {
    const response = await render(`/topics/${topicSlug}`);
    assert.equal(response.status, 200, topicSlug);
    const html = await response.text();
    assert.match(html, /Quick answer/, topicSlug);
    assert.match(html, new RegExp(escapeRegExp(question)), topicSlug);
    assert.match(html, new RegExp(`/tools/${toolSlug}`), topicSlug);
    assert.match(html, /FAQPage/, topicSlug);
  }
});
