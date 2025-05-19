
function updateDashboardUI(data) {
    // Update the dashboard with the received data
    // Example: Update a div with the data
    dashNetworking.innerHTML = data.networking;
    dashInfos.innerHTML = data.infos;
    dashInvis.innerHTML = data.invis;
    dashPlans.innerHTML = data.plans;
}


//============================
// AJAX methods
//============================

function getDashboardData() {
    $.ajax({
        url: '/dashboard/getData',
        type: 'POST',
        dataType: 'json',
        data: {
            week: getCurrWeek()
        },
        success: function(data) {
            // Update the dashboard with the received data
            // console.log('Dashboard data received:', data);
            // Call the updateDashboard function to update the UI
            updateDashboardUI(data);
        },
        error: function(xhr, status, error) {
            console.error('Error fetching dashboard data:', error);
        }
    });
}

//============================
// Loading methods
//============================

getDashboardData();
dashCurrWeek.innerHTML = "Week " + getCurrWeek();
