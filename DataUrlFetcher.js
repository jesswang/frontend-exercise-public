export default class DataUrlFetcher {
  constructor(url, numOfResults, formatResponse = () => {}) {
    this.url = url.replace(/{numOfResults}/, numOfResults);
    this.formatResponse = formatResponse;
  }

  async getResults(query) {
    let url = this.url.replace(/{query}/, query);
    let $ = require("jquery");
    let data;

    try {
      data = await $.ajax({
          url: url,
          dataType: "json"
        });
    } catch {
      return [];
    }

    return this.formatResponse(data);
  }
}
