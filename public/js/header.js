// var selectedAvatarId = 17;

if(localStorage.getItem("darkMode") == null){
  localStorage.setItem("darkMode", "false");
}

if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.setAttribute("data-theme", "dark");
  $(".header-menu").attr("data-theme", "light");
  $(".btn-theme").children(".sun").addClass("swap-on");
  $(".btn-theme").children(".moon").addClass("swap-off");
} else {
  document.documentElement.setAttribute("data-theme", "light");
  $(".header-menu").attr("data-theme", "dark");
  $(".btn-theme").children(".sun").addClass("swap-off");
  $(".btn-theme").children(".moon").addClass("swap-on");
}

function getAvatarId() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/user/getAvatarId");
  xhttp.onload = function () {
    selectedAvatarId = this.responseText;

    $("#avatar_navbar").attr("src", `images/avatars/${selectedAvatarId}.avif`);
    $("#avatar_dropdown").attr(
      "src",
      `images/avatars/${selectedAvatarId}.avif`
    );
    $("#avatar_profile").attr("src", `images/avatars/${selectedAvatarId}.avif`);
  };
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
}

function changeTheme() {
  console.log(localStorage.getItem("darkMode"));
  if (localStorage.getItem("darkMode") === "false") {
    localStorage.setItem("darkMode", "true");
    document.documentElement.setAttribute("data-theme", "dark");
    $(".header-menu").attr("data-theme", "light");
  } else {
    localStorage.setItem("darkMode", "false");
    document.documentElement.setAttribute("data-theme", "light");
    $(".header-menu").attr("data-theme", "dark");
  }
  console.log(localStorage.getItem("darkMode"));
}

// getAvatarId();
