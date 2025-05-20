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
var nodeCount = 0;

function sumData(week, group) {
  for (let i = settingsJson.totalViewSKBColSpan; i < fields.length - 1; i++) {
    var total = 0;
    $(`.${fields[i]}_week${week}_${group}`).each(function () {
      if ($(this).val() != "") {
        total += parseInt($(this).val());
      }
    });
    $(".total" + fields[i] + `_week${week}_${group}`).html(total);
  }
  // console.log(fields);
  // console.log(fieldsSapphire);
}

function updateTotalToSapphire(week, year) {
  //update total data to Sapphire Sayantan
  // console.log(settingsJson.connections);
  // console.log(nodeCount);

  var data = "{";
  // data += `"nodeCount" : ` + nodeCount + ", ";
  for (let i = 0; i < settingsJson.connections.length; i++) {
    data +=
      `"${settingsJson.connections[i].endNode}" : ` +
      $(".total" + settingsJson.connections[i].startNode).html();
    if (i != settingsJson.connections.length - 1) {
      data += ", ";
    }
  }
  data += "}";
  console.log(JSON.parse(data));

  var updateData = { week: week, year: year, obj: JSON.parse(data) };
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/view/updateTotalToSapphire");
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(updateData));
}

function sumSapphireData(week, group) {
  for (
    let i = settingsJson.totalViewSapphireColSpan;
    i < fieldsSapphire.length - 1;
    i++
  ) {
    var total = 0;
    $(`.${fieldsSapphire[i]}-Sapphire_week${week}_${group}`).each(function () {
      if ($(this).val() != "") {
        total += parseInt($(this).val());
      }
    });
    $(
      ".total" + fieldsSapphire[i] + "-Sapphire" + `_week${week}_${group}`
    ).html(total);
  }
}

function getTDClass(field) {
  var ret = "done-data";
  if (field.toLowerCase().includes("target")) {
    ret = "bg-warning";
  } else if (field.toLowerCase().includes("list")) {
    ret = "bg-info";
  } else if (field == "plans") {
    ret = "bg-success";
  } else if (field == "remarks") {
    ret = "";
  } else if (field.toLowerCase().includes("done")) {
    ret = "done_data";
  } else if (field.toLowerCase().includes("pending")) {
    ret = "bg-plan";
  }

  return ret;
}

function getTDClassSapphire(field) {
  var ret = "done_data";

  if (field.toLowerCase().includes("meeting")) {
    ret = "bg-warning";
  } else if (field.toLowerCase().includes("uv")) {
    ret = "bg-secondary-content";
  } else if (field.toLowerCase().includes("node")) {
    ret = "bg-info";
  } else if (field == "plans") {
    ret = "bg-success";
  } else if (field == "remarks") {
    ret = "";
  } else if (field.toLowerCase().includes("pending")) {
    ret = "bg-plan";
  }

  return ret;
}

function getData() {
  $("#tabs_skb").addClass("hidden");
  $("#tabs_sapphire").addClass("hidden");

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
    nodeCount = response.length;
    var tab_content = "";

    if (groupSearch == "SKB") {
      for (let i = 0; i < response.length; i++) {
        var rowTable = "<tr>";
        for (let j = 0; j < fields.length; j++) {
          if (j == 0) {
            rowTable += `<th class="bb bl">${response[i].sl}</th>`;
          } else if (j == 1) {
            rowTable +=
              '<td class="bl br bb">' + response[i][fields[j]] + "</td>";
          } else if (j == fields.length - 1) {
            rowTable += `<td class="bl br bb text-center px-1"><input type="text" class="input input-sm ${getTDClass(
              fields[j]
            )} ${fields[j]} ${response[i].name + "-" + fields[j]}" value="${
              response[i][fields[j]]
            }" onchange="valueChanged('${response[i].name}', '${
              fields[j]
            }')"></td>`;
          } else {
            rowTable += `<td class="bl br bb text-center px-1"><input type="text" class="input input-sm ${getTDClass(
              fields[j]
            )} ${fields[j]}_week${wk}_${groupSearch} ${
              response[i].name + "-" + fields[j]
            }" value="${
              response[i][fields[j]] > 0 ? response[i][fields[j]] : ""
            }" onchange="valueChanged('${response[i].name}', '${
              fields[j]
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
          )} total${fields[i]}_week${wk}_${groupSearch}"></th>`;
        }
      }
      rowTable += "</tr>";
      tab_content += rowTable;
    } else {
      for (let i = 0; i < response.length; i++) {
        var rowTable = "<tr>";
        for (let j = 0; j < fieldsSapphire.length; j++) {
          if (j == 0) {
            rowTable += '<th class="bb bl">' + response[i].sl + "</th>";
          } else if (j == 1) {
            rowTable +=
              '<td class="bl br bb">' +
              response[i][fieldsSapphire[j]] +
              "</td>";
          } else if (j == fieldsSapphire.length - 1) {
            rowTable += `<td class="bl br bb text-center px-1"><input type="text" class="input input-sm ${getTDClassSapphire(
              fieldsSapphire[j]
            )} ${fieldsSapphire[j]}-Sapphire ${
              response[i].name + "-" + fieldsSapphire[j]
            }-Sapphire" value="${
              response[i][fieldsSapphire[j]]
            }" onchange="valueChanged('${response[i].name}', '${
              fieldsSapphire[j]
            }', 'Sapphire')"></td>`;
          } else {
            rowTable += `<td class="bl br bb text-center px-1"><input type="text" class="input input-sm ${getTDClassSapphire(
              fieldsSapphire[j]
            )} ${fieldsSapphire[j]}-Sapphire_week${wk}_${groupSearch} ${
              response[i].name + "-" + fieldsSapphire[j]
            }-Sapphire" value="${
              response[i][fieldsSapphire[j]] > 0
                ? response[i][fieldsSapphire[j]]
                : ""
            }" onchange="valueChanged('${response[i].name}', '${
              fieldsSapphire[j]
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
          )} total${
            fieldsSapphire[i]
          }-Sapphire_week${wk}_${groupSearch}"></th>`;
        }
      }
      rowTable += "</tr>";
      tab_content += rowTable;

      // sumData();
    }

    const tab = `
                        <label class="tab text-start items-center">
                            <input type="radio" name="my_tabs_4" checked />
                            <i class="size-4 me-2" data-lucide="calendar" class="mr-2"></i>
                            <span class="flex mr-7 items-center">
                                Week ${wk} <span class="badge badge-sm badge-primary ml-2">${groupSearch}</span>
                            </span>
                            <button class="btn btn-sm btn-square btn-ghost absolute right-1 top-1" onclick="removeTab(this)"><i class="size-5" data-lucide="x"></i></button>
                        </label>
                        <div class="tab-content bg-base-100 border-base-300 p-6">
							<div class="overflow-x-auto">
								<table id="table_week${wk}_${groupSearch}" class="table table-xs table-zebra" data-theme="light">
									<thead>
										${
                      groupSearch == "SKB"
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

    if (groupSearch == "SKB") {
      sumData(wk, groupSearch);
    } else {
      sumSapphireData(wk, groupSearch);
    }

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

  $(elem).parent().next().remove();
  $(elem).parent().remove();
}

function valueChanged(docName, triggeredFrom, group = "SKB") {
  var wk = document.getElementById("inputWeek").value;
  var yr = document.getElementById("inputYear").value;

  if (group == "SKB") {
    var value_input = $("." + docName + "-" + triggeredFrom).val();

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
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
    sumData(wk, group);
    updateTotalToSapphire(wk, yr);
  } else {
    var value_input = $(
      "." + docName + "-" + triggeredFrom + "-Sapphire"
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
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
    sumSapphireData(wk, group);
  }
}

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
  };
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
}

loadSettings();
loadWeekDropdown();
