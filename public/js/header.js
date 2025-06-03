// var selectedAvatarId = 17;

if (localStorage.getItem("darkMode") == null) {
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
  // console.log(localStorage.getItem("darkMode"));
  if (localStorage.getItem("darkMode") === "false") {
    localStorage.setItem("darkMode", "true");
    document.documentElement.setAttribute("data-theme", "dark");
    $(".header-menu").attr("data-theme", "light");
  } else {
    localStorage.setItem("darkMode", "false");
    document.documentElement.setAttribute("data-theme", "light");
    $(".header-menu").attr("data-theme", "dark");
  }
  // console.log(localStorage.getItem("darkMode"));
}

/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
Date.prototype.getWeek = function (dowOffset) {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

  dowOffset = typeof (dowOffset) == 'number' ? dowOffset : 6; //default dowOffset to zero
  var newYear = new Date(this.getFullYear(), 0, 1);
  var day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = (day >= 0 ? day : day + 7);
  var daynum = Math.floor((this.getTime() - newYear.getTime() -
    (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
  var weeknum;
  //if the year starts before the middle of a week
  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      nYear = new Date(this.getFullYear() + 1, 0, 1);
      nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
        the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
    }
  }
  else {
    weeknum = Math.floor((daynum + day - 1) / 7);
  }
  return weeknum;
};

function getday(n) {
  let day;
  switch (n) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
  }
  return day;
}

function setCurrWeek() {
  const currentDate = new Date();
  const weekNumber = currentDate.getWeek();
  headerWeekNumber.innerHTML = `${getday(currentDate.getDay())} - Week ${weekNumber}`;
}

function getCurrWeek() {
  const currentDate = new Date();
  return currentDate.getWeek();
}

function logout() {
  if (localStorage.getItem(`dataArray`)) {
    const dataArrStr = localStorage.getItem('dataArray');
    var dataArr = dataArrStr.split(",");
    // console.log("data count :" + (dataArr.length - 1).toString());
    for (i = 0; i < dataArr.length - 1; i++) {
      sessionStorage.setItem(dataArr[i], '');
    }
  }
  if (sessionStorage.getItem('teamData')) {
    sessionStorage.setItem('teamData', '');
  }

  if (sessionStorage.getItem('rosterData')) {
    sessionStorage.setItem('rosterData', '');
  }

  if (sessionStorage.getItem('chartData-' + getCurrWeek())) {
    sessionStorage.setItem('chartData-' + getCurrWeek(), '');
  }

  if (sessionStorage.getItem('dashData-' + getCurrWeek())) {
    sessionStorage.setItem('dashData-' + getCurrWeek(), '');
  }

  location.href = '/login/logout';
}

setCurrWeek();
