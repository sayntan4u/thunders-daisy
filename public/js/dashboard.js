const COLORS = [
  "#4dc9f6",
  "#f67019",
  "#f53794",
  "#537bc4",
  "#acc236",
  "#166a8f",
  "#00a950",
  "#58595b",
  "#8549ba",
];

function color(index) {
  return COLORS[index % COLORS.length];
}

const CHART_COLORS = {
  red: "rgba(255, 99, 132, 0.5)",
  orange: "rgba(255, 159, 64, 0.5)",
  yellow: "rgba(255, 205, 86, 0.5)",
  green: "rgba(75, 192, 192, 0.5)",
  blue: "rgba(54, 162, 235, 0.5)",
  purple: "rgba(153, 102, 255, 0.5)",
  grey: "rgb(201, 203, 207)",
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

const ctxNodeCount = document.getElementById("nodeData");
const ctxPlan = document.getElementById("planData");
const ctxCheques = document.getElementById("chequeData");
const ctxNetworking = document.getElementById("networkingData");
const ctxInfos = document.getElementById("infoData");
const ctxInvis = document.getElementById("inviData");

var chartData = [];

//============================
// Chart methods
//============================

Array.prototype.getWeeks = function () {
  var weeks = [];
  for (let i = 0; i < this.length; i++) {
    weeks.push("Week " + this[i].week);
  }
  // console.log(weeks);
  return weeks;
};

Array.prototype.getNodeCounts = function () {
  var nodeCounts = [];
  for (let i = 0; i < this.length; i++) {
    nodeCounts.push(this[i].count);
  }
  // console.log(nodeCounts);
  return nodeCounts;
};

Array.prototype.getPlans = function () {
  var plans = [];
  for (let i = 0; i < this.length; i++) {
    plans.push(this[i].plans);
  }
  // console.log(nodeCounts);
  return plans;
};

Array.prototype.getNetowkring = function () {
  var networking = [];
  for (let i = 0; i < this.length; i++) {
    networking.push(this[i].networking);
  }
  // console.log(nodeCounts);
  return networking;
};

Array.prototype.getInfos = function () {
  var infos = [];
  for (let i = 0; i < this.length; i++) {
    infos.push(this[i].infos);
  }
  // console.log(nodeCounts);
  return infos;
};

Array.prototype.getInvis = function () {
  var invis = [];
  for (let i = 0; i < this.length; i++) {
    invis.push(this[i].invis);
  }
  // console.log(nodeCounts);
  return invis;
};

Array.prototype.getUVs = function () {
  var plans = [];
  for (let i = 0; i < this.length; i++) {
    plans.push(this[i].uv);
  }
  // console.log(nodeCounts);
  return plans;
};

Array.prototype.getCheques = function () {
  var plans = [];
  for (let i = 0; i < this.length; i++) {
    plans.push(parseInt(this[i].uv / 3));
  }
  // console.log(nodeCounts);
  return plans;
};

var chartNode, chartPlan, chartCheque, chartNetworking, chartInfos, chartInvis;

function generateNodeCountChart(chartData) {
  if (chartNode) {
    chartNode.destroy();
  }
  var data = {
    labels: chartData.getWeeks(),
    datasets: [
      {
        label: "Team Count",
        data: chartData.getNodeCounts(),
        borderColor: CHART_COLORS.green,
        backgroundColor: CHART_COLORS.green,
        borderWidth: 2,
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  var config = {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {},
    },
  };

  chartNode = new Chart(ctxNodeCount, config);
}

function generatePlanChart(chartData) {
  if (chartPlan) {
    chartPlan.destroy();
  }
  var data = {
    labels: chartData.getWeeks(),
    datasets: [
      {
        label: "Plans",
        data: chartData.getPlans(),
        borderColor: CHART_COLORS.orange,
        backgroundColor: CHART_COLORS.orange,
        borderWidth: 2,
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  var config = {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {},
    },
  };

  chartPlan = new Chart(ctxPlan, config);
}

function generateChequesChart(chartData) {
  if (chartCheque) {
    chartCheque.destroy();
  }
  var data = {
    labels: chartData.getWeeks(),
    datasets: [
      {
        label: "Cheques",
        data: chartData.getCheques(),
        borderColor: CHART_COLORS.purple,
        backgroundColor: CHART_COLORS.purple,
        borderWidth: 2,
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  var config = {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {},
    },
  };

  chartCheque = new Chart(ctxCheques, config);
}

function generateNetworkingChart(chartData) {
  if (chartNetworking) {
    chartNetworking.destroy();
  }
  var data = {
    labels: chartData.getWeeks(),
    datasets: [
      {
        label: "Networking",
        data: chartData.getNetowkring(),
        borderColor: CHART_COLORS.blue,
        backgroundColor: CHART_COLORS.blue,
        borderWidth: 2,
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  var config = {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {},
    },
  };

  chartNetworking = new Chart(ctxNetworking, config);
}

function generateInfosChart(chartData) {
  if (chartInfos) {
    chartInfos.destroy();
  }
  var data = {
    labels: chartData.getWeeks(),
    datasets: [
      {
        label: "Infos",
        data: chartData.getInfos(),
        borderColor: CHART_COLORS.red,
        backgroundColor: CHART_COLORS.red,
        borderWidth: 2,
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  var config = {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {},
    },
  };

  chartInfos = new Chart(ctxInfos, config);
}

function generateInvisChart(chartData) {
  if (chartInvis) {
    chartInvis.destroy();
  }
  var data = {
    labels: chartData.getWeeks(),
    datasets: [
      {
        label: "Invis",
        data: chartData.getInvis(),
        borderColor: CHART_COLORS.yellow,
        backgroundColor: CHART_COLORS.yellow,
        borderWidth: 2,
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  var config = {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {},
    },
  };

  chartInvis = new Chart(ctxInvis, config);
}

//============================
// UI methods
//============================

function updateDashboardUI(data) {
  // Update the dashboard with the received data
  // Example: Update a div with the data
  dashNetworking.innerHTML = data.networking;
  dashInfos.innerHTML = data.infos;
  dashInvis.innerHTML = data.invis;
  dashPlans.innerHTML = data.plans;
  if (data.plans < 10) {
    $("#dashPlans").addClass("text-error");
  } else {
    $("#dashPlans").addClass("text-success");
  }
  dashCount.innerHTML = data.count;
}

function updateChartDataUI(chartData) {
  $(".chartData").removeClass("hidden");
  generateNodeCountChart(chartData);
  generatePlanChart(chartData);
  generateChequesChart(chartData);
  generateInfosChart(chartData);
  generateNetworkingChart(chartData);
  generateInvisChart(chartData);
}

//============================
// AJAX methods
//============================

function getDashboardData() {
  var currWeek = getCurrWeek();
  if (sessionStorage.getItem("dashData-" + currWeek)) {
    var data = JSON.parse(sessionStorage.getItem("dashData-" + currWeek));
    updateDashboardUI(data);
    $.ajax({
      url: "/dashboard/getData",
      type: "POST",
      dataType: "json",
      data: {
        week: getCurrWeek(),
      },
      success: function (data) {
        sessionStorage.setItem("dashData-" + currWeek, JSON.stringify(data));
        updateDashboardUI(data);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching dashboard data:", error);
      },
    });
  } else {
    $.ajax({
      url: "/dashboard/getData",
      type: "POST",
      dataType: "json",
      data: {
        week: getCurrWeek(),
      },
      success: function (data) {
        sessionStorage.setItem("dashData-" + currWeek, JSON.stringify(data));
        updateDashboardUI(data);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching dashboard data:", error);
      },
    });
  }
}

function getChartData() {
  var currWeek = getCurrWeek();

  if (localStorage.getItem("currWeek") == currWeek) {
    var data = JSON.parse(localStorage.getItem("chartData"));
    chartData = data;
    updateChartDataUI(data.reverse());
  } else {
    $.ajax({
      url: "/dashboard/getChartData",
      type: "POST",
      dataType: "json",
      data: {
        week: getCurrWeek(),
      },
      success: function (data) {
        chartData = data;
        localStorage.setItem("currWeek", currWeek);
        localStorage.setItem("chartData", JSON.stringify(data));
        // console.log(data);
        updateChartDataUI(data.reverse());
      },
      error: function (xhr, status, error) {
        console.error("Error fetching dashboard data:", error);
      },
    });
  }

  // if (sessionStorage.getItem("chartData-" + currWeek)) {
  //     var data = JSON.parse(sessionStorage.getItem("chartData-" + currWeek));
  //     chartData = data;
  //     updateChartDataUI(data.reverse());
  // } else {
  //     $.ajax({
  //         url: "/dashboard/getChartData",
  //         type: "POST",
  //         dataType: "json",
  //         data: {
  //             week: getCurrWeek(),
  //         },
  //         success: function (data) {
  //             chartData = data;
  //             sessionStorage.setItem("chartData-" + getCurrWeek(), JSON.stringify(data));
  //             // console.log(data);
  //             updateChartDataUI(data.reverse());
  //         },
  //         error: function (xhr, status, error) {
  //             console.error("Error fetching dashboard data:", error);
  //         },
  //     });
  // }
}

//============================
// Loading methods
//============================

//default chart Data

var week = getCurrWeek();
var datas = [];
for (let wkCount = 1; wkCount <= 10; wkCount++) {
  var uv = 0;
  var plans = 0;
  var count = 0;
  var networking = 0;
  var infos = 0;
  var invis = 0;

  datas.push({
    week: week - wkCount,
    uv: uv,
    plans: plans,
    count: count,
    networking: networking,
    infos: infos,
    invis: invis,
  });
}

updateChartDataUI(datas.reverse());

getDashboardData();
getChartData();
// dashCurrWeek.innerHTML = "Week " + getCurrWeek();
