export default class DataArrayFetcher {
  constructor(data, numOfResults) {
    this.data = data;
    this.numOfResults = numOfResults;
  }

  getResults(query) {
    // Filter for matching strings
    let results = this.data.filter((item) => {
      return item.text.toLowerCase().includes(query.toLowerCase());
    });

    return results.slice(0, this.numOfResults);
  }
}
