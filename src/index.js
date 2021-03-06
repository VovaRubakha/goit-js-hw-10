var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';
import 'notyf/notyf.min.css';
import './css/styles.css';
import { fetchCountries } from './jscripts/fetchCountries';

import { searchCountry, countryInfo } from './jscripts/refs';

const DEBOUNCE_DELAY = 300;

searchCountry.addEventListener('input', debounce(onSearchCountry), DEBOUNCE_DELAY);

function onSearchCountry(e) {
  let inputValue = e.target.value.trim();
  if (!inputValue) {
    return clearMarkup(``);
  }
  fetchCountries(inputValue)
    .then(countries => {
      const countriesAmount = countries.length;
      console.log(countriesAmount);
      if (countriesAmount >= 10) {
        return Notiflix.Notify.warning('Be more precise');
      } else if (countriesAmount > 1 && countriesAmount < 10) {
        Notiflix.Notify.success(`That's a list`);
        return renderCountriesList(countries);
      } else {
        Notiflix.Notify.success(`Here's your country!`);
        return renderCountriesInfo(countries);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Country not found');
      console.error(error);
    });
}

function renderCountriesList(countries) {
  countryInfo.innerHTML = '';
  const markup = countries
    .map(country => {
      return `
      <li class="list">
      <img src="${country.flags.svg}" width="30" height="30" alt="${country.name.common}">
      <p>${country.name.official}</p>
      </li>`;
    })
    .join(``);

  countryInfo.innerHTML = markup;
}

function renderCountriesInfo(countries) {
  countryInfo.innerHTML = '';
  const markup = countries
    .map(country => {
      return `
        <p class="info-title">
        <img src="${country.flags.svg}"
          width="30" height="30"
          alt="${country.name.common} flag">
          <span>${country.name.official}</span>
        </p>
        <p><span class="info-item">Capital:</span> ${country.capital}</p>
        <p><span class="info-item">Population:</span> ${country.population}</p>
        <p><span class="info-item">Languages:</span> ${Object.values(country.languages)}</p>`;
    })
    .join(``);
  countryInfo.innerHTML = markup;
}
function clearMarkup(markup = '') {
  countryInfo.innerHTML = markup;
}
