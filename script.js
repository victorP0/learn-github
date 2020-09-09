'use strict';

const key = "27b52f3cd6fc4b49a9d3460e3f593f0b"

function displayDishResults(paired) {
fetch(`https://api.spoonacular.com/food/wine/dishes?wine=${paired}&apiKey=${key}`)
            .then(response => response.json())
            .then(responseJson => getDish(responseJson))
            .catch(error => console.log('Cuisine went wrong'));
}

function wineItemTemplate(productMatch) {
  return `<h2>${productMatch.title}</h2>
        <a href="${productMatch.link}" target="_blank"><img src="${productMatch.imageUrl}" 
        alt="Photo of ${productMatch.title}"/>
        </a>`
}

function wineDescriptionTemplate(description, pairingText){
  return `<pre><h3>Wine:</h3>${description.title}</pre>
        <pre><h3>Description:</h3>${description.description}</pre>
        <pre><h3>Details:</h3>${pairingText}</pre>`
}

function pairedWineTemplate (pairedWines){
    const paired = [];
    for (let i = 0; i < pairedWines.length; i++) {
        paired.push(`<li class="wine-description">
                      <span class="wine-name">${pairedWines[i]}</span>
                      <span class="wineText"></span>
                      </li>`);
    }
  return `
        <ul class="paired">
        <h3>Paired Wines (Hover to find out more):</h3>
        ${paired.join('')}
        </ul>`
}

function displayWineResults(responseJson, searchTerm) {
    // if there are previous results, remove them
    $('#itemName').empty();
    $('#pairedWine').empty();
    $('#descriptionText').empty();

    // create list for paired Wines


    $('#itemName').html(wineItemTemplate(responseJson.productMatches[0]));
        
    $('#pairedWine').html(pairedWineTemplate(responseJson.pairedWines));

    $('.wine-description').hover( function() {

      if ($(this).children('.wineText').html() === '' ){
        fetch(`https://api.spoonacular.com/food/wine/dishes?wine=${$(this).children('.wine-name').text()}&apiKey=${key}`)
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
            
    $('#descriptionText').html(wineDescriptionTemplate(responseJson.productMatches[0], responseJson.pairingText))


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
        fetch(`https://api.spoonacular.com/food/wine/pairing?food=${searchTerm}&apiKey=27b52f3cd6fc4b49a9d3460e3f593f0b`)
            .then(response => response.json())
            .then(responseJson => displayWineResults(responseJson,searchTerm))
            .catch(error => {errorMessage();}
            );
    });
}

  $('section').keyup(function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   $('#food-submit').click();  
   }
});  
$(watchFoodButton);
