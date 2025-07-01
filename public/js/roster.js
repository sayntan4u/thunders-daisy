var rosterData = [];

const d = new Date();
const today = d.getDay();
const dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function loadRoster() {
  if (
    sessionStorage.getItem("rosterData") &&
    sessionStorage.getItem("today") == dayArray[today]
  ) {
    var data = JSON.parse(sessionStorage.getItem("rosterData"));
    rosterData = data;
    //Agenda page plan roster container updation
    generateRosterTable(data);
    $(".loading_roster").addClass("hide");
  } else {
    $.ajax({
      url: "/roster/getRoster",
      type: "POST",
      dataType: "json",
      success: function (data) {
        sessionStorage.setItem("rosterData", JSON.stringify(data));
        sessionStorage.setItem("today", dayArray[today]);
        rosterData = data;
        //Agenda page plan roster container updation
        generateRosterTable(data);
        $(".loading_roster").addClass("hide");
      },
      error: function (xhr, status, error) {
        console.error("Error loading roster:", error);
      },
    });
  }
}

function updateRoster(day, time, irName) {
  $.ajax({
    url: "/roster/updateRoster",
    type: "POST",
    dataType: "json",
    data: { day: day, time: time, irName: irName },
  });
}

function updateLocalRosterData(day, time, irName) {
  for (let i = 0; i < rosterData.length; i++) {
    if (rosterData[i].day == day) {
      rosterData[i].data[time] = irName;
      break;
    }
  }
  sessionStorage.setItem("rosterData", JSON.stringify(rosterData));
}

function clearRoster() {
  clearRosterTable();
  $.ajax({
    url: "/roster/clearRoster",
    type: "POST",
    dataType: "json",
  });
}

function getWeekArray() {
  const weekArray = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  //get today
  const d = new Date();
  const today = d.getDay();
  const dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // console.log(dayArray[today]);

  var index = 0;

  for (let i = 0; i < weekArray.length; i++) {
    if (weekArray[i] == dayArray[today]) {
      index = i;
      break;
    }
  }
  const arr1 = weekArray.slice(index);
  const arr2 = weekArray.slice(0, index);

  // console.log(arr1);
  // console.log(arr2);

  const arr3 = arr1.concat(arr2);

  return arr3;
}

function generateRosterTable(data) {
  const weekArray = getWeekArray();
  const timeArray = ["9AM", "11AM", "1PM", "3PM", "5PM", "7PM", "9PM"];

  //get today
  const d = new Date();
  const today = d.getDay(); // 0-6 (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  $(".roster-header tr").empty(); // Clear existing header rows
  $(".roster-body").empty(); // Clear existing body rows

  const headerRow = $(".roster-header tr");
  // headerRow.append('<tr></tr>');
  headerRow.append(
    '<th scope="col" class="bg-dark text-light"><i class="size-5 mx-auto" data-lucide="clock-arrow-down"></i></th>'
  );
  weekArray.forEach(function (day) {
    headerRow.append(
      `<th scope="col" class="${
        dayArray[today] == day ? "bg-success text-success-content" : ""
      }">` +
        day +
        "</th>"
    );
  });
  // headerRow.append('');

  // <input type="text" class="form-control ${item.data[time] == '' ? '' : 'has_data'} ${item.day}-${time}" value="${item.data[time]}" onchange='valueChangedRoster(this,"${item.day}","${time}")'>
  var i = 1;
  timeArray.forEach(function (time) {
    const bodyRow = $("<tr></tr>");
    bodyRow.append(`<th scope="row" class="time align-middle ">${time}</th>`);
    $.each(data, function (index, item) {
      bodyRow.append(`
                <td class="${
                  getIRNameRoster(item.data[time]) == "" ? "" : "has_data"
                }">
                        <button type="button" class="btn btn-roster-data items-center" popovertarget="popover-${i}" style="anchor-name:--anchor-${i}">
                            <span class="irName">${getIRNameRoster(
                              item.data[time]
                            )}</span>
                            ${generatePlanStatus(
                              getPlanStatus(item.data[time])
                            )}
                        </button>
                        <div class="dropdown menu w-52 rounded-box bg-base-100 shadow-sm" popover id="popover-${i}" style="position-anchor:--anchor-${i}">
                            <div class="txt mb-3">
                                <input type="text" class="input" value="${getIRNameRoster(
                                  item.data[time]
                                )}" onkeyup='rosterChanged(this)' onchange='rosterUpdate(this,"${item.day}","${time}")'>
                            </div>
                            <div class="drop mb-3">
                                <select class="select" onchange='changePlanStatus(this,"${
                                  item.day
                                }","${time}")'>
                                    <option ${
                                      getPlanStatus(item.data[time]) ==
                                      "-select-"
                                        ? "selected"
                                        : ""
                                    }>-select-</option>
                                    <option ${
                                      getPlanStatus(item.data[time]) ==
                                      "Confirmed"
                                        ? "selected"
                                        : ""
                                    }>Confirmed</option>
                                    <option ${
                                      getPlanStatus(item.data[time]) ==
                                      "Reconfirmed"
                                        ? "selected"
                                        : ""
                                    }>Reconfirmed</option>
                                    <option ${
                                      getPlanStatus(item.data[time]) == "Done"
                                        ? "selected"
                                        : ""
                                    }>Done</option>
                                    <option ${
                                      getPlanStatus(item.data[time]) ==
                                      "Rescheduled"
                                        ? "selected"
                                        : ""
                                    }>Rescheduled</option>
                                    <option ${
                                      getPlanStatus(item.data[time]) ==
                                      "Cancelled"
                                        ? "selected"
                                        : ""
                                    }>Cancelled</option>
                                </select>
                            </div>
                            <div class="d-grid">
                                <button class="btn btn-clear-roster-data btn-error btn-soft btn-block" onclick='clearRosterData(this,"${
                                  item.day
                                }","${time}")'>Clear</button>
                            </div>
                        </div>
                </td>`);
      i++;
    });
    $(".roster-body").append(bodyRow);
    loadIcons();
  });
}

function getIRNameRoster(str) {
  const myArray = str.split("/");
  return myArray[0];
}

function getPlanStatus(str) {
  const myArray = str.split("/");
  return myArray[1];
}

function generatePlanStatus(val) {
  var pill = "";

  if (val == "Confirmed") {
    pill = `<span class="plan_status badge badge-sm badge-success">C</span>`;
  } else if (val == "Reconfirmed") {
    pill = `<span class="plan_status badge badge-sm badge-success">RC</span>`;
  } else if (val == "Done") {
    pill = `<span class="plan_status badge badge-sm badge-primary">DN</span>`;
  } else if (val == "Rescheduled") {
    pill = `<span class="plan_status badge badge-sm badge-secondary">RS</span>`;
  } else if (val == "Cancelled") {
    pill = `<span class="plan_status badge badge-sm badge-error">CN</span>`;
  } else {
    pill = `<span class="plan_status badge badge-sm"></span>`;
  }

  return pill;
}

function clearRosterTable() {
  const weekArray = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  const timeArray = ["9AM","11AM", "1PM", "3PM", "5PM", "7PM", "9PM"];

  weekArray.forEach(function (day) {
    timeArray.forEach(function (time) {
      $(`.${day}-${time}`).val(""); // Clear the input field
    });
  });
}

function valueChangedRoster(elem, day, time) {
  const value =
    $(elem).val() +
    "/" +
    $(elem).parent().siblings(".drop").children("select").val();
  if (getIRNameRoster(value) != "") {
    $(elem).parent().parent().parent().addClass("has_data");
  } else {
    $(elem).parent().parent().parent().removeClass("has_data");
  }
  updateRoster(day, time, value);
  updateLocalRosterData(day, time, value);
}

$(document).on("click", ".btn-roster-data", function () {
  $(this).siblings("div").children(".txt").children("input").focus();
});

function clearRosterData(elem, day, time) {
  const value = "/-select-";
  updateRoster(day, time, value);
  updateLocalRosterData(day, time, value);
  $(elem).parent().siblings(".txt").children("input").val("");
  $(elem)
    .parent()
    .siblings(".drop")
    .children("select")
    .prop("selectedIndex", 0);
  //change btn

  $(elem)
    .parent()
    .parent()
    .siblings(".btn-roster-data")
    .children(".irName")
    .html("");
  $(elem)
    .parent()
    .parent()
    .siblings(".btn-roster-data")
    .children(".plan_status")
    .removeClass("badge-success")
    .removeClass("badge-secondary")
    .removeClass("badge-primary")
    .removeClass("badge-error")
    .html("");

  //change cell
  $(elem).parent().parent().parent().removeClass("has_data");
}

function rosterUpdate(elem, day, time) {
  const val = $(elem).val();
  $(elem).parent().parent().siblings("button").children(".irName").html(val);

  valueChangedRoster(elem, day, time);
}

function rosterChanged(elem) {
  const val = $(elem).val();
  $(elem).parent().parent().siblings("button").children(".irName").html(val);
}

function changePlanStatus(elem, day, time) {
  const val = $(elem).val();

  if (val == "Confirmed") {
    $(elem)
      .parent()
      .parent()
      .siblings("button")
      .children(".plan_status")
      .html("C");
    $(elem)
      .parent()
      .parent()
      .siblings("button")
      .children(".plan_status")
      .removeClass("badge-error")
      .removeClass("badge-secondary")
      .removeClass("badge-primary")
      .addClass("badge-success");
  } else if (val == "Reconfirmed") {
    $(elem)
      .parent()
      .parent()
      .siblings("button")
      .children(".plan_status")
      .html("RC");
    $(elem)
      .parent()
      .parent()
      .siblings("button")
      .children(".plan_status")
      .removeClass("badge-error")
      .removeClass("badge-secondary")
      .removeClass("badge-primary")
      .addClass("badge-success");
  } else if (val == "Done") {
    $(elem)
      .parent()
      .parent()
      .siblings("button")
      .children(".plan_status")
      .html("DN");
    $(elem)
      .parent()
      .parent()
      .siblings("button")
      .children(".plan_status")
      .removeClass("badge-error")
      .removeClass("badge-secondary")
      .removeClass("badge-success")
      .addClass("badge-primary");
  } else if (val == "Rescheduled") {
    $(elem)
      .parent()
      .parent()
      .siblings("button")
      .children(".plan_status")
      .html("RS");
    $(elem)
      .parent()
      .parent()
      .siblings("button")
      .children(".plan_status")
      .removeClass("badge-success")
      .removeClass("badge-error")
      .removeClass("badge-primary")
      .addClass("badge-secondary");
  } else if (val == "Cancelled") {
    $(elem)
      .parent()
      .parent()
      .siblings("button")
      .children(".plan_status")
      .html("CN");
    $(elem)
      .parent()
      .parent()
      .siblings("button")
      .children(".plan_status")
      .removeClass("badge-success")
      .removeClass("badge-secondary")
      .removeClass("badge-primary")
      .addClass("badge-error");
  } else {
    $(elem)
      .parent()
      .parent()
      .siblings("button")
      .children(".plan_status")
      .html("");
    $(elem)
      .parent()
      .parent()
      .siblings("button")
      .children(".plan_status")
      .removeClass("badge-success")
      .removeClass("badge-secondary")
      .removeClass("badge-primary")
      .removeClass("badge-error");
  }

  const value =
    $(elem).parent().siblings(".txt").children("input").val() +
    "/" +
    $(elem).val();
  updateRoster(day, time, value);
  updateLocalRosterData(day, time, value);
}

function defaultRosterLoader() {
  const weekArray = getWeekArray();
  const timeArray = ["9AM", "11AM", "1PM", "3PM", "5PM", "7PM", "9PM"];

  //get today
  const d = new Date();
  const today = d.getDay(); // 0-6 (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  $(".roster-header tr").empty(); // Clear existing header rows
  $(".roster-body").empty(); // Clear existing body rows

  const headerRow = $(".roster-header tr");
  // headerRow.append('<tr></tr>');
  headerRow.append(
    '<th scope="col" class="bg-dark text-light"><i class="size-5 mx-auto" data-lucide="clock-arrow-down"></i></th>'
  );
  weekArray.forEach(function (day) {
    headerRow.append(
      `<th scope="col" class="${
        dayArray[today] == day ? "bg-success text-success-content" : ""
      }">` +
        day +
        "</th>"
    );
  });
  // headerRow.append('');

  // <input type="text" class="form-control ${item.data[time] == '' ? '' : 'has_data'} ${item.day}-${time}" value="${item.data[time]}" onchange='valueChangedRoster(this,"${item.day}","${time}")'>
  var i = 1;
  timeArray.forEach(function (time) {
    const bodyRow = $("<tr></tr>");
    bodyRow.append(`<th scope="row" class="time align-middle ">${time}</th>`);
    $.each(weekArray, function (index, item) {
      bodyRow.append(`
                <td class="skeleton">
                        
                        
                </td>`);
      i++;
    });
    $(".roster-body").append(bodyRow);
    loadIcons();
  });
}

defaultRosterLoader();
loadRoster();
