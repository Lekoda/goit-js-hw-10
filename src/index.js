import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';


const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    const countryName = e.target.value.trim()
    if (!countryName) {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        return;
    };


    fetchCountries(countryName)
        .then(countries => {
            if (countries.length > 10) {
                Notiflix.Notify.info(
                    'Too many matches found. Please enter a more specific name.'
                );
                countryList.innerHTML = '';
                countryInfo.innerHTML = '';
            } else if (countries.length === 1) {
                countryList.innerHTML = '';
                countryInfo.innerHTML = fullCardMarkup(countries[0]);
            } else if (countries.length > 1) {
                countryInfo.innerHTML = '';
                countryList.innerHTML = cardsMarkup(countries);
            }
        })
        .catch(error => {
            Notiflix.Notify.failure('Oops, there is no country with that name');
            console.log(error);
        });
}



    function cardsMarkup(countries) {
        const markup = countries.map(({flags: {svg, alt}, name: {official}}) => {
            return `
            <li class= "country-list__item>
        <img  class="country-list__flag" src="${svg}" alt="${alt}">
        <p class="country-list__name">${official}</p> 
        </li>`    
        }).join('');
        return markup;
}

function fullCardMarkup(country) {
        
    const fullCard =`<div class="country-info__card">
        <img src="${country.flags.svg}" width ="50" alt="flag" class="country-info__flag">
        <p class="country-info__name">${country.name.official}</p>
        </div>
        <ul class="country-info__list">
        <li><span class="country-info__text">Capital:</span> ${country.capital}</li>
        <li><span class="country-info__text">Population:</span> ${country.population}</li>
        <li><span class="country-info__text">Languages:</span> ${Object.values(country.languages)}</li>
        `;

    return fullCard;
}


