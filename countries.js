// INITIAL VARIABLES

const headerContainer = document.querySelector(".header-container");
const infoContainer = document.querySelector(".info-container");
const mainContainer = document.querySelector(".main-container");
const navContainer = document.querySelector(".nav-container");
const nav = document.querySelector(".nav");
const mapContainer = document.querySelector(".map-container");
const content = document.querySelector(".content");

africaCountryContainer = document.querySelector(".africa-country-holder");
americasCountryContainer = document.querySelector(".americas-country-holder");
asiaCountryContainer = document.querySelector(".asia-country-holder");
europeCountryContainer = document.querySelector(".europe-country-holder");
oceaniaCountryContainer = document.querySelector(".oceania-country-holder");
otherCountryContainer = document.querySelector(".others-country-holder");

///////////////////////////////////// APP CLASS ///////////////////////////////////////

class App {
  map;

  constructor() {
    // get user position for initial map rendering
    this.getPosition();
    this.attachEventListeners();
    this.hideNonMain();
  }

  /////////////////////////////////////// METHODS ////////////////////////////////////

  getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.loadMap.bind(this),
        this.onError.bind(this)
      );
    }
  }

  /////////////////////////////////////

  onError() {
    alert(
      "Geolocation has been either denied or is not supported by this browser!"
    );
  }

  //////////////////////////////////////

  loadMap(position) {
    console.log("Geolocation has been allowed and is active!");

    // getting coordinates
    const coords = [position.coords.latitude, position.coords.longitude];

    // build and render map

    // initialize the map on the "map" div with a given center and zoom

    this.map = L.map("map").setView(coords, 4.25);

    L.tileLayer(
      "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}",
      {
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: "abcd",
        ext: "png",
      }
    ).addTo(this.map);

    // after map renders - do api call

    this.getCountriesData();

    //
  }

  /////////////////////////////////////////

  getCountriesData() {
    const request = new XMLHttpRequest();

    request.open("GET", "https://restcountries.com/v2/all");

    request.send();

    request.addEventListener("load", function () {
      const countryInformation = [];

      const [...data] = JSON.parse(this.responseText);

      // convert to array
      const countriesInfo = Object.entries(data);

      const info = countriesInfo.flatMap((el) => el[1]);

      // push new info to new array for reference
      countryInformation.push(info);

      const countriesArray = countryInformation.flat();

      // build HTML for NAV
      //5 regions: Africa, Americas, Asia, Europe, Oceania

      //make reference arrays for each region?

      const africa = [];
      const americas = [];
      const asia = [];
      const europe = [];
      const oceania = [];
      const other = [];

      // if country belongs to certain region - push to that array

      countriesArray.forEach((country) => {
        if (country.region === "Africa") {
          africa.push(country);
        }
        if (country.region === "Americas") {
          americas.push(country);
        }
        if (country.region === "Asia") {
          asia.push(country);
        }
        if (country.region === "Europe") {
          europe.push(country);
        }
        if (country.region === "Oceania") {
          oceania.push(country);
        }
        if (
          country.region !== "Africa" &&
          country.region !== "Oceania" &&
          country.region !== "Europe" &&
          country.region !== "Asia" &&
          country.region !== "Americas" &&
          country.region !== "Africa"
        ) {
          other.push(country);
        }
      });

      console.log(africa, americas, asia, europe, oceania, other);

      ///////build country name links HTML for NAV and insert: //////////////////////////////////////////////////////////////////

      // AFRICA

      africa.forEach((country) => {
        let navHTML = `
           <p class='country-name'>${country.name}</p>
        `;
        africaCountryContainer.insertAdjacentHTML("beforeend", navHTML);
      });

      // AMERICAS

      americas.forEach((country) => {
        let navHTML2 = `
           <p class='country-name'>${country.name}</p>
        `;
        americasCountryContainer.insertAdjacentHTML("beforeend", navHTML2);
      });

      // ASIA

      asia.forEach((country) => {
        let navHTML3 = `
           <p class='country-name'>${country.name}</p>
        `;
        asiaCountryContainer.insertAdjacentHTML("beforeend", navHTML3);
      });

      // EUROPE

      europe.forEach((country) => {
        let navHTML4 = `
           <p class='country-name'>${country.name}</p>
        `;
        europeCountryContainer.insertAdjacentHTML("beforeend", navHTML4);
      });

      // OCEANIA

      oceania.forEach((country) => {
        let navHTML5 = `
           <p class='country-name'>${country.name}</p>
        `;
        oceaniaCountryContainer.insertAdjacentHTML("beforeend", navHTML5);
      });

      // OTHERS

      other.forEach((country) => {
        let navHTML6 = `
           <p class='country-name'>${country.name}</p>
        `;
        otherCountryContainer.insertAdjacentHTML("beforeend", navHTML6);
      });

      //////// EVENT DELEGATION FOR EACH COUNTRY IN LIST ////////////////////

      nav.addEventListener("click", function (e) {
        if (e.target.classList.contains("country-name")) {
          // GET SELECTED COUNTRY
          const clicked = e.target;
          const selectedCountry = countriesArray.find(
            (el) => el.name === clicked.textContent
          );

          console.log(selectedCountry);

          // RENDER LOCATION ON MAP
          const selectedCountryCoords = [
            selectedCountry.latlng[0],
            selectedCountry.latlng[1],
          ];

          map.remove();

          const mapHtml = `<div class='map' id='map'></div></div>`;
          mapContainer.insertAdjacentHTML("beforeend", mapHtml);

          const renderMap = function (coords) {
            const map = L.map("map", {
              minZoom: 0,
              maxZoom: 18,
            }).setView(coords, 5.25);

            L.tileLayer(
              "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}",
              {
                attribution:
                  'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                subdomains: "abcd",
                ext: "png",
              }
            ).addTo(map);
          };

          renderMap(selectedCountryCoords);

          // POPULATE FIELDS WITH DATA
          //
          // build HTML for info container
          //

          const countryText = document.querySelector(".about-heading");
          const capitalText = document.querySelector(".capital-text");
          const populationText = document.querySelector(".population-text");
          const regionText = document.querySelector(".region-text");
          const subregionText = document.querySelector(".subregion-text");
          const languageText = document.querySelector(".language-text");
          const currencyText = document.querySelector(".currency-text");
          const flagTextImage = document.querySelector(".flag-img");

          countryText.textContent = selectedCountry.name;
          capitalText.textContent = selectedCountry.capital;
          populationText.textContent = selectedCountry.population;
          regionText.textContent = selectedCountry.region;
          subregionText.textContent = selectedCountry.subregion;

          languageText.textContent =
            selectedCountry.languages.length === 1
              ? selectedCountry.languages[0].name
              : selectedCountry.languages[0].name +
                " and " +
                selectedCountry.languages[1].name;

          currencyText.textContent =
            selectedCountry.currencies.length === 1
              ? selectedCountry.currencies[0].name +
                " (" +
                selectedCountry.currencies[0].symbol +
                ")"
              : selectedCountry.currencies[0].name +
                " (" +
                selectedCountry.currencies[0].symbol +
                ") " +
                " and " +
                selectedCountry.currencies[1].name +
                " (" +
                selectedCountry.currencies[1].symbol +
                ")";

          flagTextImage.src = selectedCountry.flag;
        }

        if (!e.target.classList.contains("country-name")) {
          return;
        }
      });

      console.log(countryInformation);
    });

    // NEED to add event listener for clicking again on map
    // and populating the field data with clicked MAP country
  }

  //////////////////////////////////////////////

  ///// HANDLING HOME CLICK, ABOUT CLICK, AND FLAGS CLICK
  /////////////////////////////////////////

  attachEventListeners = function () {
    // when done with project -> attach site link to home button in index for a refresh/home
    const aboutBtn = document.querySelector(".about");
    const flagsBtn = document.querySelector(".flags-box");
    const aboutContent = document.querySelector(".about-project-section");
    const flagsContent = document.querySelector(".flags-section");
    const flagsContainer = document.querySelector(".flags-container");
    const homeBtn = document.querySelector(".home");

    // ABOUT BUTTON

    const handleAboutClick = function () {

      mainContainer.style.display = 'none';
      aboutContent.classList.remove('hidden');

      console.log(flagsContainer.children);

      navContainer.classList.toggle("fade-away");
      mainContainer.classList.toggle("fade-away");

      if (
        !navContainer.classList.contains("hidden") &&
        !mainContainer.classList.contains("hidden")
      ) {
        navContainer.classList.toggle("hidden");
        mainContainer.classList.toggle("hidden");
      }

      aboutContent.style.display = "flex";
      aboutContent.classList.toggle("fade-in");

      document.body.style.background = `radial-gradient(circle, rgba(128,60,167,0.1) 25%, rgba(70,96,252,0.25) 91%)`;

      flagsContainer.style.display = "none";


    };

    aboutBtn.addEventListener("click", handleAboutClick);

    // FLAGS BUTTON

    const handleFlagsClick = function () {

        mainContainer.style.display = 'none';
        flagsContainer.style.display = 'flex';

      
        aboutContent.style.display = "none";
        flagsContent.style.display = "flex";
 
        
      navContainer.classList.toggle("fade-away");
      mainContainer.classList.toggle("fade-away");

      if (
        !navContainer.classList.contains("hidden") &&
        !mainContainer.classList.contains("hidden")
      ) {
        navContainer.classList.toggle("hidden");
        mainContainer.classList.toggle("hidden");
      }

      document.body.style.background = `linear-gradient(90deg, rgba(113,113,113,0.788377216045673) 1%, rgba(135,12,138,0.15) 78%)`;

      // ANOTHER API CALL TO GET ALL COUNTRY FLAGS:

      const request = new XMLHttpRequest();

      request.open("GET", "https://restcountries.com/v2/all");

      request.send();

      request.addEventListener("load", function () {
        const countryInformation = [];

        const [...data] = JSON.parse(this.responseText);

        // convert to array
        const countriesInfo = Object.entries(data);

        const info = countriesInfo.flatMap((el) => el[1]);

        // push new info to new array for reference
        countryInformation.push(info);

        const countriesArray = countryInformation.flat();

        countriesArray.forEach((country) => {
          if (country.flag) {
            const flagHtml = `<div class='country-flag'>
            <img class='country-flag-image' src='${country.flag}'>
                              <p class='flag-name'> ${country.name}</p>
                              </div>`;
            console.log("hi");

            flagsContainer.insertAdjacentHTML("beforeend", flagHtml);
          }
        });
      });
    };

    flagsBtn.addEventListener("click", handleFlagsClick);
    

    // HANDLE HOME 

    const handleHomeClick = function(){
      mainContainer.style.opacity = 1;
      mainContainer.style.display = 'flex';
      navContainer.classList.remove("fade-away");
      mainContainer.classList.remove("fade-away");
      navContainer.classList.remove("hidden");
      mainContainer.classList.remove("hidden");

      aboutContent.style.display='none';
      flagsContent.style.display = 'none';

      console.log('home click');
    }

    homeBtn.addEventListener('click', handleHomeClick);
  };

  

  ////////////////////////////////////////

  hideNonMain() {
    const aboutContent = document.querySelector(".about-project-section");
    const flagsContent = document.querySelector(".flags-section");

    aboutContent.style.display = "none";
    flagsContent.style.display = "none";
  }
}

const app = new App();
