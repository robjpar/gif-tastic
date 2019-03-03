const TERMS = ["cats", "mugs", "cars", "blue", "glue", "wire", "button", "plastic", "stars"];

function renderButtons() {
    $("#div-button").empty();

    TERMS.forEach(function (term, index) {
        var d = $('<div class="btn-group mr-sm-2 mb-2 float-left">');
        var b1 = $(`<button class="btn btn-primary" data-term=${term}>${term}</button>`);
        var b2 = $(`<button class="btn btn-outline-danger btn-sm" data-index=${index}>&times;</button>`);
        d.append(b1, b2);
        $("#div-button").append(d);
    });

    var f = $('<form class="form-inline float-left">');
    var l = $('<label for="add-more-input" class="text-primary mr-sm-2">')
        .append($('<i class="far fa-hand-point-left fa-2x">'));
    var i = $('<input type="text" class="form-control mr-sm-2" id="add-more-input">');
    var b = $('<button type="submit" class="btn btn-outline-primary" id="add-more-button">add more</button>');
    f.append(l, i, b);
    $("#div-button").append(f);
}

renderButtons();

function fetchGifs(term) {
    var queryURL = "https://api.giphy.com/v1/gifs/search?";

    var queryParams = {
        api_key: "dc6zaTOxFJmzC",
        q: term,
        limit: 10
    };

    $.ajax({
        url: queryURL + $.param(queryParams),
        method: "GET"
    }).then(renderGifs);
}

function renderGifs(response) {
    $("#div-gif").empty();

    var data = response.data;

    data.forEach(function (gif) {
        var title = gif.title;
        var rating = gif.rating;
        var urlStill = gif.images.fixed_height_still.url;
        var urlAnimate = gif.images.fixed_height.url;
        var urlOriginal = gif.images.original.url;

        var d = $('<div class="card float-left mr-3 mb-3" style="height:400px">');
        var i = $(`<img class="card-img-top gif" src=${urlStill} alt=${title} style="width:100%">`)
            .attr("data-still", urlStill)
            .attr("data-animate", urlAnimate)
            .attr("data-state", "still");
        var d2 = $('<div class="card-body">')
            .append(`<h4 class="card-title">${title}</h4>`)
            .append(`<p class="card-text">Rating: ${rating}</p>`)
            .append(`<a href=${urlOriginal} target="_blank" class="btn btn-outline-primary btn-sm float-right">see original</a>`);
        d.append(i, d2);
        $("#div-gif").append(d);
    });
}

$(document).on("click", "button", function () {
    event.preventDefault();

    var newTerm = $("#add-more-input").val().trim();

    var id = $(this).attr("id");
    var term = $(this).attr("data-term");
    var index = $(this).attr("data-index");

    if (newTerm && id === "add-more-button") {
        TERMS.push(newTerm);
        renderButtons();
        return;
    }

    if (term) {
        fetchGifs(term);
        return;
    }

    if (index) { // index !== undefined
        TERMS.splice(index, 1);
        renderButtons();
        return;
    }
});

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