# Solution Docs

<!-- Include documentation, additional setup instructions, notes etc. here -->
The Autocomplete constructor can now take additional options to configure it to display data from an HTTP endpoint. The syntax is as follows:
`new Autocomplete(el, [options={}])`
### Parameters
**`el (Element)`**: The DOM element to which the autocomplete elements will be appended.
**`[options.data=[]] (Array)`**: The static data array that populates the autocomplete. The expected format is `[{ text: "...", value: "..." }]`.
**`[options.dataUrl] (String)`**: The HTTP endpoint from which data is fetched to populate the autocomplete. If both `dataUrl` and `data` options are supplied, `data` will be ignored. The url must indicate the position of the query and the number of results to fetch (if applicable) like so: `"https://api.github.com/search/users?q={query}&per_page={numOfResults}"`.
**`[options.formatResponse] (Function)`**: Must be provided if `dataUrl` is provided. The function takes in the HTTP response data and must be implemented to return an array of objects in the format `[{ text: "...", value: "..." }]`.
**`[options.onSelect] (Function)`**: The autocomplete selection handler. When it is invoked, it is passed the `value` field from the results (either from the static data array or from the formatted HTTP response data array).
**`[options.numOfResults=10] (Number)`**: The maximum number of results to show.

### Notes:
* The Github search API has a limit of 10 requests per minute without authentication. A status code of 403 will be returned by the API if that limit is exceeded, and the autocomplete dropdown won't show any data until new input is attempted after that minute has passed.
* Selection with the up/down arrow keys only works when the input is focused.
* Input handling is debounced. Results are only fetched after typing has paused for 500 ms.

### Additional work that could be done:
* Input sanitation
* Adding tests
* Throw an exception in the Autocomplete constructor if parameters are missing or invalid (for instance, if the `dataUrl` option is supplied without the `formatResponse` option).
* It might be a better user experience to have the autocomplete dropdown dismiss on click outside of the input/dropdown and reappear when the input is focused.
* If the display logic around the autocomplete were to grow and the Autocomplete class began to have too many responsibilities, methods could be extracted out of the Autocomplete class into another class. The new class could just handle how the dropdown displays and implement logic related to highlighting results, showing/hiding the dropdown based on user click, etc.
