import assert from "node:assert/strict";
import test from "node:test";

const toolRoutes = [
  ["dimensional-weight-calculator", "Dimensional Weight Calculator", "8 kg"],
  ["cbm-calculator", "CBM &amp; Volume Calculator", "2.016 m³"],
  ["carton-fit-calculator", "Carton Fit Calculator", "50 items"],
  ["pallet-load-calculator", "Pallet Load Calculator", "54 cartons"],
  ["container-loading-calculator", "Container Loading Calculator", "270 cartons"],
  ["package-girth-calculator", "Package Length + Girth Calculator", "112 in"],
  ["shipping-unit-converter", "Shipping Unit Converter", "39.370079 in"],
  ["corrugated-box-cost-calculator", "Corrugated Box Cost Calculator", "$534.60"],
  ["shipping-cost-estimator", "Shipping Cost Estimator", "$69.01"],
  ["ecommerce-margin-calculator", "Ecommerce Margin Calculator", "$24.53"],
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

test("server-renders the finished FreightKit homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /FreightKit/);
  assert.match(html, /Packaging math/);
  assert.match(html, /Browse all 10 tools/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/);
  for (const [slug] of toolRoutes) assert.match(html, new RegExp(`/tools/${slug}`));
});

test("all ten calculator routes render their working interface", async () => {
  for (const [slug, title, expectedResult] of toolRoutes) {
    const response = await render(`/tools/${slug}`);
    assert.equal(response.status, 200, slug);
    const html = await response.text();
    assert.match(html, new RegExp(escapeRegExp(title)), slug);
    assert.match(html, /Your inputs/, slug);
    assert.match(html, /Live result/, slug);
    assert.match(html, new RegExp(`result-primary[^>]*>${escapeRegExp(expectedResult)}`), `${slug} default result`);
    assert.match(html, /How this estimate works/, slug);
    assert.match(html, /Copy result summary/, slug);
  }
});

test("supporting trust pages render", async () => {
  for (const [path, expected] of [["/about", "Useful answers"], ["/privacy", "Privacy, in plain English"]]) {
    const response = await render(path);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(expected));
  }
});
