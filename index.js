/* eslint-disable no-new */
import "@babel/polyfill";
import Autocomplete from './Autocomplete';
import usStates from './us-states';
import './main.css';


// US States
const data = usStates.map(state => ({
  text: state.name,
  value: state.abbreviation,
}));
new Autocomplete(document.getElementById('state'), {
  data,
  onSelect: (stateCode) => {
    console.log('selected state:', stateCode);
  },
});


// Github Users
new Autocomplete(document.getElementById('gh-user'), {
  dataUrl: "https://api.github.com/search/users?q={query}&per_page={numOfResults}",
  formatResponse: (data) => {
    return data.items.map(item => {
      return { text: item.login, value: item.id };
    });
  },
  onSelect: (ghUserId) => {
    console.log('selected github user id:', ghUserId);
  }
});
