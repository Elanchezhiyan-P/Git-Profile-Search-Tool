var GitUrl = 'https://api.github.com/users/';
var RepoURL = 'https://api.github.com/users/'

$(document).ready(function () {
    $(".btn-reset, .btn-search").addClass("disabled");

    $(".git-profile-id").keyup(function () {
        if ($(".git-profile-id").val() == "") {
            $(".btn-reset").addClass("disabled");
        }
        else {
            $(".btn-reset").removeClass("disabled");
        }
    });

    $(".git-profile-id").keyup(function () {
        if ($(".git-profile-id").val() == "") {
            $(".btn-search").addClass("disabled");
        }
        else {
            $(".btn-search").removeClass("disabled");
        }
    });

});

function fnSearchGitProfile() {
    /* Disabling fields */
    $(".git-profile-id").addClass("disabled");
    $(".btn-search").addClass("disabled");

    /*getting details and checking with github API*/
    var profileName = $(".git-profile-id").val().trim()
    var url = GitUrl + profileName;
    $.ajax({
        type: "GET",
        url: String(url),
        accept: "application/json",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        enabledTransports: ['ws', 'wss'],
        headers: [
            { "X-localization": localStorage.getItem("lan") },
            { "Access-Control-Allow-Origin": '*' },
            { "Access-Control-Allow-Headers": 'Origin, X-Requested-With, Content-Type, Accept ' },
            { "Access-Control-Allow-Methods": "POST, GET, PUT, OPTIONS, DELETE" },
            { "Access-Control-Max-Age": 3600 }
        ],
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (response) {
            //console.log(response);
            $(".profile-pic").attr("src", response.avatar_url);
            $(".git-name").text(response.name);
            $(".git-userURL").attr("href", response.html_url);
            $(".git-userURL").text(response.name);
            $(".git-userFollowers").text(response.followers);
            $(".git-userFollowing").text(response.following);
            $(".btn-reset").removeClass("disabled");
            $(".git-updatedAt").text(dateFormat(response.updated_at.replace('Z', ''), 'dd-MM-yyyy'));
            $(".git-createdAt").text(dateFormat(response.created_at.replace('Z', ''), 'dd-MM-yyyy'));
            $(".git-publicRepos").text(response.public_repos);
            $(".result-div-container").show();
        },
        error: function (xhr, state, error) {
        }
    });

    var reposURL = RepoURL + profileName + '/repos'

    $.ajax({
        type: "GET",
        url: String(reposURL),
        accept: "application/json",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        enabledTransports: ['ws', 'wss'],
        headers: [
            { "X-localization": localStorage.getItem("lan") },
            { "Access-Control-Allow-Origin": '*' },
            { "Access-Control-Allow-Headers": 'Origin, X-Requested-With, Content-Type, Accept ' },
            { "Access-Control-Allow-Methods": "POST, GET, PUT, OPTIONS, DELETE" },
            { "Access-Control-Max-Age": 3600 }
        ],
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (responses) {
            if (responses.length > 0) {
                var jsResult = '<tr><th>Repository Name</th><th>Repository URL</th></tr>'
                responses.forEach(function (data, index) {
                    jsResult = jsResult + '<tr><td>' + data.name + '</td><td><a href="' + data.html_url + '" target="_blank">' + data.html_url + '</a></td></tr>'
                });
                $(".Repos-div-container .listOfRepos").append(jsResult);
                $(".Repos-div-container").show();
            }
        },
        error: function (xhr, state, error) {
        }
    });
}

function fnReset() {
    $(".result-div-container, .Repos-div-container").hide();
    $(".git-profile-id").val('');
    $(".git-profile-id").removeClass("disabled");
    $(".btn-reset, .btn-search").addClass("disabled");
}

function dateFormat(inputDate, format) {
    //parse the input date
    const date = new Date(inputDate);

    //extract the parts of the date
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    //replace the month
    format = format.replace("MM", month.toString().padStart(2, "0"));

    //replace the year
    if (format.indexOf("yyyy") > -1) {
        format = format.replace("yyyy", year.toString());
    } else if (format.indexOf("yy") > -1) {
        format = format.replace("yy", year.toString().substr(2, 2));
    }

    //replace the day
    format = format.replace("dd", day.toString().padStart(2, "0"));

    return format;
}
