/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for(const game of games) {

        // create a new div element, which will become the game card
        const newDiv = document.createElement("div");

        // add the class game-card to the list
        newDiv.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        console.log(game.name);

        // calculate percentage of pledge that was achieved, and change colors depending on if the goal was completed or not
        const percent = (game.pledged / game.goal) * 100;
        const progressColor = percent >= 100 ? '#9bfc92' : '#fc9292';

        // template literal for game card contents: image, name, description, backers, and a progress bar
        newDiv.innerHTML = `
            <img src="${game.img}" class="game-img" />
            <p><b>${game.name}</b></p>
            <p>${game.description}</p>
            <div class="bottom-content">
                <p>Backers: ${game.backers} </p>
                <div class="progressBarContainer">
                    <div class="progressBar" style="width: ${percent < 100 ? percent : 100}%; white-space: nowrap; background-color: ${progressColor}">
                        <p>$${game.pledged.toLocaleString('US-en')} / $${game.goal.toLocaleString('US-en')}</p>
                    </div>       
                </div>
            </div>
        `;
       // innerHTML has a security risk, in that the contents can be manipulated to change the website, however, this is using information from the website itself, so it should be safe
       
        // append the game to the games-container
        gamesContainer.appendChild(newDiv);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((acc, game) => {
    return acc + game.backers;
}, 0) // reduce backers in games into one variable, initial value of 0

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `
    <p>${totalContributions.toLocaleString('en-US')}</p>
`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce((acc, game) => {
    return acc + game.pledged;
}, 0)

// set inner HTML using template literal
raisedCard.innerHTML = `
    <p>$${totalRaised.toLocaleString('en-US')}</p>
`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const totalGames = GAMES_JSON.reduce((acc, game) => {
    return acc + 1; // 1 for each game, as just adding game would be adding the object
}, 0)

// change formatting for the gamesCard
gamesCard.innerHTML = `
    <p>${totalGames.toLocaleString('en-US')}</p>
`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// passing an element through adds a "clicked" style element and removes "notclicked"
function toggleClick(element) {
    element.classList.add('clicked');
    element.classList.remove('notclicked');
}

// passing an element through adds a "notclicked" style element and removes "clicked"
function toggleNotclicked(element) {
    element.classList.add('notclicked');
    element.classList.remove('clicked');
}

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let listUnfunded = GAMES_JSON.filter((game) => {
        return game.pledged < game.goal;
    });
    
    console.log(listUnfunded.length);

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(listUnfunded);

    // set the unfunded-btn to active
    toggleClick(document.getElementById("unfunded-btn"));
    toggleNotclicked(document.getElementById("funded-btn"));
    toggleNotclicked(document.getElementById("all-btn"));
}
//filterUnfundedOnly(); // testing

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let listFunded = GAMES_JSON.filter((game) => {
        return game.pledged >= game.goal;
    });
    
    console.log(listFunded.length);

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(listFunded);

    // set the funded-btn to active
    toggleNotclicked(document.getElementById("unfunded-btn"));
    toggleClick(document.getElementById("funded-btn"));
    toggleNotclicked(document.getElementById("all-btn"));
}
//filterFundedOnly(); // testing

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);

    console.log(GAMES_JSON.length);

    // set the all-btn to active
    toggleNotclicked(document.getElementById("unfunded-btn"));
    toggleNotclicked(document.getElementById("funded-btn"));
    toggleClick(document.getElementById("all-btn"));
}
//showAllGames(); // testing

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

// return game JSON that includes text input into the function/search bar
function returnSearch(text) {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let searchGames = GAMES_JSON.filter((game) => {
        return game.name.toUpperCase().includes(text.toUpperCase());
    });

    addGamesToPage(searchGames);

    // set all buttons to inactive
    toggleNotclicked(document.getElementById("unfunded-btn"));
    toggleNotclicked(document.getElementById("funded-btn"));
    toggleNotclicked(document.getElementById("all-btn"));
}

// grab text from the search bar, and add an event listener that uses the function above to return the game that matches the search
const searchBar = document.getElementById("search");
searchBar.addEventListener("input", (event) => {
    returnSearch(event.target.value);
});

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let listUnfunded = GAMES_JSON.filter((game) => {
    return game.pledged < game.goal;
});

const unfundedCount = listUnfunded.length;

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${totalRaised.toLocaleString('en-US')} has been raised for ${totalGames} games. Currently, ${unfundedCount} game${unfundedCount == 1 ? "" : 's'} remain${unfundedCount == 1 ? 's' : ""} unfunded. We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container
const descriptionDiv = document.createElement("p");
descriptionDiv.innerHTML = displayStr;

descriptionContainer.appendChild(descriptionDiv);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

// sort games based on amound pledged
const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
let [firstGame, secondGame, ...others] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
console.log(`first: ${firstGame.name}`);
console.log(`second: ${secondGame.name}`);

const firstGameDiv = document.createElement("p");

firstGameDiv.innerHTML = `
    ${firstGame.name}
`;

// change the first game container to represent a bubble visually
firstGameContainer.appendChild(firstGameDiv);
firstGameContainer.style.borderRadius = '50%';
firstGameContainer.style.width = '400px';
firstGameContainer.style.minWidth = '300px';
firstGameContainer.style.height = '300px';
firstGameContainer.style.minHeight = '200px';
firstGameContainer.style.backgroundColor = " rgba(255, 255, 255, 0.3)";
firstGameContainer.style.border = "5px, solid, white";

// do the same for the runner up item
const secondGameDiv = document.createElement("p");

secondGameDiv.innerHTML = `
    ${secondGame.name}
`;

// change the second game container to represent a bubble visually
secondGameContainer.appendChild(secondGameDiv);
secondGameContainer.style.borderRadius = '50%'
secondGameContainer.style.width = '200px';
secondGameContainer.style.minWidth = '150px';
secondGameContainer.style.height = '150px';
secondGameContainer.style.minHeight = '100px';
secondGameContainer.style.backgroundColor = " rgba(255, 255, 255, 0.3)";
secondGameContainer.style.border = "5px, solid, white";

