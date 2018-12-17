export default class DataArrayFetcher {
  constructor(data, numOfResults) {
    this.data = data;
    this.numOfResults = numOfResults;
  }

  getResults(query) {
    // Filter for matching strings
    return this.data.filter((item) => {
      return item.text.toLowerCase().includes(query.toLowerCase());
    });
  }
}
