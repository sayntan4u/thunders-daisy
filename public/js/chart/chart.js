

const COLORS = [
    '#4dc9f6',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba'
];

function color(index) {
    return COLORS[index % COLORS.length];
}

const CHART_COLORS = {
    red: 'rgba(255, 99, 132, 0.5)',
    orange: 'rgba(255, 159, 64, 0.5)',
    yellow: 'rgba(255, 205, 86, 0.5)',
    green: 'rgba(75, 192, 192, 0.5)',
    blue: 'rgba(54, 162, 235, 0.5)',
    purple: 'rgba(153, 102, 255, 0.5)',
    grey: 'rgb(201, 203, 207)'
};

const NAMED_COLORS = [
    CHART_COLORS.red,
    CHART_COLORS.orange,
    CHART_COLORS.yellow,
    CHART_COLORS.green,
    CHART_COLORS.blue,
    CHART_COLORS.purple,
    CHART_COLORS.grey,
];

function namedColor(index) {
    return NAMED_COLORS[index % NAMED_COLORS.length];
}

const ctxNodeCount = document.getElementById('nodeCountChart');
const ctxPlan = document.getElementById('planChart');
const ctxActivities = document.getElementById('activitiesChart');
const ctx2ndMeeting = document.getElementById('secondMeetingChart');
const ctxSKBActivities = document.getElementById('skbChartActivities');
const ctxSKBPlans = document.getElementById('skbChartPlans');


//Sapphire
Array.prototype.getWeeks = function () {
    var weeks = [];
    for (let i = 0; i < this.length; i++) {
        weeks.push(this[i].week);
    }
    // console.log(weeks);
    return weeks;
}

Array.prototype.getNodeCounts = function () {
    var nodeCounts = [];
    for (let i = 0; i < this.length; i++) {
        nodeCounts.push(this[i].nodeCount);
    }
    // console.log(nodeCounts);
    return nodeCounts;
}

Array.prototype.getPlans = function () {
    var plans = [];
    for (let i = 0; i < this.length; i++) {
        plans.push(this[i].plans);
    }
    // console.log(nodeCounts);
    return plans;
}

Array.prototype.getSecondMeetings = function () {
    var ret = [];
    for (let i = 0; i < this.length; i++) {
        ret.push(this[i].secondMeetings);
    }
    // console.log(ret);
    return ret;
}

Array.prototype.getNetworking = function () {
    var ret = [];
    for (let i = 0; i < this.length; i++) {
        ret.push(this[i].networking);
    }
    // console.log(ret);
    return ret;
}

Array.prototype.getInfos = function () {
    var ret = [];
    for (let i = 0; i < this.length; i++) {
        ret.push(parseInt(this[i].infos) + parseInt(this[i].reinfos));
    }
    // console.log(ret);
    return ret;
}

Array.prototype.getInvis = function () {
    var ret = [];
    for (let i = 0; i < this.length; i++) {
        ret.push(this[i].invis);
    }
    // console.log(ret);
    return ret;
}

//skb

Array.prototype.getNetworkingDone = function () {
    var ret = [];
    for (let i = 0; i < this.length; i++) {
        ret.push(this[i].networkingDone);
    }
    // console.log(ret);
    return ret;
}

Array.prototype.getInfosDone = function () {
    var ret = [];
    for (let i = 0; i < this.length; i++) {
        ret.push(parseInt(this[i].infosDone) + parseInt(this[i].reinfosDone));
    }
    // console.log(ret);
    return ret;
}

Array.prototype.getInvisDone = function () {
    var ret = [];
    for (let i = 0; i < this.length; i++) {
        ret.push(this[i].invisDone);
    }
    // console.log(ret);
    return ret;
}


var chartNode, chartPlan, chartActivities, chart2ndMeeting, chartSKBActivities,chartSKBplans;

//Sapphire
function generateNodeCountChart(sapphireDataJson) {
    if (chartNode) {
        chartNode.destroy();
    }
    var data = {
        labels: sapphireDataJson.getWeeks(),
        datasets: [
            {
                label: 'Node Count',
                data: sapphireDataJson.getNodeCounts(),
                borderColor: CHART_COLORS.blue,
                backgroundColor: CHART_COLORS.blue,
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false,
            }
        ]
    };

    var config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
            }
        },
    };

    chartNode = new Chart(ctxNodeCount, config);
}

function generatePlanChart(sapphireDataJson) {
    if (chartPlan) {
        chartPlan.destroy();
    }
    var data = {
        labels: sapphireDataJson.getWeeks(),
        datasets: [
            {
                label: 'Plans',
                data: sapphireDataJson.getPlans(),
                borderColor: CHART_COLORS.orange,
                backgroundColor: CHART_COLORS.orange,
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false,
            }
        ]
    };

    var config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
            }
        },
    };

    chartPlan = new Chart(ctxPlan, config);
}

function generate2ndMeetingChart(sapphireDataJson) {
    if (chart2ndMeeting) {
        chart2ndMeeting.destroy();
    }
    var data = {
        labels: sapphireDataJson.getWeeks(),
        datasets: [
            {
                label: '2nd Meeting',
                data: sapphireDataJson.getSecondMeetings(),
                borderColor: CHART_COLORS.purple,
                backgroundColor: CHART_COLORS.purple,
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false,
            }
        ]
    };

    var config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
            }
        },
    };

    chart2ndMeeting = new Chart(ctx2ndMeeting, config);
}

function generateActivitiesChart(sapphireDataJson) {
    if (chartActivities) {
        chartActivities.destroy();
    }
    data = {
        labels: sapphireDataJson.getWeeks(),
        datasets: [
            {
                label: 'Networking',
                data: sapphireDataJson.getNetworking(),
                borderColor: CHART_COLORS.blue,
                backgroundColor: CHART_COLORS.blue,
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false,
            },
            {
                label: 'Info',
                data: sapphireDataJson.getInfos(),
                borderColor: CHART_COLORS.red,
                backgroundColor: CHART_COLORS.red,
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false,
            },
            {
                label: 'Invi',
                data: sapphireDataJson.getInvis(),
                borderColor: CHART_COLORS.green,
                backgroundColor: CHART_COLORS.green,
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false,
            }
        ]
    };

    config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
            }
        },
    };

    chartActivities = new Chart(ctxActivities, config);
}

function getChartData(sapphireDataJson) {

    generateNodeCountChart(sapphireDataJson);
    generatePlanChart(sapphireDataJson);
    generate2ndMeetingChart(sapphireDataJson);
    generateActivitiesChart(sapphireDataJson);
}

//SKB
function generateSKBActivitiesChart(skbDataJson) {
    if (chartSKBActivities) {
        chartSKBActivities.destroy();
    }
    data = {
        labels: skbDataJson.getWeeks(),
        datasets: [
            {
                label: 'Networking',
                data: skbDataJson.getNetworkingDone(),
                borderColor: CHART_COLORS.blue,
                backgroundColor: CHART_COLORS.blue,
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false,
            },
            {
                label: 'Info',
                data: skbDataJson.getInfosDone(),
                borderColor: CHART_COLORS.red,
                backgroundColor: CHART_COLORS.red,
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false,
            },
            {
                label: 'Invi',
                data: skbDataJson.getInvisDone(),
                borderColor: CHART_COLORS.green,
                backgroundColor: CHART_COLORS.green,
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false,
            }
        ]
    };

    config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
            }
        },
    };

    chartSKBActivities = new Chart(ctxSKBActivities, config);
}

function generateSKBPlanChart(skbDataJson) {
    if (chartSKBplans) {
        chartSKBplans.destroy();
    }
    var data = {
        labels: skbDataJson.getWeeks(),
        datasets: [
            {
                label: 'Plans',
                data: skbDataJson.getPlans(),
                borderColor: CHART_COLORS.orange,
                backgroundColor: CHART_COLORS.orange,
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false,
            }
        ]
    };

    var config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
            }
        },
    };

    chartSKBplans = new Chart(ctxSKBPlans, config);
}

function getChartDataSKB(skbDataJson){
    generateSKBActivitiesChart(skbDataJson);
    generateSKBPlanChart(skbDataJson);
}



