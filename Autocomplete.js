import DataArrayFetcher from './DataArrayFetcher';
import DataUrlFetcher from './DataUrlFetcher';
import debounce from 'lodash.debounce';

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

  /**
  * Factory that returns a data fetcher object
  */
  getResultsFetcher() {
    const { dataUrl, numOfResults, data, formatResponse } = this.options;

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

  onKeydown(keyCode) {
    const dropdownLength = this.listEl.childElementCount;

    if (dropdownLength > 0) {
      // up arrow key
      if (keyCode === 38) {
        this.highlightedIndex = (this.highlightedIndex !== -1) ?
          this.highlightedIndex - 1 : dropdownLength - 1;
          this.highlightResult();
      }
      // down arrow key
      else if (keyCode === 40) {
        this.highlightedIndex = (this.highlightedIndex < dropdownLength - 1) ?
          this.highlightedIndex + 1 : -1;
          this.highlightResult();
      }
      // enter key
      else if (keyCode === 13) {
        this.selectResult();
      }
    }
  }

  highlightResult() {
    const liElements = this.listEl.children;
    for (let child of liElements) {
      child.classList.remove('highlighted');
    }

    if (this.highlightedIndex !== -1) {
      const resultEl = liElements[this.highlightedIndex];
      resultEl.classList.add('highlighted');
    }
  }

  selectResult() {
    if (this.highlightedIndex !== -1) {
      const resultEl = this.listEl.children[this.highlightedIndex];
      resultEl.click();
    }
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
      debounce(event => this.onQueryChange(event.target.value), 500));
    inputEl.addEventListener('keydown',
      event => this.onKeydown(event.keyCode));

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

    this.highlightedIndex = -1;
  }
}
