const host = "shipmathlab.com";
const key = "639ac89634fd442ba6b1254dcd3368bb";
const keyLocation = `https://${host}/${key}.txt`;

const sitemapResponse = await fetch(`https://${host}/sitemap.xml`);
if (!sitemapResponse.ok) {
  throw new Error(`Could not load sitemap: HTTP ${sitemapResponse.status}`);
}

const sitemap = await sitemapResponse.text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (!urlList.length || urlList.some((url) => new URL(url).hostname !== host)) {
  throw new Error("Sitemap did not contain the expected ShipMathLab URLs.");
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList }),
});

if (![200, 202].includes(response.status)) {
  throw new Error(`IndexNow rejected the submission: HTTP ${response.status}`);
}

console.log(`IndexNow accepted ${urlList.length} ShipMathLab URLs (HTTP ${response.status}).`);
