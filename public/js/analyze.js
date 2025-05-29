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

var settingsJson = {};
var fields = [];
var fieldsSapphire = [];

function sumData() {
    for (let i = settingsJson.totalAnalyzeSKBColSpan; i < fields.length; i++) {
        var total = 0;
        $(`.${fields[i]}`).each(function () {
            if ($(this).html() != "") {
                total += parseInt($(this).html());
            }
        });
        $(".total" + fields[i]).html(total);
    }

    //Analyze Data

    var wkFrom = document.getElementById("inputWeekFrom").value;
    var wkTo = document.getElementById("inputWeekTo").value;

    var totalNetworkingDone = $(".totalnetworkingDone").html();
    var totalInfosDone = $(".totalinfosDone").html();
    var totalReinfosDone = $(".totalreinfosDone").html();
    var totalInviDone = $(".totalinvisDone").html();
    var totalPlanDone = $(".totalplans").html();

    const weekCount = wkTo - wkFrom + 1;

    $("#networkingPerWeek").html(totalNetworkingDone / weekCount);
    $("#infoPerWeek").html(totalInfosDone / weekCount);
    $("#reinfoPerWeek").html(totalReinfosDone / weekCount);
    $("#inviPerWeek").html(totalInviDone / weekCount);
    $("#planPerWeek").html(totalPlanDone / weekCount);

    // //other ratios

    // // 
    $("#networkingToPlan").html(round(totalNetworkingDone / totalPlanDone), 2);
    $("#infoToPlan").html(round(totalInfosDone / totalPlanDone), 2);
    $("#inviToPlan").html(round(totalInviDone / totalPlanDone), 2);

    // //Conversion percentage
    var perc = ((totalNetworkingDone - totalInfosDone) / totalNetworkingDone) * 100;

    if (perc > 0) {
        $("#networkingToInfo").html(round(perc, 2) + "%");
    } else {
        $("#networkingToInfo").html("Not Applicable");
    }

    perc = ((totalInfosDone - totalReinfosDone) / totalInfosDone) * 100;

    if (perc > 0) {
        $("#infoToReinfo").html(round(perc, 2) + "%");
    } else {
        $("#infoToReinfo").html("Not Applicable");
    }

    perc = ((totalReinfosDone - totalInviDone) / totalReinfosDone) * 100;

    if (perc > 0) {
        $("#reinfoToInvi").html(round(perc, 2) + "%");
    } else {
        $("#reinfoToInvi").html("Not Applicable");
    }

}

function sumSapphireData() {

    for (let i = settingsJson.totalAnalyzeSapphireColSpan; i < fieldsSapphire.length; i++) {
        var total = 0;
        $(`.${fieldsSapphire[i]}`).each(function () {
            if ($(this).html() != "") {
                total += parseInt($(this).html());
            }
        });
        $(".total" + fieldsSapphire[i]).html(total);
    }
}

function getData() {
    $(".loading").removeClass("hide");
    var wkFrom = document.getElementById("inputWeekFrom").value;
    var wkTo = document.getElementById("inputWeekTo").value;
    var yr = document.getElementById("inputYear").value;
    var nm = document.getElementById("name").value;
    var group = $("#groupSelect").val();

    const data = { weekFrom: wkFrom, weekTo: wkTo, year: yr, name: nm, group: group };

    // console.log(data);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        // alert(JSON.parse(this.responseText).length);

        const response = JSON.parse(this.responseText);

        if (group == "SKB") {
            console.log(response);
            getChartDataSKB(response);
            $(".skbData").html("");

            for (let i = 0; i < response.length; i++) {
                var rowTable = '<tr>';
                for (let j = 0; j < fields.length; j++) {
                    if (j == 0) {
                        rowTable += '<th class="bb bl">' + response[i].sl + '</th>';
                    } else if (j == 1) {
                        rowTable += '<td class="bl br bb">' + response[i][fields[j]] + '</td>';
                    } else {
                        rowTable += `<td class="bl br bb text-center px-1 ${getTDClass(fields[j])} ${fields[j]}">${response[i][fields[j]]}</td>`;
                    }
                }
                rowTable += '</tr>';
                $(".skbData").append(rowTable);
            }

            var rowTable = `<tr><td colspan="${settingsJson.totalAnalyzeSKBColSpan}" class="bb bl text-center bg-neutral text-neutral-content py-2">Total</td>`;
            for (let i = settingsJson.totalAnalyzeSKBColSpan; i < fields.length; i++) {
                rowTable += `<th class="bl br bb text-center ${getTDClass(fields[i])} total${fields[i]}"></th>`;
            }
            rowTable += '</tr>';
            $(".skbData").append(rowTable);

            sumData();

            $("#searchNameSKB").html(nm);
            $("#searchGroupSKB").html(group);

            $("#dataTable").removeClass("hidden");
        } else {
            getChartData(response);

            $(".sapphireData").html("");

            for (let i = 0; i < response.length; i++) {
                var rowTable = '<tr>';
                for (let j = 0; j < fieldsSapphire.length; j++) {
                    if (j == 0) {
                        rowTable += '<th class="bb bl">' + response[i].sl + '</th>';
                    } else if (j == 1) {
                        rowTable += '<td class="bl br bb">' + response[i][fieldsSapphire[j]] + '</td>';
                    } else {
                        rowTable += `<td class="bl br bb text-center px-1 ${getTDClassSapphire(fieldsSapphire[j])} ${fieldsSapphire[j]}">${response[i][fieldsSapphire[j]]}</td>`;
                    }
                }
                rowTable += '</tr>';
                $(".sapphireData").append(rowTable);
            }

            var rowTable = `<tr><td colspan="${settingsJson.totalAnalyzeSapphireColSpan}" class="bb bl text-center bg-neutral text-neutral-content py-2">Total</td>`;
            for (let i = settingsJson.totalAnalyzeSapphireColSpan; i < fieldsSapphire.length; i++) {
                rowTable += `<th class="bl br bb text-center ${getTDClassSapphire(fieldsSapphire[i])} total${fieldsSapphire[i]}"></th>`;
            }
            rowTable += '</tr>';
            $(".sapphireData").append(rowTable);

            sumSapphireData();

            $("#searchNameSapphire").html(nm);
            $("#searchGroupSapphire").html(group);

            $("#dataTableSapphire").removeClass("hidden");

        }

        $("#searchBtn").html('<i class="h-5 w-5" data-lucide="search"></i>');
        loadIcons();
        $("#searchBtn").attr("disabled", false);
    }
    xhttp.open("POST", "/analyze/analyzeData");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
    // $('.alert').addClass("show");
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

$("#searchBtn").click(function () {
    if ($("#name").val() != "-select-") {

        $("#dataTable").addClass("hidden");
        $("#dataTableSapphire").addClass("hidden");

        $(this).html('<span class="loading loading-spinner loading-sm"></span>');
        $(this).attr("disabled", true);

        getData();
    }
});

$("#screenshot_SKB").click(function () {
    const filename = $("#searchNameSKB").html() + "_SKB .png";
    html2canvas(document.querySelector("#dataTable")).then(canvas => {
        var myImage = canvas.toDataURL();
        downloadURI(myImage, filename);
    });
});

$("#screenshot_Sapphire").click(function () {
    const filename = $("#searchNameSapphire").html() + "_Sapphire .png";
    html2canvas(document.querySelector("#dataTableSapphire")).then(canvas => {
        var myImage = canvas.toDataURL();
        downloadURI(myImage, filename);
    });
});

function downloadURI(uri, name) {
    var link = document.createElement("a");

    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    // clearDynamicLink(link);
}

function fromWeekChanged() {
    // alert($("#inputWeekFrom").val());
    generateWeekTwo($("#inputWeekFrom").val());
}

function generateWeekTwo(fromWeek) {
    $("#inputWeekTo").html("");
    for (let i = fromWeek; i <= 53; i++) {
        $("#inputWeekTo").append("<option>" + i + "</option>");
    }
}

function generateNameDropDown() {
    $("#groupSelect").prop('disabled', true);
    $("#name").html("");
    $("#name").addClass("text-primary");
    $("#name").append("<option > Loading ... </option>");
    const group = $("#groupSelect").val();

    // console.log(group);
    var data = {};

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        // alert(JSON.parse(this.responseText).length);

        const response = JSON.parse(this.responseText);
        $("#name").html("");
        $("#name").removeClass("text-primary");
        $("#name").append("<option>-select-</option>");

        for (let i = 0; i < response.length; i++) {
            $("#name").append("<option>" + response[i] + "</option>");
        }
        $("#groupSelect").prop('disabled', false);


    }
    xhttp.open("POST", "/getUserName/onlyNames");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    if (group == "SKB") {
        data = { group: "SKB" };
    }
    else {
        data = { group: "Sapphire" }
    }
    xhttp.send(JSON.stringify(data));
}

function generateSKBTable(SKB_table) {

    var isSubHeading = false;

    for (let i = 0; i < SKB_table.length; i++) {

        if (SKB_table[i].sub_heading.length > 0) {
            isSubHeading = true;
            $(".skb_dataTable thead .header").append(`
                <th scope="col" class="text-center bl br bb bt" colspan="` + SKB_table[i].sub_heading.length + `">` + SKB_table[i].header + `</th>
                `);
        } else {
            $(".skb_dataTable thead .header").append(`
                <th scope="col" class="text-center bl br bt">` + SKB_table[i].header + `</th>
                `);
        }
    }

    if (isSubHeading) {
        for (let i = 0; i < SKB_table.length; i++) {
            if (SKB_table[i].sub_heading.length > 0) {
                for (let j = 0; j < SKB_table[i].sub_heading.length; j++) {
                    $(".skb_dataTable thead .sub_heading").append(`
                        <th scope="col" class="text-center bb bl br">` + SKB_table[i].sub_heading[j] + `</th>
                        `);
                }
            } else {
                $(".skb_dataTable thead .sub_heading").append(`
                    <th scope="col" class="bl br bb"></th>
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
                    $(".skb_dataTable thead .sub_heading").append(`
                        <th scope="col" class="text-center bb bl br">` + Sapphire_table[i].sub_heading[j] + `</th>
                        `);
                }
            } else {
                $(".skb_dataTable thead .sub_heading").append(`
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

        generateSKBTable(settingsJson.initTableAnalyze.concat(settingsJson.SKB_table));
        const headerData = settingsJson.initTableAnalyze.concat(settingsJson.SKB_table);
        fields = getFields(headerData);

        generateSapphireTable(settingsJson.initTableAnalyze.concat(settingsJson.Sapphire_table));
        const headerDataSapphire = settingsJson.initTableAnalyze.concat(settingsJson.Sapphire_table);
        fieldsSapphire = getFields(headerDataSapphire);
    }
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

function loadWeekDropdown() {
    var weeks = "";
    for (let i = 1; i <= 53; i++) {
        weeks += `<option>${i}</option>`;
    }
    $("#inputWeekFrom").append(weeks);
    $("#inputWeekTo").append(weeks);
}

loadSettings();
loadWeekDropdown();

generateWeekTwo(1);
generateNameDropDown();

