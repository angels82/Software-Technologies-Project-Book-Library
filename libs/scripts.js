const kinveyBaseUrl = "https://baas.kinvey.com/";
const kinveyAppKey = "kid_H1UCjY0U";
const kinveyAppSecret = "5d3f0cfe13ae4208bb4338b4ca7e5fdc";
let checker = 0;

function showView(viewID) {
    $('main > section').hide();
    $('#' + viewID).show();

}
function hideView(viewID) {
    //$('main > section').hide();
    $('#' + viewID).hide();

}


function showViewBooksHome() {
    showView('booksHome1');
}
function hideViewBooksHome() {
    hideView('booksHome1');
}


function showHomeView() {
    showView('viewHome');
}

function showLoginView() {
    showView('viewLogin');
}

function showRegisterView() {
    showView('viewRegister');

}

function showCreateBookView() {
    showView('viewCreateBook');
}

function listBooksView() {
    showView('viewBooks');
    listBooks();
}

function listBooksViewHome() {
    showView('viewBooksHome');
    //showHomeView();
    //listBooksHome();
}

$(function () {
    $("#linkHome").click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkRegister").click(showRegisterView);
    $("#linkListBooks").click(listBooksView);
    $("#linkCreateBook").click(showCreateBookView);
    $("#linkLogout").click(logout);
    showHomeView();
    showHideMenuLinks();
    //$("#formLogin").submit(login);
   // $("#buttonCreateBook").click(createBook);
   // $("#formRegister").submit(register);

    $("#formLogin").submit(function (e) {e.preventDefault(); login();});
    $("#formRegister").submit(function (e) {e.preventDefault(); register();});
    $("#formCreateBook").submit(function (e) {e.preventDefault(); createBook();});

    $(document).on({
        ajaxStart: function () {$("#loadingBox").show()},
        ajaxStop: function () {$("#loadingBox").hide()}
    })
    //log();
    //listBooksHome();
});

//if (sessionStorage.getItem('authtoken') !=null) {
  //  $("#linkHome").click(showViewBooksHome);
   // $("#linkLogin").click(hideViewBooksHome);
    //$("#linkRegister").click(hideViewBooksHome);
    //$("#linkListBooks").click(hideViewBooksHome);
    //$("#linkCreateBook").click(hideViewBooksHome);
    //$("#linkLogout").click(hideViewBooksHome);
//} else {
// $("#linkHome").click(hideViewBooksHome);
// $("#linkLogin").click(hideViewBooksHome);
//  $("#linkRegister").click(hideViewBooksHome);
//  $("#linkListBooks").click(hideViewBooksHome);
//  $("#linkCreateBook").click(hideViewBooksHome);
//  $("#linkLogout").click(hideViewBooksHome);
//}

function showHideMenuLinks() {
    //$("#linkHome").show();
    
    if (sessionStorage.getItem('authtoken') ==null) {
        $("#linkLogin").show();
        $("#linkRegister").show();
        $("#linkListBooks").hide();
        $("#linkCreateBook").hide();
        $("#linkLogout").hide();
    } else {
        $("#linkLogin").hide();
        $("#linkRegister").hide();
        $("#linkListBooks").show();
        $("#linkCreateBook").show();
        $("#linkLogout").show();
        listBooksHome();
    }
}



function register() {
    const kinveyRegisterUrl = kinveyBaseUrl + "user/" + kinveyAppKey + "/";
    let kinveyAuthHeaders = {
        Authorization: "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret),
    };
    kinveyAuthHeaders['Content-Type'] = "application/json";
    let username = $('#registerUser').val();
    let password = $('#registerPass').val();
    let method = "POST";

    let userData = {
        username: username,
        password: password

    };
    let request = {
        url:kinveyRegisterUrl,
        method: method,
        headers: kinveyAuthHeaders,
        data:JSON.stringify(userData),
        error: showError
    }
    $.ajax(request).then(function (response) {
        let userAuth = response._kmd.authtoken;
        sessionStorage.setItem('authtoken', userAuth);
        showViewBooksHome();
        showHomeView();
        showHideMenuLinks();
        registerSuccess();
        //error: handleAjaxError
    })
}

   


    




function handleAjaxError() {
    let errorMsg = JSON.stringify(data);
    if (data.readyState === 0) {
        errorMsg = "Connection failed due to network error!";
    }
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description;
    showError(errorMsg);
}

function login() {
    const kinveyLoginUrl = kinveyBaseUrl + "user/" + kinveyAppKey + "/login";
    let kinveyAuthHeaders = {
        Authorization: "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret)};
    kinveyAuthHeaders['Content-Type'] = "application/json";

    let username = $('#loginUser').val();
    let password = $('#loginPass').val();
    let method = "POST";
    let userData = {
        username: username,
        password: password

    };
    let request = {
        url:kinveyLoginUrl,
        method: method,
        headers: kinveyAuthHeaders,
        data:JSON.stringify(userData),
        error: showError
    };
    $.ajax(request).then(function (response) {
        let userAuth1 = response._kmd.authtoken;
        sessionStorage.setItem('authtoken', userAuth1);
        showHideMenuLinks();
        //function loginSuccess(response) {
            //let userAuth = response._kmd.authtoken;
            //sessionStorage.setItem('authToken', userAuth);
            //showHideMenuLinks();
            //listBooks();
        //listBooksViewHome();
        //hideViewBooksHome();
        showViewBooksHome();
        //listBooksHome();
        showHomeView();
            showInfo("You have successfully logged in!");
        //};
    });

}
function showInfo(message) {
    $("#infoBox").text(message).show().delay(3000).fadeOut();
    //setTimeout(function () {$('#infoBox').fadeOut()}, 2500);

}

function showError(data, status) {
    let errorMsg = "Error: " + JSON.stringify(data);
    if (data.responseJSON.error == "UserAlreadyExists")
        errorMsg = "Error: " + data.responseJSON.error;//Invalid credentials!";
    if (data.readyState === 0)
        errorMsg = "Connection failed due to network connection error!";
    if (data.responseJSON.error == "InvalidCredentials")
        errorMsg = "Error: " + data.responseJSON.error;
    $('#errorBox').text(errorMsg);
    $('#errorBox').show();
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0) 
        errorMsg = "Connection failed due to network error!";
    
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description;
    showError(errorMsg);
}

function logout(){
    sessionStorage.clear();
    showHideMenuLinks();
    showView('viewHome');
    //$("#viewBooks").hide();
    //$("#books").hide();
    hideViewBooksHome();
}

function createBook() {
    const kinveyBooksUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books";
    const kinveyAuthHeaders = {
        'Authorization': "Kinvey " + sessionStorage.getItem('authtoken')
    };
    let bookData = {
        title: $('#bookTitle').val(),
        author: $('#bookAuthor').val(),
        description: $('#bookDescription').val(),
        file:  $('#my_file').val()

    };
    hideViewBooksHome();
    $.ajax({
        method: "POST",
        url: kinveyBooksUrl,
        headers: kinveyAuthHeaders,
        data: bookData
        //success: createBooksSuccess,
        //error: handleAjaxError
    });

}

function listBooks() {
    $('#books').empty();
    showView('viewBooks');
    const kinveyBooksUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books";
    let authHeaders = {
        "Authorization": "Kinvey " + sessionStorage.authtoken
    };
    hideViewBooksHome();
    $.ajax({
        method: "GET",
        url: kinveyBooksUrl,
        headers: authHeaders,
        success: loadBooksSuccess
        //error: handleAjaxError

    });
}

function loadBooksSuccess(books, status) {
    //showInfo('Books loaded!');
    if (books.length == 0) {
        $('#books').text('There are no books in the library');
    } else {
        let booksTable = $('<table>')
            .append($('<tr>'))
            .append(
                '<th>Title</th>',
                '<th>Author</th>',
                '<th>Description</th>'

            );
        for (let book of books) {
            booksTable.append($('<tr>').append(
                $('<td></td>').text(book.title),
                $('<td></td>').text(book.author),
                $('<td></td>').text(book.description))


            );
        }
        $("#books").append(booksTable);
    }
}


//home page listings/////////////////////////////////////////////////////////////////////////////

function listBooksHome() {
    //$('#books').empty();
    //showView('viewBooks');
    if (checker < 1) {
        const kinveyBooksUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + '/books/?query={}&sort={"_kmd.ect": -1}&limit=3';
        let authHeaders = {
            "Authorization": "Kinvey " + sessionStorage.authtoken
        };

        $.ajax({
            method: "GET",
            url: kinveyBooksUrl,
            headers: authHeaders,
            success: loadBooksSuccessHome
            //error: handleAjaxError

        });
        
    }
}
function loadBooksSuccessHome(books, status) {
    //showInfo('Books loaded!');
    if (books.length == 0) {
        $('#books').text('There are no books in the library');
    } else {
        let booksTableHome = $('<aside>')
            //.append($('<tr>'))
            .append(
                '<span id="recentlyAddedBooks">Recently added books:</span>'
                //'<a href="site-home.html">Home</a>',
                //'<a href="site-home.html">Home</a>'

            );
        //booksTableHome.append("Recently added books");
        for (let book of books) {
            booksTableHome.append($('<tr id="trtr">').append(
                $('<td></td>').text(book.title)
                //$('<td></td>').text(book.author),
               // $('<td></td>').text(book.description))


            ));
        }
        checker++;
        $("#booksHome1").append(booksTableHome);
    }
    
}
