export function parseHTMLTable(htmlStringList: string[]) {
  if (!htmlStringList || !htmlStringList.length) {
    return [];
  }
  // Create a DOM parser to process the HTML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlStringList[0], "text/html");
  console.log("doc ====", doc);
  //   document.body.appendChild(doc);

  // Extract rows from tbody
  const rows = doc.querySelectorAll("tbody tr");
  const data = [];

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    const record = {
      index: cells[0].innerText.trim(),
      code: cells[1].innerText.trim(),
      name: cells[2].innerText.trim(),
      currentPrice: cells[3].innerText.trim(),
      changeRate: cells[4].innerText.trim(),
      priceChange: cells[5].innerText.trim(),
      speed: cells[6].innerText.trim(),
      turnoverRate: cells[7].innerText.trim(),
      volumeRatio: cells[8].innerText.trim(),
      amplitude: cells[9].innerText.trim(),
      dealAmount: cells[10].innerText.trim(),
      floatingStock: cells[11].innerText.trim(),
      marketValue: cells[12].innerText.trim(),
      peRatio: cells[13].innerText.trim(),
    };
    if (record.amplitude === "--") {
      record.amplitude = "0";
    }
    data.push(record);
  });

  return data;
}

/**
 * Parse cookie string into an object
 * @param {string} cookieStr - Cookie string in format "key1=value1; key2=value2"
 * @returns {Object} Cookie key-value pairs
 */
export const parseCookie = (cookieStr) => {
  if (!cookieStr) return {};

  return cookieStr.split(";").reduce((acc, pair) => {
    const [key, value] = pair.trim().split("=");
    if (key && value) {
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {});
};
