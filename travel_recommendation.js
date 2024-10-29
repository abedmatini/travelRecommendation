document.addEventListener("DOMContentLoaded", () => {
    const resultsContainer = document.getElementById("recommendation-results");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const resetButton = document.getElementById("reset-button");

    // Fetch travel data from the JSON file
    fetch("travel_recommendation_api.json")
        .then(response => response.json())
        .then(data => {
            const countries = data.countries;

            // Event listener for search button
            searchButton.addEventListener("click", () => {
                const query = searchInput.value.toLowerCase().trim();
                if (query) {
                    displaySearchResults(query, countries);
                }
            });

            // Event listener for reset button
            resetButton.addEventListener("click", () => {
                searchInput.value = "";
                resultsContainer.innerHTML = ""; // Clear results
            });
        })
        .catch(error => console.error("Error fetching data:", error));

    // Function to display search results
    function displaySearchResults(query, countries) {
        resultsContainer.innerHTML = ""; // Clear previous results

        // Keywords mapping for flexibility
        const keywordMapping = {
            "beach": ["beach", "beaches"],
            "temple": ["temple", "temples"],
            "country": ["australia", "japan"] // Add other countries as needed
        };

        countries.forEach(country => {
            country.cities.forEach(city => {
                // Check for matches with keywords or city/country names
                if (matchQuery(query, city, country, keywordMapping)) {
                    // Create and display result card if a match is found
                    const cityCard = createCityCard(city);
                    resultsContainer.appendChild(cityCard);
                }
            });
        });
    }

    // Function to match the query with keywords
    function matchQuery(query, city, country, keywordMapping) {
        const lowerCityName = city.name.toLowerCase();
        const lowerCountryName = country.name.toLowerCase();

        // Check if query matches city or country name
        if (lowerCityName.includes(query) || lowerCountryName.includes(query)) {
            return true;
        }

        // Check if query matches any keyword variations
        for (const [keyword, variations] of Object.entries(keywordMapping)) {
            if (variations.includes(query)) {
                return true;
            }
        }

        return false;
    }

    // Function to create a city card element
    function createCityCard(city) {
        const cityCard = document.createElement("div");
        cityCard.classList.add("city-card");

        const cityImage = document.createElement("img");
        cityImage.src = city.imageUrl;
        cityImage.alt = city.name;

        const cityName = document.createElement("h2");
        cityName.textContent = city.name;

        const cityDescription = document.createElement("p");
        cityDescription.textContent = city.description;

        cityCard.appendChild(cityImage);
        cityCard.appendChild(cityName);
        cityCard.appendChild(cityDescription);

        return cityCard;
    }
});
