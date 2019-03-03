const TERMS = ["cats", "mugs", "cars", "blue"];

function renderButtons() {
    $("#div-button").empty();

    TERMS.forEach(function (term, index) {
        var d = $('<div class="btn-group mr-sm-2 mb-2 float-left">');
        var b1 = $(`<button class="btn btn-primary" data-term=${term}>`)
            .text(term);
        var b2 = $(`<button class="btn btn-outline-danger btn-sm" data-index=${index}>`)
            .html("&times;");
        d.append(b1, b2);
        $("#div-button").append(d);
        
    });

    var f = $("<form class='form-inline float-left'>");
    var l = $('<label for="add-more-input" class="text-primary mr-sm-2">')
        .append($('<i class="far fa-arrow-alt-circle-left fa-2x">'));
    var i = $('<input type="text" class="form-control mr-sm-2" id="add-more-input">');
    var b = $('<button type="submit" class="btn btn-outline-primary" id="add-more-button">')
        .text("add more");
    f.append(l, i, b);
    $("#div-button").append(f);

}

renderButtons();

function fetchGifs(term) {
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + term + "&api_key=dc6zaTOxFJmzC&limit=10";

    $.ajax({
        url: queryURL,
        method: "GET"

    }).then(function (response) {
        var results = response.data;

        for (var i = 0; i < results.length; i++) {
            var gifDiv = $("<div>");
            gifDiv.addClass("float-left mr-3")
            var rating = results[i].rating;

            var p = $("<p>").text("Rating: " + rating);

            var personImage = $("<img>").attr("src", results[i].images.fixed_height.url);

            gifDiv.prepend(p);
            gifDiv.prepend(personImage);

            $("#div-gif").prepend(gifDiv);
        }
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
        renderButtons();
        return;

    }

    if (index) { // index !== undefined
        TERMS.splice(index, 1);
        renderButtons();
        return;

    }

});