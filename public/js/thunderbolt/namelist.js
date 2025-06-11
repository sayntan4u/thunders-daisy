class Prospect {
  constructor({
    id,
    name,
    week,
    zone,
    city = "",
    chatting = false,
    socialMedia = false,
    stage1 = false,
    stage1Week = "",
    stage2 = false,
    stage2Week = "",
    info = false,
    infoWeek = "",
    infoResponse = "",
    reinfo = false,
    reinfoWeek = "",
    reinfoResponse = "",
    meetup = false,
    invi = false,
    inviWeek = "",
    inviResponse = "",
    plan = false,
    planWeek = "",
    planStatus = "",
    remarks = "",
  }) {
    this.id = id;
    this.name = name;
    this.week = week;
    this.zone = zone;
    this.city = city;
    this.chatting = chatting;
    this.socialMedia = socialMedia;
    this.stage1 = stage1;
    this.stage1Week = stage1Week;
    this.stage2 = stage2;
    this.stage2Week = stage2Week;
    this.info = info;
    this.infoWeek = infoWeek;
    this.infoResponse = infoResponse;
    this.reinfo = reinfo;
    this.reinfoWeek = reinfoWeek;
    this.reinfoResponse = reinfoResponse;
    this.meetup = meetup;
    this.invi = invi;
    this.inviWeek = inviWeek;
    this.inviResponse = inviResponse;
    this.plan = plan;
    this.planWeek = planWeek;
    this.planStatus = planStatus;
    this.remarks = remarks;
  }
}

var namelist = [];
var kiv = [];

var curr_uid = null;
var searchedNL = [];
var searchedNL2 = [];
var isFilter = false;
var isFilter2 = false;

function generateSortWeekDropDownUI() {
  var weekDropDownUI = "";
  for (var i = 1; i <= 53; i++) {
    weekDropDownUI += "<option>" + i + "</option>";
  }
  $("#sortWeek").children("select").append(weekDropDownUI);
  $("#weekAddPerson").children("select").append(weekDropDownUI);
}

function clearSelectionUI() {
  $("#NLTable")
    .children("thead")
    .children("tr")
    .each(function () {
      $(this)
        .children("td")
        .each(function () {
          $(this).removeClass("searchedField");
        });
      $(this)
        .children("th")
        .each(function () {
          $(this).removeClass("searchedField");
        });
    });
}

function clearSelectionUI2() {
  $("#NLTable")
    .children("thead")
    .children("tr")
    .each(function () {
      $(this)
        .children("td")
        .each(function () {
          $(this).removeClass("searchedField2");
        });
      $(this)
        .children("th")
        .each(function () {
          $(this).removeClass("searchedField2");
        });
    });
}

function enableSelectionUI(value) {
  if (value == "Name") {
    $(".name").addClass("searchedField");
  }
  if (value == "Week Added") {
    $(".weekAdded").addClass("searchedField");
  }
  if (value == "City") {
    $(".city").addClass("searchedField");
  }
  if (value == "Zone") {
    $(".zone").addClass("searchedField");
  }
  if (value == "Chatting") {
    $(".chatting").addClass("searchedField");
  }
  if (value == "Social Media") {
    $(".socialMedia").addClass("searchedField");
  }
  if (value == "Stage 1") {
    $(".stage1").addClass("searchedField");
  }
  if (value == "Stage 2") {
    $(".stage2").addClass("searchedField");
  }
  if (value == "Info") {
    $(".info").addClass("searchedField");
  }
  if (value == "Reinfo") {
    $(".reinfo").addClass("searchedField");
  }
  if (value == "Meetup") {
    $(".meetup").addClass("searchedField");
  }
  if (value == "Invi") {
    $(".invi").addClass("searchedField");
  }
  if (value == "Plan") {
    $(".plan").addClass("searchedField");
  }
}

function enableSelectionUI2(value) {
  if (value == "Name") {
    $(".name").addClass("searchedField2");
  }
  if (value == "Week Added") {
    $(".weekAdded").addClass("searchedField2");
  }
  if (value == "City") {
    $(".city").addClass("searchedField2");
  }
  if (value == "Zone") {
    $(".zone").addClass("searchedField2");
  }
  if (value == "Chatting") {
    $(".chatting").addClass("searchedField2");
  }
  if (value == "Social Media") {
    $(".socialMedia").addClass("searchedField2");
  }
  if (value == "Stage 1") {
    $(".stage1").addClass("searchedField2");
  }
  if (value == "Stage 2") {
    $(".stage2").addClass("searchedField2");
  }
  if (value == "Info") {
    $(".info").addClass("searchedField2");
  }
  if (value == "Reinfo") {
    $(".reinfo").addClass("searchedField2");
  }
  if (value == "Meetup") {
    $(".meetup").addClass("searchedField2");
  }
  if (value == "Invi") {
    $(".invi").addClass("searchedField2");
  }
  if (value == "Plan") {
    $(".plan").addClass("searchedField2");
  }
}

function filterValueChanged(elem) {
  generateNL(namelist);
  clearSelectionUI();
  enableSelectionUI($(elem).val());

  $(".option").each(function () {
    $(this).addClass("hidden");
  });
  $(".option2").each(function () {
    $(this).addClass("hidden");
  });

  $("#fliterDropDown2").val("");

  $("#addFilterBtn").html(
    "<i class='size-4' data-lucide='list-filter-plus'></i>"
  );
  $("#addFilterBtn").attr("disabled", false);
  loadIcons();

  if ($(elem).val() != "") {
    isFilter = true;
    $("#cancelFilterBtn").removeClass("hidden");
  } else {
    isFilter = false;
    $("#cancelFilterBtn").addClass("hidden");
  }

  if ($(elem).val() == "Name") {
    $("#sortName").parent().removeClass("hidden");
  } else if ($(elem).val() == "Week Added") {
    $("#sortWeek option").prop("selected", function () {
      // return defaultSelected property of the option
      return this.defaultSelected;
    });
    $("#sortWeek").parent().removeClass("hidden");
  } else if ($(elem).val() == "Zone") {
    $("#sortZone option").prop("selected", function () {
      // return defaultSelected property of the option
      return this.defaultSelected;
    });
    $("#sortZone").parent().removeClass("hidden");
  } else if ($(elem).val() == "City") {
    $("#sortCity").parent().removeClass("hidden");
  } else if (
    $(elem).val() == "Chatting" ||
    $(elem).val() == "Social Media" ||
    $(elem).val() == "Stage 1" ||
    $(elem).val() == "Stage 2" ||
    $(elem).val() == "Info" ||
    $(elem).val() == "Reinfo" ||
    $(elem).val() == "Meetup" ||
    $(elem).val() == "Invi" ||
    $(elem).val() == "Plan"
  ) {
    $("#sortDonePending option").prop("selected", function () {
      // return defaultSelected property of the option
      return this.defaultSelected;
    });
    $("#sortDonePending").parent().removeClass("hidden");
  }
  $("#addFilterBtn").addClass("hidden");
}

function filterValueChanged2(elem) {
  // generateNL(searchedNL);
  clearSelectionUI2();
  enableSelectionUI2($(elem).val());

  if ($(elem).val() != "") {
    isFilter2 = true;
  } else {
    isFilter2 = false;
    // $("#cancelFilterBtn").addClass("hidden");
    // $("#addFilterBtn").removeClass("hidden");
  }

  if (
    $(elem).val() == "Social Media" ||
    $(elem).val() == "Stage 1" ||
    $(elem).val() == "Stage 2" ||
    $(elem).val() == "Info" ||
    $(elem).val() == "Reinfo" ||
    $(elem).val() == "Meetup" ||
    $(elem).val() == "Invi" ||
    $(elem).val() == "Plan"
  ) {
    $("#sortDonePending2 option").prop("selected", function () {
      // return defaultSelected property of the option
      return this.defaultSelected;
    });
  }
}

function resetFilter() {
  isFilter = false;
  isFilter2 = false;
  clearSelectionUI();
  clearSelectionUI2();
  $(".option").each(function () {
    $(this).addClass("hidden");
  });
  $(".option2").each(function () {
    $(this).addClass("hidden");
  });
  $("#fliterDropDown").val("");
  $("#cancelFilterBtn").addClass("hidden");
  $("#addFilterBtn").addClass("hidden");

  $("#fliterDropDown2").val("");
  $("#addFilterBtn").html(
    "<i class='size-4' data-lucide='list-filter-plus'></i>"
  );
  $("#addFilterBtn").attr("disabled", false);
  loadIcons();
}

$("#cancelFilterBtn").click(function () {
  isFilter = false;
  clearSelectionUI();
  clearSelectionUI2();
  $(".option").each(function () {
    $(this).addClass("hidden");
  });
  $(".option2").each(function () {
    $(this).addClass("hidden");
  });

  generateNL(namelist);

  $("#fliterDropDown").val("");
  $(this).addClass("hidden");
  $("#addFilterBtn").addClass("hidden");

  $("#fliterDropDown2").val("");

  $("#addFilterBtn").html(
    "<i class='size-4' data-lucide='list-filter-plus'></i>"
  );
  $("#addFilterBtn").attr("disabled", false);
  loadIcons();
});

$("#addFilterBtn").click(function () {
  $(this).html("<i class='size-4' data-lucide='ampersand'></i>");
  $(this).attr("disabled", true);

  $(".option2").each(function () {
    $(this).removeClass("hidden");
  });
  loadIcons();
});

$("#cancelFilterBtn2").click(function () {
  isFilter2 = false;
  clearSelectionUI2();
  $(".option2").each(function () {
    $(this).addClass("hidden");
  });

  if (searchedNL.length > 0) {
    generateNL(searchedNL);
  } else {
    generateNL(namelist);
  }

  $("#fliterDropDown2").val("");
  $("#sortDonePending2 option").prop("selected", function () {
    // return defaultSelected property of the option
    return this.defaultSelected;
  });

  $("#addFilterBtn").html(
    "<i class='size-4' data-lucide='list-filter-plus'></i>"
  );
  $("#addFilterBtn").attr("disabled", false);
  loadIcons();
});

Array.prototype.toMissionmaxout = function () {
  var mmNL = [];

  for (let i = 0; i < this.length; i++) {
    mmNL.push({
      "S.No.": i + 1,
      Name: this[i].name,
      Country: "India",
      City: this[i].city,
      Phone: "1234567890",
      Profession: "Job",
      Relation: this[i].zone,
    });
  }

  return mmNL;
};

function exportJsonToExcel() {
  $("#downloadBtn").attr("disabled", true);
  $("#downloadBtn").html(
    '<span class="loading loading-spinner loading-sm"></span>'
  );

  getKIVData(function () {
    $("#downloadBtn").attr("disabled", false);
    $("#downloadBtn").html('<i class="size-5" data-lucide="download"></i>');
    loadIcons();

    const totalNl = namelist.concat(kiv);
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(totalNl.toMissionmaxout());

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, namelistModalTitle.innerHTML + ".xlsx");
  });
}

//Search methods

function searchByName(elem) {
  pageNumberNL.innerHTML = 1;
  const searchStr = $(elem).val();
  searchedNL = [];

  if (searchStr != "") {
    for (let i = 0; i < namelist.length; i++) {
      if (namelist[i].name.toLowerCase().match(searchStr.toLowerCase())) {
        searchedNL.push(namelist[i]);
      }
    }
  } else {
    searchedNL = namelist;
  }
  generateNL(searchedNL);
}

function searchByWeekAdded(elem) {
  pageNumberNL.innerHTML = 1;
  const weekAdded = $(elem).val();
  searchedNL = [];
  if (weekAdded != "") {
    for (let i = 0; i < namelist.length; i++) {
      if (namelist[i].week == weekAdded) {
        searchedNL.push(namelist[i]);
      }
    }
  } else {
    searchedNL = namelist;
  }

  generateNL(searchedNL);
}

function searchByZone(elem) {
  pageNumberNL.innerHTML = 1;
  const zone = $(elem).val();
  searchedNL = [];
  if (zone != "") {
    for (let i = 0; i < namelist.length; i++) {
      if (namelist[i].zone == zone) {
        searchedNL.push(namelist[i]);
      }
    }
  } else {
    searchedNL = namelist;
  }
  generateNL(searchedNL);
}

function searchByCity(elem) {
  pageNumberNL.innerHTML = 1;
  const searchStr = $(elem).val();
  searchedNL = [];

  if (searchStr != "") {
    for (let i = 0; i < namelist.length; i++) {
      if (namelist[i].city.toLowerCase().match(searchStr.toLowerCase())) {
        searchedNL.push(namelist[i]);
      }
    }
  } else {
    searchedNL = namelist;
  }
  generateNL(searchedNL);
}

//helper
function getTF(donePendingStr) {
  pageNumberNL.innerHTML = 1;
  if (donePendingStr == "Done") {
    return true;
  } else {
    return false;
  }
}

function searchByDonePending(elem) {
  pageNumberNL.innerHTML = 1;
  const donePending = $(elem).val();
  searchedNL = [];

  if (donePending != "") {
    $("#addFilterBtn").removeClass("hidden");
    if ($("#fliterDropDown").val() == "Chatting") {
      for (let i = 0; i < namelist.length; i++) {
        if (namelist[i].chatting == getTF(donePending)) {
          searchedNL.push(namelist[i]);
        }
      }
    }
    if ($("#fliterDropDown").val() == "Social Media") {
      for (let i = 0; i < namelist.length; i++) {
        if (namelist[i].socialMedia == getTF(donePending)) {
          searchedNL.push(namelist[i]);
        }
      }
    }
    if ($("#fliterDropDown").val() == "Stage 1") {
      for (let i = 0; i < namelist.length; i++) {
        if (namelist[i].stage1 == getTF(donePending)) {
          searchedNL.push(namelist[i]);
        }
      }
    }
    if ($("#fliterDropDown").val() == "Stage 2") {
      for (let i = 0; i < namelist.length; i++) {
        if (namelist[i].stage2 == getTF(donePending)) {
          searchedNL.push(namelist[i]);
        }
      }
    }
    if ($("#fliterDropDown").val() == "Info") {
      for (let i = 0; i < namelist.length; i++) {
        if (namelist[i].info == getTF(donePending)) {
          searchedNL.push(namelist[i]);
        }
      }
    }
    if ($("#fliterDropDown").val() == "Reinfo") {
      for (let i = 0; i < namelist.length; i++) {
        if (namelist[i].reinfo == getTF(donePending)) {
          searchedNL.push(namelist[i]);
        }
      }
    }
    if ($("#fliterDropDown").val() == "Meetup") {
      for (let i = 0; i < namelist.length; i++) {
        if (namelist[i].meetup == getTF(donePending)) {
          searchedNL.push(namelist[i]);
        }
      }
    }
    if ($("#fliterDropDown").val() == "Invi") {
      for (let i = 0; i < namelist.length; i++) {
        if (namelist[i].invi == getTF(donePending)) {
          searchedNL.push(namelist[i]);
        }
      }
    }
    if ($("#fliterDropDown").val() == "Plan") {
      for (let i = 0; i < namelist.length; i++) {
        if (namelist[i].plan == getTF(donePending)) {
          searchedNL.push(namelist[i]);
        }
      }
    }
  } else {
    $("#addFilterBtn").addClass("hidden");
    searchedNL = namelist;
  }

  generateNL(searchedNL);
}

function searchByDonePending2(elem) {
  // console.log(searchedNL);
  pageNumberNL.innerHTML = 1;
  const donePending = $(elem).val();
  searchedNL2 = [];

  if (donePending != "") {
    if ($("#fliterDropDown2").val() == "Social Media") {
      for (let i = 0; i < searchedNL.length; i++) {
        if (searchedNL[i].socialMedia == getTF(donePending)) {
          searchedNL2.push(searchedNL[i]);
        }
      }
    }
    if ($("#fliterDropDown2").val() == "Stage 1") {
      for (let i = 0; i < searchedNL.length; i++) {
        if (searchedNL[i].stage1 == getTF(donePending)) {
          searchedNL2.push(searchedNL[i]);
        }
      }
    }
    if ($("#fliterDropDown2").val() == "Stage 2") {
      for (let i = 0; i < searchedNL.length; i++) {
        if (searchedNL[i].stage2 == getTF(donePending)) {
          searchedNL2.push(searchedNL[i]);
        }
      }
    }
    if ($("#fliterDropDown2").val() == "Info") {
      for (let i = 0; i < searchedNL.length; i++) {
        if (searchedNL[i].info == getTF(donePending)) {
          searchedNL2.push(searchedNL[i]);
        }
      }
    }
    if ($("#fliterDropDown2").val() == "Reinfo") {
      for (let i = 0; i < searchedNL.length; i++) {
        if (searchedNL[i].reinfo == getTF(donePending)) {
          searchedNL2.push(searchedNL[i]);
        }
      }
    }
    if ($("#fliterDropDown2").val() == "Meetup") {
      for (let i = 0; i < searchedNL.length; i++) {
        if (searchedNL[i].meetup == getTF(donePending)) {
          searchedNL2.push(searchedNL[i]);
        }
      }
    }
    if ($("#fliterDropDown2").val() == "Invi") {
      for (let i = 0; i < searchedNL.length; i++) {
        if (searchedNL[i].invi == getTF(donePending)) {
          searchedNL2.push(searchedNL[i]);
        }
      }
    }
    if ($("#fliterDropDown2").val() == "Plan") {
      for (let i = 0; i < searchedNL.length; i++) {
        if (searchedNL[i].plan == getTF(donePending)) {
          searchedNL2.push(searchedNL[i]);
        }
      }
    }
  } else {
    searchedNL2 = searchedNL;
  }

  // console.log(searchedNL2);

  generateNL(searchedNL2);
}

function generateRowNamelistUI(sl, prospect) {
  //
  $("#namelistTable").append(`
        		<tr>
							<td class="sl">${sl}</td>
							<th class="name_col z-[2] name">${prospect.name}</th>
							<td class="weekAdded">${prospect.week}</td>
							<td class="zone">${prospect.zone}</td>
							<td class="city">${prospect.city}</td>
							<td class="chatting bl"> ${
                prospect.chatting == true
                  ? '<i class="size-5 mx-auto" data-lucide="check"></i>'
                  : ""
              } </td>
							<td class="br socialMedia"> ${
                prospect.socialMedia == true
                  ? '<i class="size-5 mx-auto" data-lucide="check"></i>'
                  : ""
              } </td>
              <td class="bl stage1">${
                prospect.stage1 == true
                  ? '<i class="size-5 mx-auto" data-lucide="check"></i>'
                  : ""
              } </td>
              <td class="br weekStage1 stage1">${prospect.stage1Week}</td>
              <td class="bl stage2">${
                prospect.stage2 == true
                  ? '<i class="size-5 mx-auto" data-lucide="check"></i>'
                  : ""
              } </td>
              <td class="br weekStage2 stage2">${prospect.stage2Week}</td>

							<td class="bl info"> ${
                prospect.info == true
                  ? '<i class="size-5 mx-auto" data-lucide="check"></i>'
                  : ""
              } </td>
							<td class="weekInfo info">${prospect.infoWeek}</td>
							<td class="br info">
								${prospect.infoResponse}
							</td>
							<td class="bl reinfo"> ${
                prospect.reinfo == true
                  ? '<i class="size-5 mx-auto" data-lucide="check"></i>'
                  : ""
              }</td>
							<td class="weekReinfo reinfo">${prospect.reinfoWeek}</td>
							<td class="br reinfo">
								${prospect.reinfoResponse}
							</td>
							<td class="meetup">${
                prospect.meetup == true
                  ? '<i class="size-5 mx-auto" data-lucide="check"></i>'
                  : ""
              } </td>
							<td class="bl invi"> ${
                prospect.invi == true
                  ? '<i class="size-5 mx-auto" data-lucide="check"></i>'
                  : ""
              }</td>
							<td class="weekInvite invi">${prospect.inviWeek}</td>
							<td class="br invi">
								${prospect.inviResponse}
							</td>
							<td class="bl plan"> ${
                prospect.plan == true
                  ? '<i class="size-5 mx-auto" data-lucide="check"></i>'
                  : ""
              } </td>
							<td class="weekPlan plan">${prospect.planWeek}</td>
							<td class="br plan">
								${prospect.planStatus}
							</td>
							<td class="remarks">${prospect.remarks}</td>
						</tr>
        `);
  lucide.createIcons();
}

function setnlCountNL(count) {
  if (count > 0) {
    $("#paginationNL").removeClass("hidden");
  } else {
    $("#paginationNL").addClass("hidden");
  }
  nlCountNL.innerHTML = count;
  fromProspectNL.innerHTML = (parseInt(pageNumberNL.innerHTML) - 1) * 10 + 1;
  if (count > parseInt(pageNumberNL.innerHTML) * 10) {
    toProspectNL.innerHTML = parseInt(pageNumberNL.innerHTML) * 10;
  } else {
    toProspectNL.innerHTML = count;
  }
}

function goBackNL() {
  if (parseInt(pageNumberNL.innerHTML) > 1) {
    pageNumberNL.innerHTML = parseInt(pageNumberNL.innerHTML) - 1;
  }
  if (isFilter2) {
    generateNL(searchedNL2);
  } else if (isFilter) {
    generateNL(searchedNL);
  } else {
    generateNL(namelist);
  }
}

function goForwardNL() {
  if (parseInt(pageNumberNL.innerHTML) < namelist.length / 10) {
    pageNumberNL.innerHTML = parseInt(pageNumberNL.innerHTML) + 1;
  }
  if (isFilter2) {
    generateNL(searchedNL2);
  } else if (isFilter) {
    generateNL(searchedNL);
  } else {
    generateNL(namelist);
  }
}

function showAlert(content, type = "success") {
  $("#alertNL")
    .removeClass("alert-error")
    .removeClass("alert-info")
    .removeClass("alert-primary")
    .removeClass("alert-success")
    .addClass("alert-" + type)
    .removeClass("hidden");
  alertContent.innerHTML = content;
}

function getNLData(uid) {
  curr_uid = uid;
  $("#downloadBtn").attr("disabled", true);
  $("#loadingNL").removeClass("hidden");
  const data = { uid: uid };
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add/getNLData");
  xhttp.onload = function () {
    const response = JSON.parse(this.responseText);
    namelist = response;
    generateNL(namelist);
    $("#downloadBtn").attr("disabled", false);
    $("#fliterDropDown").attr("disabled", false);
    $("#loadingNL").addClass("hidden");
  };
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(data));
}

function getKIVData(callback) {
  const data = { uid: curr_uid };
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add/getKIVData");
  xhttp.onload = function () {
    const response = JSON.parse(this.responseText);
    kiv = response;
    callback();
  };
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(data));
}

function getName(id) {
  for (let i = 0; i < namelist.length; i++) {
    if (namelist[i].id == id) {
      return namelist[i].name;
    }
  }
}

//loading
function loadNameListUI(namelist, count) {
  $("#namelistTable").empty();
  var sl = 1 + (parseInt(pageNumberNL.innerHTML) - 1) * 10;
  for (let i = 0; i < namelist.length; i++) {
    generateRowNamelistUI(sl, namelist[i]);
    sl++;
  }
  setnlCountNL(count);
}

function generateNL(namelist) {
  if (namelist.length > parseInt(pageNumberNL.innerHTML) * 10) {
    loadNameListUI(
      namelist.slice(
        (parseInt(pageNumberNL.innerHTML) - 1) * 10,
        parseInt(pageNumberNL.innerHTML) * 10
      ),
      namelist.length
    );
  } else {
    loadNameListUI(
      namelist.slice(
        (parseInt(pageNumberNL.innerHTML) - 1) * 10,
        namelist.length
      ),
      namelist.length
    );
  }

  if (isFilter) {
    enableSelectionUI($("#fliterDropDown").val());
  }
  if (isFilter2) {
    enableSelectionUI2($("#fliterDropDown2").val());
  }
}

generateSortWeekDropDownUI();

//loadnamelist
// getNLData();
