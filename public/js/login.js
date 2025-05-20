if(localStorage.getItem("darkMode") == null){
  localStorage.setItem("darkMode", "false");
}

if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.setAttribute("data-theme", "dark");
} else {
  document.documentElement.setAttribute("data-theme", "light");
}


//============================
// Login validation
//============================

var isValidUserIDLogin = false;
var isValidPassLogin = false;

function checkValidUserIDLogin(elem) {
  const userid = $(elem).val();

  if (userid != "") {
   $(elem)
        .siblings("span")
        .html('<i class="text-success" data-lucide="circle-check"></i>');
      lucide.createIcons();
      isValidUserIDLogin = true;
  } else {
    $(elem).siblings("span").html("");
    isValidUserIDLogin = false;
  }
}

function checkValidPasswordLogin(elem) {
  const pass = $(elem).val();

  if (pass != "") {
    if (pass.length < 3) {
      $(elem)
        .siblings("span")
        .html('<i class="text-error" data-lucide="circle-alert"></i>');
      lucide.createIcons();
      isValidPassLogin = false;
    } else {
      $(elem)
        .siblings("span")
        .html('<i class="text-success" data-lucide="circle-check"></i>');
      lucide.createIcons();
      isValidPassLogin = true;
    }
  } else {
    $(elem).siblings("span").html("");
    isValidPassLogin = true;
  }
}

$("#btnLogin").click(function () {
  login();
});

function login() {
  if (isValidUserIDLogin == true && isValidPassLogin == true) {
    const userid = loginUserID.value;
    const pass = loginPass.value;
    $("#btnLogin").html(
      '<span class="loading loading-spinner text-accent loading-md"></span>'
    );
    $("#btnLogin").attr("disabled", true);
    LoginFB(userid, pass);
  } else {
    loginAlertContent.innerHTML = "Invalid credentials!";
    $("#loginAlert")
      .removeClass("hidden")
      .fadeIn(500)
      .delay(2000)
      .fadeOut(500, function () {
        $(this).addClass("hidden");
      });
  }
}

//============================
// Signup validation
//============================

// var isValidNameSignup = false;
// var isValidEmailSignup = false;
// var isValidPhoneSignup = false;

// function checkValidEmailSignup(elem) {
//   const email = $(elem).val();
//   const regex =
//     /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

//   if (email != "") {
//     if (!regex.test(email)) {
//       $(elem)
//         .siblings("span")
//         .html('<i class="text-error" data-lucide="circle-alert"></i>');
//       lucide.createIcons();
//       isValidEmailSignup = false;
//     } else {
//       $(elem)
//         .siblings("span")
//         .html('<i class="text-success" data-lucide="circle-check"></i>');
//       lucide.createIcons();
//       isValidEmailSignup = true;
//     }
//   } else {
//     $(elem).siblings("span").html("");
//     isValidEmailSignup = false;
//   }
// }

// function checkValidNameSignup(elem) {
//   const name = $(elem).val();

//   if (name != "") {
//     $(elem)
//       .siblings("span")
//       .html('<i class="text-success" data-lucide="circle-check"></i>');
//     lucide.createIcons();
//     isValidNameSignup = true;
//   } else {
//     $(elem).siblings("span").html("");
//     isValidNameSignup = false;
//   }
// }

// function checkValidPhoneSignup(elem) {
//   const phone = $(elem).val();

//   if (phone != "") {
//     if ($.isNumeric(phone) && phone.length == 10) {
//       $(elem)
//         .siblings("span")
//         .html('<i class="text-success" data-lucide="circle-check"></i>');
//       lucide.createIcons();
//       isValidPhoneSignup = true;
//     } else {
//       $(elem)
//         .siblings("span")
//         .html('<i class="text-error" data-lucide="circle-alert"></i>');
//       lucide.createIcons();
//       isValidPhoneSignup = false;
//     }
//   } else {
//     $(elem).siblings("span").html("");
//     isValidPhoneSignup = false;
//   }
// }

// $("#btnSignup").click(function () {
//   signup();
// });

// function signup() {
//   if (
//     isValidNameSignup == true &&
//     isValidEmailSignup == true &&
//     isValidPhoneSignup == true
//   ) {
//     const name = signupName.value;
//     const email = singupEmail.value;
//     const phone = signupPhone.value;
//     $("#btnSignup").html(
//       '<span class="loading loading-spinner text-accent loading-md"></span>'
//     );
//     $("#btnSignup").attr("disabled", true);
//     SignupFB(name, email, phone);
//   } else {
//     signupAlertErrorContent.innerHTML = "Invalid details!";
//     $("#signupAlertError")
//       .removeClass("hidden")
//       .fadeIn(500)
//       .delay(2000)
//       .fadeOut(500, function () {
//         $(this).addClass("hidden");
//       });
//   }
// }

//============================
// AJAX methods
//============================

function LoginFB(userid, pass) {
  const data = { userid: userid, password: pass };
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/login");
  xhttp.onload = function () {
    const response = this.responseText;
    if (response == 1) {
      location.href = "/dashboard";
    } else {
      $("#btnLogin").html("Login");
      $("#btnLogin").attr("disabled", false);
      loginAlertContent.innerHTML = response;
      $("#loginAlert")
        .removeClass("hidden")
        .fadeIn(500)
        .delay(2000)
        .fadeOut(500, function () {
          $(this).addClass("hidden");
        });
    }
  };
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(data));
}

// function SignupFB(name, email, phone) {
//   const data = { name: name, email: email, phone: phone };
//   const xhttp = new XMLHttpRequest();
//   xhttp.open("POST", "/login/createAccount");
//   xhttp.onload = function () {
//     const response = this.responseText;
//     if (response == 1) {
//       $("#btnSignup").html("Login");
//       $("#btnSignup").attr("disabled", false);

//       signupName.value = "";
//       singupEmail.value = "";
//       signupPhone.value = "";

//       signupAlertSuccessContent.innerHTML =
//         "Successfully signed up <strong>" +
//         name +
//         "</strong>. Please login to continue.";
//       $("#signupAlertSuccess")
//         .removeClass("hidden")
//         .fadeIn(500)
//         .delay(2000)
//         .fadeOut(500, function () {
//           $(this).addClass("hidden");
//         });
//     } else {
//       $("#btnSignup").html("Login");
//       $("#btnSignup").attr("disabled", false);
//       signupAlertErrorContent.innerHTML = response;
//       $("#signupAlertError")
//         .removeClass("hidden")
//         .fadeIn(500)
//         .delay(2000)
//         .fadeOut(500, function () {
//           $(this).addClass("hidden");
//         });
//     }
//   };
//   xhttp.setRequestHeader("Content-Type", "application/json");
//   xhttp.send(JSON.stringify(data));
// }
