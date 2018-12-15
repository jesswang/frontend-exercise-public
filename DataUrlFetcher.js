export default class DataUrlFetcher {
  constructor(url, numOfResults, formatResponse = () => {}) {
    this.url = url.replace(/{numOfResults}/, numOfResults);
    this.formatResponse = formatResponse;
  }

  async getResults(query) {
    let url = this.url.replace(/{query}/, query);
    let $ = require("jquery");

    try {
      let data = await $.ajax({
          url: url,
          dataType: "json"
        });

      return this.formatResponse(data);
    } catch {
      return [];
    }
  }
}
