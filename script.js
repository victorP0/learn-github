'use strict';

function displayDishResults(paired) {
fetch(`https://api.spoonacular.com/food/wine/dishes?wine=${paired}&apiKey=27b52f3cd6fc4b49a9d3460e3f593f0b`)
            .then(response => response.json())
            .then(responseJson => getDish(responseJson))
            .catch(error => console.log('Cuisine went wrong'));
}

function displayWineResults(responseJson, searchTerm) {
    // if there are previous results, remove them
    $('#itemName').empty();
    $('#pairedWine').empty();
    $('#descriptionText').empty();

    // create list for paired Wines
    const paired = [];
    for (let i = 0; i < responseJson.pairedWines.length; i++) {
        paired.push(`<li class="wine-description">
                      <span class="wine-name">${responseJson.pairedWines[i]}</span>
                      <span class="wineText"></span>
                      </li>`);
    }
    console.log("Value of paired is " + paired);

    $('#itemName').html(`
        <h2>${responseJson.productMatches[0].title}</h2>
        <a href="${responseJson.productMatches[0].link}" target="_blank"><img src="${responseJson.productMatches[0].imageUrl}" 
        alt="Photo of ${responseJson.productMatches.title}"/>
        </a>`)

    $('#pairedWine').html(`
        <ul class="paired">
        <h3>Paired Wines (Hover to find out more):</h3>
        ${paired.join('')}
        </ul>`)

    $('.wine-description').hover( function() {

      if ($(this).children('.wineText').html() === '' ){
        fetch(`https://api.spoonacular.com/food/wine/dishes?wine=${$(this).children('.wine-name').text()}&apiKey=27b52f3cd6fc4b49a9d3460e3f593f0b`)
        .then(response => response.json())
        .then(responseJson => {
                  $(this).children('.wineText').html(("<toolTip>" + "<li>" + responseJson['text'] + "</li>" + "</toolTip>" )); 
              })
        .catch(error => console.log('Cuisine went wrong. Error was ' + error));} else {
        $(this).children('.wineText').find( "toolTip" ).last().show();  
        }},  

    //hover away
    function(e){
      $(this).children('.wineText').find( "toolTip" ).last().hide();  
    });
            

    $('#descriptionText').html(` 
        <pre><h3>Wine:</h3>${responseJson.productMatches[0].title}</pre>
        <pre><h3>Description:</h3>${responseJson.productMatches[0].description}</pre>
        <pre><h3>Details:</h3>${responseJson.pairingText}</pre>
        `)

  //display the results section  
    $('#results').removeClass('hidden');
    $('#intro').removeClass('hidden');
}

function errorMessage (){
    // if there are previous results, remove them
    $('#itemName').empty();
    $('#pairedWine').empty();
    $('#descriptionText').empty(); 
    $('#intro').addClass('hidden');

    //show error message
    $('#descriptionText').html(
      `<br> <p>Unfortunately we cannot find a match for the food you entered, please try another food :)</p>`)
    
    $('#results').removeClass('hidden');
}



function watchFoodButton() {
    $('section').on('click', '#food-submit', event => {
        event.preventDefault();
        const searchTerm = $('#food-input').val();
        console.log('searchTerm is ' + searchTerm);
        fetch(`https://api.spoonacular.com/food/wine/pairing?food=${searchTerm}&apiKey=27b52f3cd6fc4b49a9d3460e3f593f0b`)
            .then(response => response.json())
            .then(responseJson => displayWineResults(responseJson,searchTerm))
            .catch(error => {console.log('Food went wrong. Error was ' + error); errorMessage();}
            );
    });
}

$(watchFoodButton);
