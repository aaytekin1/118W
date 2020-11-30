function setCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
  }
  else var expires = "";
  document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}


function writeUserData(userId, name, email, password) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    password : password
  });
}

function writeContactData(id,name, email, phone,message) {
  firebase.database().ref('contact/' + id).set({
    name: name,
    email: email,
    message : message,
    phone : phone,
  });
}

function writeFeedData(id,name, email, rate,message) {
  firebase.database().ref('feedbackform/' + id).set({
    name: name,
    email: email,
    message : message,
    rate : rate,
  });
}


var firebaseConfig = {
  apiKey: "AIzaSyC6J3fsaBcCkyJXckpnfxPQ2ckfA6QXkmk",
  authDomain: "w-sjsu-mla.firebaseapp.com",
  databaseURL: "https://w-sjsu-mla.firebaseio.com",
  projectId: "w-sjsu-mla",
  storageBucket: "gs://w-sjsu-mla.appspot.com",
  messagingSenderId: "902749740359",
  appId: "1:902749740359:web:6d475590522655dd990062",
  measurementId: "G-Z8JE695Y7V"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database().ref();

$( "#loginsubmit" ).click(function() {

  var username = $("#username").val();
  var password = $("#password").val();
  database.child('users').orderByChild('username').equalTo(username).on("value", function(userget) {
    var users =  userget.val();
    console.log(users);
    if(users == null){
      alert("No account found with that username.");
    }else if(users[Object.keys(users)[0]].password != password ){
      alert("Oops! Something went wrong. Please try again later.");
    }else{
      setCookie("name", username, 10);
      setCookie("password", password, 10);
      setCookie("login", true, 10);
      setCookie("userId",Object.keys(users)[0], 10);
      window.location.href = 'homepage.html';
    }
  });
});


$( "#profileupdate" ).click(function() {
  var username = $("#input-username").val();
  var email = $("#input-email").val();
  var firstname = $("#input-first-name").val();
  var lastname = $("#input-last-name").val();
  var adress = $("#input-address").val();
  var city = $("#input-city").val();
  var country = $("#input-country").val();
  var postal = $("#input-postal-code").val();
  var aboutme = $("#aboutme").val();
  var userId = getCookie("userId");
  var password = $("#password").val();
  var interest =  $("#input-interest").val();
  var work =  $("#input-work").val();
  var state = $("#input-states").val();
  var status = $("#status").val();
  var workplace = $("#input-workplace").val();

  profileupdate(userId,username, email, firstname, lastname, adress,city,country,postal,aboutme,password,interest,work,state,status,workplace);
});



$( "#registersubmit" ).click(function() {
  var username = $("#username").val();
  var email = $("#email").val();
  var password = $("#password").val();
  var userId = firebase.database().ref().child('users').push().key;
  writeUserData(userId,username,email,password);
  window.location.href = 'login.html';
  alert("Register Success");
});


$( "#contactsubmit" ).click(function() {
  var name = $("#name").val();
  var email = $("#email").val();
  var phone = $("#phone").val();
  var message = $("#message").val();
  var id = firebase.database().ref().child('contact').push().key;
  writeContactData(id,name,email,phone,message);
  alert("Contact  Message Send !");
});

$( "#feedbacksubmit" ).click(function() {
  var name = $("#name").val();
  var email = $("#email").val();
  var rate = $("#rate").val();
  var message = $("#message").val();
  var id = firebase.database().ref().child('feedbackform').push().key;
  writeFeedData(id,name,email,rate,message);
  alert("FeedbackForm  Message Send !");
});


$(document).on("keyup","#searchinput", function () {
               var value = $(this).val();
               $("table tr").each(function (index) {
                   $row = $(this);
                   $row.show();
                   if (index !== 0 && value) {
                       var found = false;
                       $row.find("td").each(function () {
                           var cell = $(this).text();
                           if (cell.indexOf(value.toLowerCase()) >= 0) {
                               found = true;
                               return;
                           }
                       });
                       if (found === true) {
                           $row.show();
                           $row.addClass("showw");
                           $row.removeClass("hidee");

                       }
                       else {
                           $row.hide();
                           $row.addClass("hidee");
                           $row.removeClass("showw");
                       }
                   }
         });

         $('.showw').each(function(i) {
        $(this).find("td:first").empty().text(i+1);
    });

   });

$("#search").keyup(function () {
    var value = this.value.toLowerCase().trim();

    $("table tr").each(function (index) {
        if (!index) return;
        $(this).find("td").each(function () {
            var id = $(this).text().toLowerCase().trim();
            var not_found = (id.indexOf(value) == -1);
            $(this).closest('tr').toggle(!not_found);
            return not_found;
        });
    });
});
$("#searchbtn").click(function() {
  var searchinput = $("#searchinput").val();
  $("#searchtable").empty();

});


function profileupdate(userId,username, email, firstname, lastname, adress,city,country,postal,aboutme,password,interest,work,state,status,workplace) {
var postData = {
  username: username,
  email: email,
  firstname: firstname,
  lastname: lastname,
  adress: adress,
  city: city,
  country: country,
  postal: postal,
  aboutme: aboutme,
  password: password,
  interest: interest,
  work: work,
  state: state,
  status: status,
  workplace : workplace,
};
firebase.database().ref().child('users/' + userId).set(postData);
alert("Profile Updated");

}
