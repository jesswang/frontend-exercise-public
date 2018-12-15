import DataArrayFetcher from './DataArrayFetcher';
import DataUrlFetcher from './DataUrlFetcher';

export default class Autocomplete {
  constructor(rootEl, options = {}) {
    this.rootEl = rootEl;
    this.options = {
      numOfResults: 10,
      data: [],
      ...options,
    };
    this.resultsFetcher = this.getResultsFetcher();

    this.init();
  }

  getResultsFetcher() {
    const { data, numOfResults, dataUrl, formatResponse } = this.options;

    if (dataUrl) {
      return new DataUrlFetcher(dataUrl, numOfResults, formatResponse);
    } else {
      return new DataArrayFetcher(data, numOfResults);
    }
  }

  /**
   * Given an array and a query, return a filtered array based on the query.
   */
  getResults(query) {
    if (!query) return [];

    return this.resultsFetcher.getResults(query);
  }

  async onQueryChange(query) {
    // Get data for the dropdown
    let results = await this.getResults(query);

    this.updateDropdown(results);
  }

  updateDropdown(results) {
    this.listEl.innerHTML = '';
    this.listEl.appendChild(this.createResultsEl(results));
  }

  createResultsEl(results) {
    const fragment = document.createDocumentFragment();
    results.forEach((result) => {
      const el = document.createElement('li');
      el.classList.add('result');
      el.textContent = result.text;

      // Pass the value to the onSelect callback
      el.addEventListener('click', () => {
        const { onSelect } = this.options;
        if (typeof onSelect === 'function') onSelect(result.value);
      });

      fragment.appendChild(el);
    });
    return fragment;
  }

  createQueryInputEl() {
    const inputEl = document.createElement('input');
    inputEl.setAttribute('type', 'search');
    inputEl.setAttribute('name', 'query');
    inputEl.setAttribute('autocomplete', 'off');

    inputEl.addEventListener('input',
      event => this.onQueryChange(event.target.value));

    return inputEl;
  }

  init() {
    // Build query input
    this.inputEl = this.createQueryInputEl();
    this.rootEl.appendChild(this.inputEl)

    // Build results dropdown
    this.listEl = document.createElement('ul');
    this.listEl.classList.add('results');
    this.rootEl.appendChild(this.listEl);
  }
}
