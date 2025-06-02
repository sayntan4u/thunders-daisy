function loadWeekDropdown() {
  var weeks = "";
  for (let i = 1; i <= 53; i++) {
    weeks += `<option>${i}</option>`;
  }
  $("#inputWeek").append(weeks);
}

// Activity Search functionality
$("#searchActivity").on("click", function () {
  $(this).html('<span class="loading loading-spinner loading-sm"></span>');
  $(this).attr("disabled", true);
  getData();
});

function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

function getFields(table) {
  const fields = [];
  for (let i = 0; i < table.length; i++) {
    // addField(SKB_table[i].header);

    if (table[i].sub_heading.length > 0) {
      for (let j = 0; j < table[i].sub_heading.length; j++) {
        // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
        fields.push(
          camelize((table[i].header + table[i].sub_heading[j]).toString())
        );
      }
    } else {
      fields.push(camelize(table[i].header));
    }
  }

  return fields;
}

var settingsJson = {};
var fields = [];
var fieldsSapphire = [];

function sumData(week, year, group) {
  for (let i = settingsJson.totalViewSKBColSpan; i < fields.length - 1; i++) {
    var total = 0;
    $(`.${fields[i]}_week${week}_${year}_${group}`).each(function () {
      if ($(this).val() != "") {
        total += parseInt($(this).val());
      }
    });
    $(".total" + fields[i] + `_week${week}_${year}_${group}`).html(total);
  }
  // console.log(fields);
  // console.log(fieldsSapphire);
}

function updateTotalToSapphire(week, year) {
  var data = "{";
  // data += `"nodeCount" : ` + nodeCount + ", ";
  for (let i = 0; i < settingsJson.connections.length; i++) {
    const val = $(".total" + settingsJson.connections[i].startNode + `_week${week}_${year}_SKB`).html();
    data += `"${settingsJson.connections[i].endNode}" : ` + val
    if (i != settingsJson.connections.length - 1) {
      data += ", ";
    }

    $(`.${settingsJson.connections[i].endNode}-Sapphire_week${week}_${year}_Sapphire`).each(function () {
      if ($(this).hasClass(`Sayantan-${settingsJson.connections[i].endNode}_week${week}_${year}_Sapphire`)) {
        $(this).val(val);
      }
    });
    updateDataSession(week, year, "Sapphire", "Sayantan", settingsJson.connections[i].endNode, val);
  }
  sumSapphireData(week, year, "Sapphire");
  data += "}";
  // console.log(data);

  var updateData = { week: week, year: year, obj: JSON.parse(data) };
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/view/updateTotalToSapphire");
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(updateData));
}

function sumSapphireData(week, year, group) {
  for (
    let i = settingsJson.totalViewSapphireColSpan;
    i < fieldsSapphire.length - 1;
    i++
  ) {
    var total = 0;
    $(`.${fieldsSapphire[i]}-Sapphire_week${week}_${year}_${group}`).each(function () {
      if ($(this).val() != "") {
        total += parseInt($(this).val());
      }
    });
    $(
      ".total" + fieldsSapphire[i] + "-Sapphire" + `_week${week}_${year}_${group}`
    ).html(total);
  }
}

function getTDClass(field) {
  var ret = "bg-done";
  if (field.toLowerCase().includes("target")) {
    ret = "bg-target";
  } else if (field.toLowerCase().includes("list")) {
    ret = "bg-list";
  } else if (field == "plans") {
    ret = "bg-plan";
  } else if (field == "remarks") {
    ret = "";
  } else if (field.toLowerCase().includes("done")) {
    ret = "bg-done";
  } else if (field.toLowerCase().includes("pending")) {
    ret = "bg-pending";
  }

  return ret;
}

function getTDClassSapphire(field) {
  var ret = "bg-done";

  if (field.toLowerCase().includes("meeting")) {
    ret = "bg-secondMeeting";
  } else if (field.toLowerCase().includes("uv")) {
    ret = "bg-uv";
  } else if (field.toLowerCase().includes("node")) {
    ret = "bg-node";
  } else if (field == "plans") {
    ret = "bg-plan";
  } else if (field == "remarks") {
    ret = "";
  } else if (field.toLowerCase().includes("pending")) {
    ret = "bg-pending";
  }

  return ret;
}

function getData() {

  var wk = document.getElementById("inputWeek").value;
  var yr = document.getElementById("inputYear").value;
  var groupSearch = $("#groupSelect").val();

  // console.log(groupSearch);

  const data = { week: wk, year: yr, group: groupSearch };

  // console.log(data);
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    // alert(JSON.parse(this.responseText).length);

    const response = JSON.parse(this.responseText);

    //genereate tab content
    generateTabContent(wk, yr, groupSearch, response);
    //set data to session storage
    setDataSession(wk, yr, groupSearch, response);

    $("#searchActivity").html('<i class="h-5 w-5" data-lucide="search"></i>');
    loadIcons();
    $("#searchActivity").attr("disabled", false);
  };
  xhttp.open("POST", "/view/getData");
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(data));
  // $('.alert').addClass("show");
}

function loadData(wk, yr, groupSearch) {

  // console.log(groupSearch);

  const data = { week: wk, year: yr, group: groupSearch };

  // console.log(data);
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    // alert(JSON.parse(this.responseText).length);

    const response = JSON.parse(this.responseText);

    //genereate tab content
    loadTabContent(wk, yr, groupSearch, response);
    //set data to session storage
    setLoadedDataSession(wk, yr, groupSearch, response);

    showAlert();

    $("#searchActivity").html('<i class="h-5 w-5" data-lucide="search"></i>');
    loadIcons();
    $("#searchActivity").attr("disabled", false);
  };
  xhttp.open("POST", "/view/getData");
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(data));
  // $('.alert').addClass("show");
}

function removeTab(elem) {
  if ($(elem).siblings("input").prop("checked")) {
    if ($(elem).parent().prev().prev().hasClass("tab")) {
      $(elem).parent().prev().prev().children("input").prop("checked", true);
    } else if ($(elem).parent().next().next().hasClass("tab")) {
      $(elem).parent().next().next().children("input").prop("checked", true);
    }
  }

  const week = $(elem).siblings("span").children(".week").html();
  const year = $(elem).siblings("span").children(".year").html();
  const group = $(elem).siblings("span").children(".badge").html();

  // console.log(week, year, group);
  deleteDataSession(week, year, group);

  $(elem).parent().next().remove();
  $(elem).parent().remove();
  //need to remove session data here
}

function valueChanged(wk, yr, docName, triggeredFrom, group = "SKB") {
  // var wk = document.getElementById("inputWeek").value;
  // var yr = document.getElementById("inputYear").value;

  if (group == "SKB") {
    var value_input = $("." + docName + "-" + triggeredFrom + `_week${wk}_${yr}_SKB`).val();

    if (value_input == "" && triggeredFrom != "remarks") {
      value_input = 0;
    }

    const data = {
      week: wk,
      year: yr,
      name: docName,
      fieldName: triggeredFrom,
      value: value_input,
      group: "SKB",
    };

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/view/updateUser");
    xhttp.onload = function () {
      if (this.responseText == "success") {
        showAlert("SKB updated :  <strong>" + docName + "</strong> - " + triggeredFrom);
      } else {
        showAlert(this.responseText);
      }

    };
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
    sumData(wk, yr, group);
    updateTotalToSapphire(wk, yr);
  } else {
    var value_input = $(
      "." + docName + "-" + triggeredFrom + `_week${wk}_${yr}_Sapphire`
    ).val();

    if (value_input == "" && triggeredFrom != "remarks") {
      value_input = 0;
    }

    const data = {
      week: wk,
      year: yr,
      name: docName,
      fieldName: triggeredFrom,
      value: value_input,
      group: "Sapphire",
    };

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/view/updateUser");
    xhttp.onload = function () {
      if (this.responseText == "success") {
        showAlert("Sapphire updated :  <strong>" + docName + "</strong> - " + triggeredFrom);
      } else {
        showAlert(this.responseText);
      }

    };
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
    sumSapphireData(wk, yr, group);
  }
  updateDataSession(wk, yr, group, docName, triggeredFrom, value_input);
}

//=========================================

function showAlert(content = "") {
  if (content == "") {
    content = "Data loaded!";
  }
  alert_content.innerHTML = content;
  $(".alert").removeClass("hidden");
  setTimeout(function () { $(".alert").addClass("hidden"); }, 3000);
}

//====Method for Generating Table Headers & Table Content===

function generateSKBTable(SKB_table) {
  var isSubHeading = false;

  var header = "";

  header += "<tr>";
  for (let i = 0; i < SKB_table.length; i++) {
    if (SKB_table[i].sub_heading.length > 0) {
      isSubHeading = true;
      header += `<th colspan="${SKB_table[i].sub_heading.length}" class="text-center bl br bb bt">${SKB_table[i].header}</th>`;
    } else {
      header += `<th class="text-center bl br bt">${SKB_table[i].header}</th>`;
    }
  }
  header += "</tr>";

  if (isSubHeading) {
    header += "<tr>";
    for (let i = 0; i < SKB_table.length; i++) {
      if (SKB_table[i].sub_heading.length > 0) {
        for (let j = 0; j < SKB_table[i].sub_heading.length; j++) {
          header += `<th class="text-center bb bl br">${SKB_table[i].sub_heading[j]}</th>`;
        }
      } else {
        header += `<th class="bl br bb"></th>`;
      }
    }
    header += "</tr>";
  }

  return header;
}

function generateSapphireTable(Sapphire_table) {
  var isSubHeading = false;

  var header = "";

  header += "<tr>";

  for (let i = 0; i < Sapphire_table.length; i++) {
    if (Sapphire_table[i].sub_heading.length > 0) {
      isSubHeading = true;
      header +=
        `<th scope="col" class="text-center bb bl br bb bt" colspan="` +
        Sapphire_table[i].sub_heading.length +
        `">` +
        Sapphire_table[i].header +
        `</th>`;
    } else {
      header +=
        `<th scope="col" class="text-center bb bl br bt">` +
        Sapphire_table[i].header +
        `</th>`;
    }
  }

  if (isSubHeading) {
    header += "<tr>";
    for (let i = 0; i < Sapphire_table.length; i++) {
      if (Sapphire_table[i].sub_heading.length > 0) {
        for (let j = 0; j < Sapphire_table[i].sub_heading.length; j++) {
          header +=
            `<th scope="col" class="text-center bb bl br">` +
            Sapphire_table[i].sub_heading[j] +
            `</th>`;
        }
      } else {
        header += `<th scope="col" class="bl br bb"></th>`;
      }
    }
    header += "</tr>";
  }

  return header;
}

function generateTabContent(week, year, group, jsonData) {
  var tab_content = "";

  if (group == "SKB") {
    for (let i = 0; i < jsonData.length; i++) {
      var rowTable = "<tr>";
      for (let j = 0; j < fields.length; j++) {
        if (j == 0) {
          rowTable += `<th class="bb bl">${jsonData[i].sl}</th>`;
        } else if (j == 1) {
          rowTable +=
            '<td class="bl br bb text-sm font-semibold">' + jsonData[i][fields[j]] + "</td>";
        } else if (j == fields.length - 1) {
          rowTable += `<td class="bl br bb text-center px-1"><input type="text" class="input input-sm ${getTDClass(
            fields[j]
          )} ${fields[j]} ${jsonData[i].name + "-" + fields[j] + `_week${week}_${year}_${group}`}" value="${jsonData[i][fields[j]]
            }" onchange="valueChanged('${week}','${year}','${jsonData[i].name}', '${fields[j]
            }')"></td>`;
        } else {
          rowTable += `<td class="bl br bb text-center px-1"><input type="text" class="input input-sm ${getTDClass(
            fields[j]
          )} ${fields[j]}_week${week}_${year}_${group} ${jsonData[i].name + "-" + fields[j] + `_week${week}_${year}_${group}`
            }" value="${jsonData[i][fields[j]] > 0 ? jsonData[i][fields[j]] : ""
            }" onchange="valueChanged('${week}','${year}','${jsonData[i].name}', '${fields[j]
            }')"></td>`;
        }
      }
      rowTable += "</tr>";
      tab_content += rowTable;
    }

    var rowTable = `<tr><th colspan="${settingsJson.totalViewSKBColSpan}" class="bb bl text-center bg-neutral text-neutral-content py-2">Total</th>`;
    for (let i = settingsJson.totalViewSKBColSpan; i < fields.length; i++) {
      if (i == fields.length - 1) {
        rowTable += `<th class="bl br bb text-center"></th>`;
      } else {
        rowTable += `<th class="bl br bb text-center ${getTDClass(
          fields[i]
        )} total${fields[i]}_week${week}_${year}_${group}"></th>`;
      }
    }
    rowTable += "</tr>";
    tab_content += rowTable;
  } else {
    for (let i = 0; i < jsonData.length; i++) {
      var rowTable = "<tr>";
      for (let j = 0; j < fieldsSapphire.length; j++) {
        if (j == 0) {
          rowTable += '<th class="bb bl">' + jsonData[i].sl + "</th>";
        } else if (j == 1) {
          rowTable +=
            '<td class="bl br bb text-sm font-semibold">' +
            jsonData[i][fieldsSapphire[j]] +
            "</td>";
        } else if (j == fieldsSapphire.length - 1) {
          rowTable += `<td class="bl br bb text-center px-1"><input type="text" class="input input-sm ${getTDClassSapphire(
            fieldsSapphire[j]
          )} ${fieldsSapphire[j]}-Sapphire ${jsonData[i].name + "-" + fieldsSapphire[j] + `_week${week}_${year}_${group}`
            }" value="${jsonData[i][fieldsSapphire[j]]
            }" onchange="valueChanged('${week}','${year}','${jsonData[i].name}', '${fieldsSapphire[j]
            }', 'Sapphire')"></td>`;
        } else {
          rowTable += `<td class="bl br bb text-center px-1"><input type="text" class="input input-sm ${getTDClassSapphire(
            fieldsSapphire[j]
          )} ${fieldsSapphire[j]}-Sapphire_week${week}_${year}_${group} ${jsonData[i].name + "-" + fieldsSapphire[j] + `_week${week}_${year}_${group}`
            }" value="${jsonData[i][fieldsSapphire[j]] > 0
              ? jsonData[i][fieldsSapphire[j]]
              : ""
            }" onchange="valueChanged('${week}','${year}','${jsonData[i].name}', '${fieldsSapphire[j]
            }', 'Sapphire')"></td>`;
        }
      }
      rowTable += "</tr>";
      tab_content += rowTable;
    }

    var rowTable = `<tr><th colspan="${settingsJson.totalViewSapphireColSpan}" class="bb bl text-center bg-neutral text-neutral-content py-2">Total</th>`;
    for (
      let i = settingsJson.totalViewSapphireColSpan;
      i < fieldsSapphire.length;
      i++
    ) {
      if (i == fieldsSapphire.length - 1) {
        rowTable += `<th class="bl br bb text-center"></th>`;
      } else {
        rowTable += `<th class="bl br bb text-center ${getTDClassSapphire(
          fieldsSapphire[i]
        )} total${fieldsSapphire[i]
          }-Sapphire_week${week}_${year}_${group}"></th>`;
      }
    }
    rowTable += "</tr>";
    tab_content += rowTable;

  }

  const tab = `
                        <label class="tab text-start items-center">
                            <input type="radio" name="my_tabs_4" checked />
                            <i class="size-4 me-2" data-lucide="calendar" class="mr-2"></i>
                            <span class="flex mr-7 items-center">
                                Week 
                                <span class="week ml-1">${week}</span>, 
                                <span class="year">${year}</span> 
                                <span class="badge badge-sm badge-primary ml-2">${group}</span>
                            </span>
                            <button class="btn btn-sm btn-square btn-ghost absolute right-1 top-1" onclick="removeTab(this)"><i class="size-5" data-lucide="x"></i></button>
                        </label>
                        <div class="tab-content bg-base-100 border-base-300 p-6">
							<div class="overflow-x-auto">
								<table id="table_week${week}_${group}" class="table table-xs table-zebra">
									<thead>
										${group == "SKB"
      ? generateSKBTable(
        settingsJson.initTableView.concat(
          settingsJson.SKB_table,
          settingsJson.endTable
        )
      )
      : generateSapphireTable(
        settingsJson.initTableView.concat(
          settingsJson.Sapphire_table,
          settingsJson.endTable
        )
      )
    }
									</thead>
									<tbody>
                                        ${tab_content}
									</tbody>
								</table>
							</div>
						</div>
             `;
  $("#tabs").append(tab);
  if (group == "SKB") {
    sumData(week, year, group);
  } else {
    sumSapphireData(week, year, group);
  }
  loadIcons();
}

function loadTabContent(week, year, group, jsonData) {

  var tab_content = "";

  if (group == "SKB") {
    for (let i = 0; i < jsonData.length; i++) {
      var rowTable = "<tr>";
      for (let j = 0; j < fields.length; j++) {
        if (j == 0) {
          rowTable += `<th class="bb bl">${jsonData[i].sl}</th>`;
        } else if (j == 1) {
          rowTable +=
            '<td class="bl br bb text-sm font-semibold">' + jsonData[i][fields[j]] + "</td>";
        } else if (j == fields.length - 1) {
          rowTable += `<td class="bl br bb text-center px-1"><input type="text" class="input input-sm ${getTDClass(
            fields[j]
          )} ${fields[j]} ${jsonData[i].name + "-" + fields[j] + `_week${week}_${year}_${group}`}" value="${jsonData[i][fields[j]]
            }" onchange="valueChanged('${week}','${year}','${jsonData[i].name}', '${fields[j]
            }')"></td>`;
        } else {
          rowTable += `<td class="bl br bb text-center px-1"><input type="text" class="input input-sm ${getTDClass(
            fields[j]
          )} ${fields[j]}_week${week}_${year}_${group} ${jsonData[i].name + "-" + fields[j] + `_week${week}_${year}_${group}`
            }" value="${jsonData[i][fields[j]] > 0 ? jsonData[i][fields[j]] : ""
            }" onchange="valueChanged('${week}','${year}','${jsonData[i].name}', '${fields[j]
            }')"></td>`;
        }
      }
      rowTable += "</tr>";
      tab_content += rowTable;
    }

    var rowTable = `<tr><th colspan="${settingsJson.totalViewSKBColSpan}" class="bb bl text-center bg-neutral text-neutral-content py-2">Total</th>`;
    for (let i = settingsJson.totalViewSKBColSpan; i < fields.length; i++) {
      if (i == fields.length - 1) {
        rowTable += `<th class="bl br bb text-center"></th>`;
      } else {
        rowTable += `<th class="bl br bb text-center ${getTDClass(
          fields[i]
        )} total${fields[i]}_week${week}_${year}_${group}"></th>`;
      }
    }
    rowTable += "</tr>";
    tab_content += rowTable;
  } else {
    for (let i = 0; i < jsonData.length; i++) {
      var rowTable = "<tr>";
      for (let j = 0; j < fieldsSapphire.length; j++) {
        if (j == 0) {
          rowTable += '<th class="bb bl">' + jsonData[i].sl + "</th>";
        } else if (j == 1) {
          rowTable +=
            '<td class="bl br bb text-sm font-semibold">' +
            jsonData[i][fieldsSapphire[j]] +
            "</td>";
        } else if (j == fieldsSapphire.length - 1) {
          rowTable += `<td class="bl br bb text-center px-1"><input type="text" class="input input-sm ${getTDClassSapphire(
            fieldsSapphire[j]
          )} ${fieldsSapphire[j]}-Sapphire ${jsonData[i].name + "-" + fieldsSapphire[j] + `_week${week}_${year}_${group}`
            }" value="${jsonData[i][fieldsSapphire[j]]
            }" onchange="valueChanged('${week}','${year}','${jsonData[i].name}', '${fieldsSapphire[j]
            }', 'Sapphire')"></td>`;
        } else {
          rowTable += `<td class="bl br bb text-center px-1"><input type="text" class="input input-sm ${getTDClassSapphire(
            fieldsSapphire[j]
          )} ${fieldsSapphire[j]}-Sapphire_week${week}_${year}_${group} ${jsonData[i].name + "-" + fieldsSapphire[j] + `_week${week}_${year}_${group}`
            }" value="${jsonData[i][fieldsSapphire[j]] > 0
              ? jsonData[i][fieldsSapphire[j]]
              : ""
            }" onchange="valueChanged('${week}','${year}','${jsonData[i].name}', '${fieldsSapphire[j]
            }', 'Sapphire')"></td>`;
        }
      }
      rowTable += "</tr>";
      tab_content += rowTable;
    }

    var rowTable = `<tr><th colspan="${settingsJson.totalViewSapphireColSpan}" class="bb bl text-center bg-neutral text-neutral-content py-2">Total</th>`;
    for (
      let i = settingsJson.totalViewSapphireColSpan;
      i < fieldsSapphire.length;
      i++
    ) {
      if (i == fieldsSapphire.length - 1) {
        rowTable += `<th class="bl br bb text-center"></th>`;
      } else {
        rowTable += `<th class="bl br bb text-center ${getTDClassSapphire(
          fieldsSapphire[i]
        )} total${fieldsSapphire[i]
          }-Sapphire_week${week}_${year}_${group}"></th>`;
      }
    }
    rowTable += "</tr>";
    tab_content += rowTable;

  }

  // const tab = `
  //                       <label class="tab text-start items-center">
  //                           <input type="radio" name="my_tabs_4" checked />
  //                           <i class="size-4 me-2" data-lucide="calendar" class="mr-2"></i>
  //                           <span class="flex mr-7 items-center">
  //                               Week 
  //                               <span class="week ml-1">${week}</span>, 
  //                               <span class="year">${year}</span> 
  //                               <span class="badge badge-sm badge-primary ml-2">${group}</span>
  //                           </span>
  //                           <button class="btn btn-sm btn-square btn-ghost absolute right-1 top-1" onclick="removeTab(this)"><i class="size-5" data-lucide="x"></i></button>
  //                       </label>
  //                       <div class="tab-content bg-base-100 border-base-300 p-6">
  // 						<div class="overflow-x-auto">
  // 							<table id="table_week${week}_${group}" class="table table-xs table-zebra">
  // 								<thead>
  // 									${group == "SKB"
  //     ? generateSKBTable(
  //       settingsJson.initTableView.concat(
  //         settingsJson.SKB_table,
  //         settingsJson.endTable
  //       )
  //     )
  //     : generateSapphireTable(
  //       settingsJson.initTableView.concat(
  //         settingsJson.Sapphire_table,
  //         settingsJson.endTable
  //       )
  //     )
  //   }
  // 								</thead>
  // 								<tbody>
  //                                       ${tab_content}
  // 								</tbody>
  // 							</table>
  // 						</div>
  // 					</div>
  //            `;
  // $("#tabs").append(tab);

  $(`#table_week${week}_${group}`).children("tbody").append(tab_content);
  $(`#loader_week${week}_${group}`).addClass("hidden");
  $(`#loader_week${week}_${group}`).siblings(".tab_icon").removeClass("hidden");

  if (group == "SKB") {
    sumData(week, year, group);
  } else {
    sumSapphireData(week, year, group);
  }
  loadIcons();
}

function loadHeader(week, year, group) {
  const tab = `
            <label class="tab text-start items-center">
              <input type="radio" name="my_tabs_4" checked />
              <i class="tab_icon size-4 me-2 hidden" data-lucide="calendar" class="mr-2"></i>
              <div id="loader_week${week}_${group}" class="loading loading-spinner loading-xs me-2"></div>
              <span class="flex mr-7 items-center">
                                Week 
                                <span class="week ml-1">${week}</span>, 
                                <span class="year">${year}</span> 
                                <span class="badge badge-sm badge-primary ml-2">${group}</span>
              </span>
              <button class="btn btn-sm btn-square btn-ghost absolute right-1 top-1" onclick="removeTab(this)"><i class="size-5" data-lucide="x"></i></button>
            </label>
            <div class="tab-content bg-base-100 border-base-300 p-6">
							<div class="overflow-x-auto">
								<table id="table_week${week}_${group}" class="table table-xs table-zebra">
									<thead>
										${group == "SKB"
      ? generateSKBTable(
        settingsJson.initTableView.concat(
          settingsJson.SKB_table,
          settingsJson.endTable
        )
      )
      : generateSapphireTable(
        settingsJson.initTableView.concat(
          settingsJson.Sapphire_table,
          settingsJson.endTable
        )
      )
    }
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>
             `;
  $("#tabs").append(tab);
}

//=====================END======================

//====================================
// LocalStorage Methods
//
// Example :
// Data_weekNo_year_group => json
// Datas => String data - "Data_wk1_yr1_grp1, Data_wk2_yr2_grp2, ......"
//====================================

function initDataSession() {
  if (!localStorage.getItem(`dataArray`)) {
    localStorage.setItem(`dataArray`, '');
    console.log("session created");
  }
}

function setDataSession(week, year, group, data) {
  // Put the object into storage
  const dataID = `data_${week}_${year}_${group}`;
  //store data
  sessionStorage.setItem(dataID, JSON.stringify(data));
  var dataArr = localStorage.getItem('dataArray');
  dataArr += dataID + ",";
  //store data Array
  localStorage.setItem('dataArray', dataArr);
}

function setLoadedDataSession(week, year, group, data) {
  // Put the object into storage
  const dataID = `data_${week}_${year}_${group}`;
  //store data
  sessionStorage.setItem(dataID, JSON.stringify(data));
}

// function getSingleDataSession(week, year, group) {

// }

function getAllDataSession() {
  const dataArrStr = localStorage.getItem('dataArray');

  if (dataArrStr.length > 0) {
    var dataArr = dataArrStr.split(",");
    console.log("data count :" + (dataArr.length - 1).toString());

    for (i = 0; i < dataArr.length - 1; i++) {
      const data = sessionStorage.getItem(dataArr[i]);
      const week = dataArr[i].split("_")[1];
      const year = dataArr[i].split("_")[2];
      const group = dataArr[i].split("_")[3];

      if (data) {
        loadHeader(week, year, group);
        loadTabContent(week, year, group, JSON.parse(data));

        showAlert();

        $("#searchActivity").html('<i class="h-5 w-5" data-lucide="search"></i>');
        loadIcons();
        $("#searchActivity").attr("disabled", false);
        // console.log(JSON.parse(data));
      } else {
        loadHeader(week, year, group);
        loadData(week, year, group);
      }

    }
  }
}

function updateDataSession(week, year, group, name, field, value) {
  const dataID = `data_${week}_${year}_${group}`;
  const data = sessionStorage.getItem(dataID);
  if (data) {
    var jsondata = JSON.parse(data);

    for (i = 0; i < jsondata.length; i++) {
      if (jsondata[i].name == name) {
        jsondata[i][field] = value;
      }
    }

    sessionStorage.setItem(dataID, JSON.stringify(jsondata));
  }


}

function deleteDataSession(week, year, group) {
  const dataID = `data_${week}_${year}_${group}`;
  const dataArrStr = localStorage.getItem('dataArray');

  var dataArr = dataArrStr.split(",");

  var newStr = "";
  for (i = 0; i < dataArr.length - 1; i++) {
    if (dataArr[i] == dataID) {

    } else {
      newStr += dataArr[i] + ","
    }
  }
  localStorage.setItem(`dataArray`, newStr);
}


//==========ENDS=======================

function loadSettings() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/settings/getSettings");
  xhttp.onload = function () {
    const response = JSON.parse(this.responseText);
    settingsJson = response;

    const headerData = settingsJson.initTableView.concat(
      settingsJson.SKB_table,
      settingsJson.endTable
    );
    fields = getFields(headerData);

    const headerDataSapphire = settingsJson.initTableView.concat(
      settingsJson.Sapphire_table,
      settingsJson.endTable
    );
    fieldsSapphire = getFields(headerDataSapphire);

    getAllDataSession();

    $("#searchActivity").html('<i class="h-5 w-5" data-lucide="search"></i>');
    loadIcons();
    $("#searchActivity").attr("disabled", false);

  };
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
}

initDataSession();
loadSettings();
loadWeekDropdown();

