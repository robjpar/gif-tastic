// Initial retrieval of the `terms` list from the local storage or initial setup if not found there
// or found but empty
const TERMS_INITIAL = ["cats", "mugs", "cars", "blue", "glue", "wire", "button", "plastic", "stars"];
var terms = JSON.parse(localStorage.getItem("terms"));
if (!Array.isArray(terms) || !terms.length) {
    terms = TERMS_INITIAL;
}

// Rendering the buttons on the page
function renderButtons() {
    $("#div-button").empty();

    // Rendering the buttons on the page based on the `terms` list
    terms.forEach(function (term, index) {
        var d = $('<div class="btn-group mr-2 mb-2 float-left">');
        var b1 = $(`<button class="btn btn-primary" data-term=${term}>${term}</button>`);
        var b2 = $(`<button class="btn btn-outline-danger btn-sm" data-index=${index}>&times;</button>`);
        d.append(b1, b2);
        $("#div-button").append(d);
    });

    // Rendering the input box and button
    var f = $('<form class="form-inline float-left">');
    var l = $('<label for="add-more-input" class="text-primary mr-2 mb-2">')
        .append($('<i class="far fa-hand-point-left fa-2x">'));
    var i = $('<input type="text" class="form-control mr-sm-2 mb-2" id="add-more-input">');
    var b = $('<button type="submit" class="btn btn-outline-primary mb-2" id="add-more-button">add more</button>');
    f.append(l, i, b);
    $("#div-button").append(f);

    // Storing the `terms` list in the local storage
    localStorage.setItem("terms", JSON.stringify(terms));
}

// Initial rendering of the buttons on the page
renderButtons();

// Fetching the gifs from the GIPHY API
function fetchGifs(term) {
    var queryURL = "https://api.giphy.com/v1/gifs/search?";

    var queryParams = {
        api_key: "dc6zaTOxFJmzC",
        q: term,
        limit: 10 // # of gifs fetched per call
    };

    $.ajax({
        url: queryURL + $.param(queryParams),
        method: "GET"
    }).then(renderGifs);
}

// Rendering the gifs on the page
function renderGifs(response) {
    $("#div-gif").empty();

    var data = response.data;

    data.forEach(function (gif) {
        // Getting the gif's metadata
        var title = gif.title;
        var rating = gif.rating;
        var urlStill = gif.images.fixed_height_still.url;
        var urlAnimate = gif.images.fixed_height.url;
        var urlOriginal = gif.images.original.url;

        // Creating a card for the gif
        var d = $('<div class="card float-left mr-sm-3 mb-3" style="height:400px; max-width: 400px">');
        var i = $(`<img class="card-img-top gif" src=${urlStill} alt=${title} style="width:100%">`)
            .attr("data-still", urlStill)
            .attr("data-animate", urlAnimate)
            .attr("data-state", "still");
        var d2 = $('<div class="card-body">')
            .append(`<h4 class="card-title">${title}</h4>`)
            .append(`<p class="card-text">Rating ${rating}</p>`)
            .append(`<a href=${urlOriginal} target="_blank" class="btn btn-outline-primary btn-sm float-right">see original</a>`);
        d.append(i, d2);
        $("#div-gif").append(d);
    });
}

// Main on-click handler
$(document).on("click", "button", function () {
    event.preventDefault();

    var newTerm = $("#add-more-input").val().trim();

    var id = $(this).attr("id");
    var term = $(this).attr("data-term");
    var index = $(this).attr("data-index");

    // Adding a term button
    if (newTerm && id === "add-more-button") { // newTerm !== undefined
        terms.push(newTerm);
        renderButtons();
        return;
    }

    // Fetching and rendering gifs
    if (term) { // term !== undefined
        fetchGifs(term);
        return;
    }

    // Deleting a term button
    if (index) { // index !== undefined
        terms.splice(index, 1);
        renderButtons();
        return;
    }
});

// Still/animate action on a click on the gif
$(document).on("click", ".gif", function () {
    var state = $(this).attr("data-state");

    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");

    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
});