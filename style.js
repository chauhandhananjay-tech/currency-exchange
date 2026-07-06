// Base URL for the new working API
const BASE_URL = "https://open.er-api.com/v6/latest";

// Selecting HTML elements from the DOM
const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromcurr = document.querySelector(".from select");
const tocurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapicon = document.querySelector(".fa-arrow-right-arrow-left");

// 1. Logic to update the country flags
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// 2. Populating the dropdowns with currency codes
for (let select of dropdown) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        // Setting default dropdown values to USD and INR
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }

        select.append(newOption);
    }
    updateFlag(select);

    // Updating the flag whenever the dropdown selection changes
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// 3. Fetching live exchange rate on button click
btn.addEventListener("click", async (evt) => {
    evt.preventDefault(); // Preventing the default form submission behavior

    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    // Handling empty or invalid inputs (setting default to 1)
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    // NEW API CONVERT TO UPPERCASE
    const fromCurrCode = fromcurr.value.toUpperCase();
    const toCurrCode = tocurr.value.toUpperCase();

    // Constructing the final API URL 
    const URL = `${BASE_URL}/${fromCurrCode}`;

    try {
        let response = await fetch(URL);
        let data = await response.json();

        // NEW API  data.rates 
        let rate = data.rates[toCurrCode];

        // Calculating the final converted amount (rounded to 2 decimal places for better UI)
        let finalAmount = (amtVal * rate).toFixed(2);

        // Converting currency codes to full names (e.g., USD -> US Dollar) using Intl API
        const currencyNames = new Intl.DisplayNames(['en'], { type: 'currency' });
        let fromFullName = currencyNames.of(fromCurrCode);
        let toFullName = currencyNames.of(toCurrCode);

        // Formatting the output with html
        msg.innerHTML = `${amtVal} ${fromFullName} equals <br> 
                            <span style="font-size: 1.8rem; font-weight: 500; color: #202124;">
                                ${finalAmount} ${toFullName}
                            </span>`;

    } catch (error) {
        // Handling API fetch errors
        console.error("API Error:", error);
        msg.innerText = "Error fetching the exchange rate. Please try again later!";
    }
});
swapicon.addEventListener("click", () => {
    // Swapping the selected values of the dropdowns
    let temp = fromcurr.value;
    fromcurr.value = tocurr.value;
    tocurr.value = temp;

    // Updating the flags after swapping
    updateFlag(fromcurr);
    updateFlag(tocurr);

    // Triggering the button click event to fetch the new exchange rate after swapping
    btn.click();
});
