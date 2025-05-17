function loadWeekDropdown() {
    var weeks = "";
    for (let i = 1; i <= 53; i++) {
        weeks += `<option>${i}</option>`;
    }
    $("#inputWeek").append(weeks);
}

// Activity Search functionality
$('#searchActivity').on('click', function () {
    $(this).html('<span class="loading loading-spinner loading-sm"></span>');
    $(this).attr("disabled", true);
    getData();
});

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

function getFields(table) {
    const fields = [];
    for (let i = 0; i < table.length; i++) {
        // addField(SKB_table[i].header);

        if (table[i].sub_heading.length > 0) {
            for (let j = 0; j < table[i].sub_heading.length; j++) {
                // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
                fields.push(camelize((table[i].header + table[i].sub_heading[j]).toString()));
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

function sumData() {
    for (let i = settingsJson.totalViewSKBColSpan; i < fields.length - 1; i++) {
        var total = 0;
        $(`.${fields[i]}`).each(function () {

            if ($(this).val() != "") {
                total += parseInt($(this).val());
            }
        });
        $(".total" + fields[i]).html(total);
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
        data += `"${settingsJson.connections[i].endNode}" : ` + $(".total" + settingsJson.connections[i].startNode).html();
        if (i != settingsJson.connections.length - 1) {
            data += ", ";
        }
    }
    data += "}";
    console.log(JSON.parse(data));

    var updateData = { week: week, year: year, obj: JSON.parse(data) };
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/view/updateTotalToSapphire");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(updateData));
}


function sumSapphireData() {
    for (let i = settingsJson.totalViewSapphireColSpan; i < fieldsSapphire.length - 1; i++) {
        var total = 0;
        $(`.${fieldsSapphire[i]}-Sapphire`).each(function () {
            if ($(this).val() != "") {
                total += parseInt($(this).val());
            }
        });
        $(".total" + fieldsSapphire[i] + "-Sapphire").html(total);
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

    return ret
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

    return ret
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

        if (groupSearch == "SKB") {
            $(".skbData").html("");
            for (let i = 0; i < response.length; i++) {
                var rowTable = '<tr>';
                for (let j = 0; j < fields.length; j++) {
                    if (j == 0) {
                        rowTable += `<th class="bb bl">${response[i].sl}</th>`;
                    } else if (j == 1) {
                        rowTable += '<td class="bl br bb">' + response[i][fields[j]] + '</td>';
                    } else if (j == fields.length - 1) {
                        rowTable += `<td class="bl br bb text-center px-1"><input type="text" class="input input-sm ${getTDClass(fields[j])} ${fields[j]} ${response[i].name + '-' + fields[j]}" value="${response[i][fields[j]]}" onchange="valueChanged('${response[i].name}', '${fields[j]}')"></td>`;
                    } else {
                        rowTable += `<td class="bl br bb text-center px-1"><input type="text" class="input input-sm ${getTDClass(fields[j])} ${fields[j]} ${response[i].name + '-' + fields[j]}" value="${(response[i][fields[j]] > 0) ? response[i][fields[j]] : ''}" onchange="valueChanged('${response[i].name}', '${fields[j]}')"></td>`;
                    }
                }
                rowTable += '</tr>';
                $(".skbData").append(rowTable);
            }

            var rowTable = `<tr><th colspan="${settingsJson.totalViewSKBColSpan}" class="bb bl text-center bg-neutral text-neutral-content py-2">Total</th>`;
            for (let i = settingsJson.totalViewSKBColSpan; i < fields.length; i++) {
                if (i == fields.length - 1) {
                    rowTable += `<th class="bl br bb text-center"></th>`;
                } else {
                    rowTable += `<th class="bl br bb text-center ${getTDClass(fields[i])} total${fields[i]}"></th>`;
                }
            }
            rowTable += '</tr>';
            $(".skbData").append(rowTable);


            sumData();

            $(".prevWeek").html("Week " + (wk - 1) + " Data");
            $(".currWeek").html("Week " + wk + " Data");
            $(".currGroup").html(groupSearch);

            $("#tabs_skb").removeClass("hidden");
        } else {
            $(".sapphireData").html("");

            for (let i = 0; i < response.length; i++) {
                var rowTable = '<tr>';
                for (let j = 0; j < fieldsSapphire.length; j++) {
                    if (j == 0) {
                        rowTable += '<th class="bb bl">' + response[i].sl + '</th>';
                    } else if (j == 1) {
                        rowTable += '<td class="bl br bb">' + response[i][fieldsSapphire[j]] + '</td>';
                    } else if (j == fieldsSapphire.length - 1) {
                        rowTable += `<td class="bl br bb text-center px-1"><input type="text" class="input input-sm ${getTDClassSapphire(fieldsSapphire[j])} ${fieldsSapphire[j]}-Sapphire ${response[i].name + '-' + fieldsSapphire[j]}-Sapphire" value="${response[i][fieldsSapphire[j]]}" onchange="valueChanged('${response[i].name}', '${fieldsSapphire[j]}', 'Sapphire')"></td>`;
                    } else {
                        rowTable += `<td class="bl br bb text-center px-1"><input type="text" class="input input-sm ${getTDClassSapphire(fieldsSapphire[j])} ${fieldsSapphire[j]}-Sapphire ${response[i].name + '-' + fieldsSapphire[j]}-Sapphire" value="${(response[i][fieldsSapphire[j]] > 0) ? response[i][fieldsSapphire[j]] : ''}" onchange="valueChanged('${response[i].name}', '${fieldsSapphire[j]}', 'Sapphire')"></td>`;
                    }
                }
                rowTable += '</tr>';
                $(".sapphireData").append(rowTable);
            }

            var rowTable = `<tr><th colspan="${settingsJson.totalViewSapphireColSpan}" class="bb bl text-center bg-neutral text-neutral-content py-2">Total</th>`;
            for (let i = settingsJson.totalViewSapphireColSpan; i < fieldsSapphire.length; i++) {
                if (i == fieldsSapphire.length - 1) {
                    rowTable += `<th class="bl br bb text-center"></th>`;
                } else {
                    rowTable += `<th class="bl br bb text-center ${getTDClassSapphire(fieldsSapphire[i])} total${fieldsSapphire[i]}-Sapphire"></th>`;
                }
            }
            rowTable += '</tr>';
            $(".sapphireData").append(rowTable);

            // sumData();
            sumSapphireData();

            $(".prevWeek").html("Week " + (wk - 1) + " Data");
            $(".currWeek").html("Week " + wk + " Data");

            $(".currGroup").html(groupSearch);

            $("#tabs_sapphire").removeClass("hidden");
        }

        // $(".loading").addClass("hide");

        if (wk > 1 && groupSearch == "SKB") {
            // $("#prevWeekAcordion").removeClass("hidden");
            getPrevWeekData(wk - 1, yr);
        }
        if (wk > 1 && groupSearch == "Sapphire") {
            $("#prevWeekAcordionSapphire").removeClass("hide");
            getPrevWeekDataSapphire(wk - 1, yr);
        }

    }
    xhttp.open("POST", "/view/getData");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
    // $('.alert').addClass("show");
}

function valueChanged(docName, triggeredFrom, group = "SKB") {

    var wk = document.getElementById("inputWeek").value;
    var yr = document.getElementById("inputYear").value;

    if (group == "SKB") {
        var value_input = $("." + docName + "-" + triggeredFrom).val();

        if (value_input == '' && triggeredFrom != "remarks") {
            value_input = 0;
        }

        const data = { week: wk, year: yr, name: docName, fieldName: triggeredFrom, value: value_input, group: "SKB" };

        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/view/updateUser");
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(data));
        sumData();
        updateTotalToSapphire(wk, yr);
    } else {
        var value_input = $("." + docName + "-" + triggeredFrom + "-Sapphire").val();


        if (value_input == '' && triggeredFrom != "remarks") {
            value_input = 0;
        }

        const data = { week: wk, year: yr, name: docName, fieldName: triggeredFrom, value: value_input, group: "Sapphire" };

        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/view/updateUser");
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(data));
        sumSapphireData();
    }


}

function getPrevWeekData(wk, yr) {

    const data = { week: wk.toString(), year: yr, group: "SKB" };

    // console.log(data);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        // alert(JSON.parse(this.responseText).length);

        const response = JSON.parse(this.responseText);

        $(".skbPrevData").html("");

        for (let i = 0; i < response.length; i++) {
            var rowTable = '<tr>';
            for (let j = 0; j < fields.length - 1; j++) {
                if (j == 0) {
                    rowTable += '<th class="bb bl">' + response[i].sl + '</th>';
                } else if (j == 1) {
                    rowTable += '<td class="bl br bb">' + response[i][fields[j]] + '</td>';
                } else {
                    rowTable += `<td class="bl br bb text-center px-1 ${getTDClass(fields[j])} p${fields[j]}">${response[i][fields[j]]}</td>`;
                }
            }
            rowTable += '</tr>';
            $(".skbPrevData").append(rowTable);
        }

        var rowTable = `<tr><th colspan="${settingsJson.totalViewSKBColSpan}" class="bb bl text-center bg-neutral text-neutral-content py-2">Total </th>`;
        for (let i = settingsJson.totalViewSKBColSpan; i < fields.length - 1; i++) {
            rowTable += `<th class="bl br bb text-center ${getTDClass(fields[i])} ptotal${fields[i]}"></th>`;
        }
        rowTable += '</tr>';
        $(".skbPrevData").append(rowTable);


        sumPrevData();

        $(".prev").removeClass("hidden");
        $("#searchActivity").html('<i class="h-5 w-5" data-lucide="search"></i>');
        loadIcons();
        $("#searchActivity").attr("disabled", false);
    }
    xhttp.open("POST", "/view/getData");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}

function getPrevWeekDataSapphire(wk, yr) {

    const data = { week: wk.toString(), year: yr, group: "Sapphire" };

    // console.log(data);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        // alert(JSON.parse(this.responseText).length);

        const response = JSON.parse(this.responseText);

        $(".sapphirePrevData").html("");

        for (let i = 0; i < response.length; i++) {
            var rowTable = '<tr>';
            for (let j = 0; j < fieldsSapphire.length - 1; j++) {
                if (j == 0) {
                    rowTable += '<th class="bb bl">' + response[i].sl + '</th>';
                } else if (j == 1) {
                    rowTable += '<td class="bl br bb">' + response[i][fieldsSapphire[j]] + '</td>';
                } else {
                    rowTable += `<td class="bl br bb text-center px-1 ${getTDClassSapphire(fieldsSapphire[j])} p${fieldsSapphire[j]}-Sapphire">${response[i][fieldsSapphire[j]]}</td>`;
                }
            }
            rowTable += '</tr>';
            $(".sapphirePrevData").append(rowTable);
        }

        var rowTable = `<tr><th colspan="${settingsJson.totalViewSapphireColSpan}" class="bb bl text-center bg-neutral text-neutral-content py-2"> Total </th>`;
        for (let i = settingsJson.totalViewSapphireColSpan; i < fieldsSapphire.length - 1; i++) {
            rowTable += `<th class="bl br bb text-center ${getTDClassSapphire(fieldsSapphire[i])} ptotal${fieldsSapphire[i]}-Sapphire"></th>`;
        }
        rowTable += '</tr>';
        $(".sapphirePrevData").append(rowTable);

        sumPrevDataSapphire();

        $(".prev").removeClass("hidden");
        $("#searchActivity").html('<i class="h-5 w-5" data-lucide="search"></i>');
        loadIcons();
        $("#searchActivity").attr("disabled", false);
    }
    xhttp.open("POST", "view/getData");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}

function sumPrevData() {
    for (let i = settingsJson.totalViewSKBColSpan; i < fields.length - 1; i++) {
        var total = 0;
        $(`.p${fields[i]}`).each(function () {
            if ($(this).html() != "") {
                total += parseInt($(this).html());
            }
        });
        $(".ptotal" + fields[i]).html(total);
    }
}

function sumPrevDataSapphire() {
    for (let i = settingsJson.totalViewSapphireColSpan; i < fieldsSapphire.length - 1; i++) {
        var total = 0;
        $(`.p${fieldsSapphire[i]}-Sapphire`).each(function () {
            if ($(this).html() != "") {
                total += parseInt($(this).html());
            }
        });
        $(".ptotal" + fieldsSapphire[i] + "-Sapphire").html(total);
    }
}

function generateSKBTable(SKB_table) {

    var isSubHeading = false;

    for (let i = 0; i < SKB_table.length; i++) {

        if (SKB_table[i].sub_heading.length > 0) {
            isSubHeading = true;
            $(".skb_dataTable thead .header").append(`
                <th colspan="${SKB_table[i].sub_heading.length}" class="text-center bl br bb bt">${SKB_table[i].header}</th>
                `);
        } else {
            $(".skb_dataTable thead .header").append(`
                <th class="text-center bl br bt">${SKB_table[i].header}</th>
                `);
        }
    }

    if (isSubHeading) {
        for (let i = 0; i < SKB_table.length; i++) {
            if (SKB_table[i].sub_heading.length > 0) {
                for (let j = 0; j < SKB_table[i].sub_heading.length; j++) {
                    $(".skb_dataTable thead .sub_heading").append(`
                        <th class="text-center bb bl br">${SKB_table[i].sub_heading[j]}</th>
                        `);
                }
            } else {
                $(".skb_dataTable thead .sub_heading").append(`
                    <th class="bl br bb"></th>
                    `);
            }

        }
    }
}

function generatePrevSKBTable(SKB_table) {

    var isSubHeading = false;

    for (let i = 0; i < SKB_table.length - 1; i++) {

        if (SKB_table[i].sub_heading.length > 0) {
            isSubHeading = true;
            $("#prevWeekTable thead .header").append(`
                <th colspan="${SKB_table[i].sub_heading.length}" class="text-center bl br bb bt">${SKB_table[i].header}</th>
                `);
        } else {
            $("#prevWeekTable thead .header").append(`
                <th class="text-center bl br bt">${SKB_table[i].header}</th>
                `);
        }
    }

    if (isSubHeading) {
        for (let i = 0; i < SKB_table.length - 1; i++) {
            if (SKB_table[i].sub_heading.length > 0) {
                for (let j = 0; j < SKB_table[i].sub_heading.length; j++) {
                    $("#prevWeekTable thead .sub_heading").append(`
                        <th class="text-center bb bl br">${SKB_table[i].sub_heading[j]}</th>
                        `);
                }
            } else {
                $("#prevWeekTable thead .sub_heading").append(`
                    <th class="bl br bb"></th>
                    `);
            }

        }
    }
}

function generateSapphireTable(Sapphire_table) {

    var isSubHeading = false;

    for (let i = 0; i < Sapphire_table.length; i++) {

        if (Sapphire_table[i].sub_heading.length > 0) {
            isSubHeading = true;
            $(".Sapphire_table thead .header").append(`
                <th scope="col" class="text-center bb bl br bb bt" colspan="` + Sapphire_table[i].sub_heading.length + `">` + Sapphire_table[i].header + `</th>
                `);
        } else {
            $(".Sapphire_table thead .header").append(`
                <th scope="col" class="text-center bb bl br bt">` + Sapphire_table[i].header + `</th>
                `);
        }
    }

    if (isSubHeading) {
        for (let i = 0; i < Sapphire_table.length; i++) {
            if (Sapphire_table[i].sub_heading.length > 0) {
                for (let j = 0; j < Sapphire_table[i].sub_heading.length; j++) {
                    $(".Sapphire_table thead .sub_heading").append(`
                        <th scope="col" class="text-center bb bl br">` + Sapphire_table[i].sub_heading[j] + `</th>
                        `);
                }
            } else {
                $(".Sapphire_table thead .sub_heading").append(`
                    <th scope="col" class="bl br bb"></th>
                    `);
            }

        }
    }
}

function generatePrevSapphireTable(Sapphire_table) {

    var isSubHeading = false;

    for (let i = 0; i < Sapphire_table.length - 1; i++) {

        if (Sapphire_table[i].sub_heading.length > 0) {
            isSubHeading = true;
            $("#prevWeekTableSapphire thead .header").append(`
                <th scope="col" class="text-center bb bl br bb bt" colspan="` + Sapphire_table[i].sub_heading.length + `">` + Sapphire_table[i].header + `</th>
                `);
        } else {
            $("#prevWeekTableSapphire thead .header").append(`
                <th scope="col" class="text-center bb bl br bt">` + Sapphire_table[i].header + `</th>
                `);
        }
    }

    if (isSubHeading) {
        for (let i = 0; i < Sapphire_table.length - 1; i++) {
            if (Sapphire_table[i].sub_heading.length > 0) {
                for (let j = 0; j < Sapphire_table[i].sub_heading.length; j++) {
                    $("#prevWeekTableSapphire thead .sub_heading").append(`
                        <th scope="col" class="text-center bb bl br">` + Sapphire_table[i].sub_heading[j] + `</th>
                        `);
                }
            } else {
                $("#prevWeekTableSapphire thead .sub_heading").append(`
                    <th scope="col" class="bl br bb"></th>
                    `);
            }

        }
    }
}


function loadSettings() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/settings/getSettings");
    xhttp.onload = function () {
        const response = JSON.parse(this.responseText);
        settingsJson = response;
        generateSKBTable(settingsJson.initTableView.concat(settingsJson.SKB_table, settingsJson.endTable));
        generatePrevSKBTable(settingsJson.initTableView.concat(settingsJson.SKB_table, settingsJson.endTable));
        const headerData = settingsJson.initTableView.concat(settingsJson.SKB_table, settingsJson.endTable);
        fields = getFields(headerData);

        generateSapphireTable(settingsJson.initTableView.concat(settingsJson.Sapphire_table, settingsJson.endTable));
        generatePrevSapphireTable(settingsJson.initTableView.concat(settingsJson.Sapphire_table, settingsJson.endTable));
        const headerDataSapphire = settingsJson.initTableView.concat(settingsJson.Sapphire_table, settingsJson.endTable);
        fieldsSapphire = getFields(headerDataSapphire);
    }
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

loadSettings();
loadWeekDropdown();