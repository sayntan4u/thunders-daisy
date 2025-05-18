var userJson = [];
var sapphireJson = [];

var currPage = 1;

$('#saveMember').on('click', function () {
    addPerson();
});



//==========================================
// LOADER
//==========================================

function showLoader(customMsg = "") {
    $("#loader_main").removeClass("hidden");
    if (customMsg == "") {
        loader_main_content.innerHTML = "Loading.. please wait !";
    } else {
        loader_main_content.innerHTML = customMsg;
    }
}

function hideLoader() {
    $("#loader_main").addClass("hidden");
}

//==========================================
// LOADER ENDS
//==========================================



function addName(name) {
    if ($("#memberGroup").val() == "SKB") {
        // userJson.push({ name: name, namelist: ""});
        // generateNamesTable(userJson);
        $("#groupSelect").val("SKB").change();
    }
    else {
        // sapphireJson.push({ name: name});
        // generateNamesTable(sapphireJson, "Sapphire");
        $("#groupSelect").val("Sapphire").change();
    }

}


function changeGroup() {
    const grp = $("#groupSelect").val();
    $("#pagination").addClass("hidden");
    $(".names").html("");
    if (grp == "SKB") {
        loadNames();
    } else {
        loadSapphire();
    }
}

function generateNamesTable(response, group = "SKB") {
    $(".names").html("");
    $("#pageNumber").html(currPage);

    var endindex = 0;

    var startindex = (currPage - 1) * 5;

    if (response.length > currPage * 5) {
        endindex = currPage * 5;
    } else {
        endindex = response.length;
    }


    for (let i = startindex; i < endindex; i++) {
        if (group == "SKB") {
            $(".names").append(`
               <tr>
											<th>${i + 1}</th>
											<td>
												<div class="flex items-center gap-3">
													<div class="avatar">
														<div class="mask mask-squircle h-12 w-12">
															<img src="images/avatars/${(response[i].avatarId == 0) ? 'default.png' : response[i].avatarId + '.avif'}" />
														</div>
													</div>
													<div>
														<div class="font-bold">${response[i].name}</div>
														<div class="text-xs opacity-50">${response[i].email}</div>
													</div>
												</div>
											</td>
											<td>
												${(response[i].namelist == '') ? '<span class="badge badge-soft badge-error"><i data-lucide="link-2-off" class="size-4 me-1"></i> Not Connected</span>' : '<span class="badge badge-soft badge-success"><i data-lucide="link-2" class="size-4 me-1"></i>Connected</span>'}
											</td>
                                            <td class="text-center">
                                                ${response[i].nlCount}
                                            </td>
											<td class="text-center">
												<span class="badge badge-soft badge-primary">${group}</span>
											</td>
											<th class="text-center">
												<button class="btn btn-ghost btn-sm btn-square" onclick="thunderboltModal('${response[i].namelist}')" ${(response[i].namelist == '') ? 'disabled' : ''}>
													<i class="size-5 ${(response[i].namelist == '') ? '' : 'bolt'}" data-lucide="zap"></i>
												</button>
												<button class="btn btn-ghost btn-sm btn-square" onclick="editUserModal('${response[i].name}','${response[i].namelist}')">
													<i class="size-5" data-lucide="square-pen"></i>
												</button>
												<button class="btn btn-ghost btn-sm btn-square" onclick="deleteUserModal('${response[i].name}', '${group}')">
													<i class="size-5 text-error" data-lucide="trash"></i>
												</button>
											</th>
										</tr>
                    `);
        } else {
            $(".names").append(`
               <tr>
											<th>${i + 1}</th>
											<td>
												<div class="flex items-center gap-3">
													<div class="avatar">
														<div class="mask mask-squircle h-12 w-12">
															<img src="images/avatars/default.png" />
														</div>
													</div>
													<div>
														<div class="font-bold">${response[i].name}</div>
														
													</div>
												</div>
											</td>
											<td class="opacity-60">
												
											</td>
                                            <td>
                                            </td>
											<td class="text-center">
												<span class="badge badge-soft badge-primary">${group}</span>
											</td>
											<th >
												<button class="btn btn-ghost btn-sm btn-square" onclick="deleteUserModal('${response[i].name}', '${group}')">
													<i class="size-5 text-error" data-lucide="trash"></i>
												</button>
											</th>
										</tr>
                    `);
        }
        loadIcons();
    }

    if (group == "SKB") {
        setNLCount(userJson.length);
    } else {
        setNLCount(sapphireJson.length);
    }
}

function deleteUserModal(name, group) {
    deleteMemberName.innerHTML = name;
    deleteMemberGroup.innerHTML = group;
    deletePersonModal.showModal();
}

function editUserModal(name, thunderbolID) {
    $("#updateUserBtn").attr("disabled", true);
    editUserName.value = name;
    editUserID.value = thunderbolID;
    editPersonModal.showModal();

}

function addMemberModal(){
    $("#saveMember").attr("disabled", true);
    $("#memberName").val("");
    $("#memberName").parent().removeClass("input-error").removeClass("input-success");
    addPersonModal.showModal();
}

function thunderboltModal(thunderbolID){
    console.log(thunderbolID);
    thunderboltNLModal.showModal();
}

function checkIsValid(elem) {
    const id = $(elem).val();
    $(elem).attr("disabled", true);
    $("#loader_isValidID").removeClass("hidden");
    checkIsValidFB(id);
}

function checkValidName(elem) {
    const name = $("#memberName").val();
    const group = $("#memberGroup").val();
    $("#memberName").attr("disabled", true);
    $("#memberGroup").attr("disabled", true);
    $("#loader_isValidName").removeClass("hidden");
    checkValidNameFB(name, group);
}

//==============================
// Pagination

function setNLCount(count) {
    if (count > 0) {
        $("#pagination").removeClass("hidden");
    } else {
        $("#pagination").addClass("hidden");
    }
    nlCount.innerHTML = count;
    fromProspect.innerHTML = (currPage - 1) * 5 + 1;
    if (count > currPage * 5) {
        toProspect.innerHTML = currPage * 5;
    } else {
        toProspect.innerHTML = count;
    }
}

function goBack() {
    if (currPage > 1) {
        currPage = currPage - 1;
        pageNumber.innerHTML = currPage;
    }
    if ($("#groupSelect").val() == "SKB") {
        generateNamesTable(userJson);
    } else {
        generateNamesTable(sapphireJson, "Sapphire");
    }
}

function goForward() {

    if ($("#groupSelect").val() == "SKB") {
        if (currPage < userJson.length / 5) {
            currPage = currPage + 1;
            pageNumber.innerHTML = currPage;
        }
        generateNamesTable(userJson);
    } else {
        if (currPage < sapphireJson.length / 5) {
            currPage = currPage + 1;
            pageNumber.innerHTML = currPage;
        }
        generateNamesTable(sapphireJson, "Sapphire");
    }
}



//==============================
// AjAX methods

function checkIsValidFB(id) {
    const data = { id: id };
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add/isValidID");
    xhttp.onload = function () {

        const response = JSON.parse(this.responseText);

        if (response.avatarId == 0) {
            $("#updateUserBtn").attr("disabled", true);
            $("#alertInvalidThunderboltID").removeClass("hidden");
            setTimeout(function () {
                $("#alertInvalidThunderboltID").addClass("hidden");
            }, 6000);
        } else {
            $("#updateUserBtn").attr("disabled", false);
            thndrName.innerHTML = response.displayName;
            thndrEmail.innerHTML = response.email;
            $("#alertValidThunderboltID").removeClass("hidden");
            setTimeout(function () {
                $("#alertValidThunderboltID").addClass("hidden");
            }, 6000);
        }

        $("#editUserID").attr("disabled", false);
        $("#loader_isValidID").addClass("hidden");


    }
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}

function checkValidNameFB(name, group) {
    const data = { name: name, group: group };
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add/isValidName");
    xhttp.onload = function () {

        const response = this.responseText;
        console.log(response);

        if (response == 'true') {
            //valid
            status_isValidName.innerHTML = '<i class="text-success" data-lucide="circle-check"></i>';
            $("#memberName").parent().removeClass("input-error").addClass("input-success");
            $("#saveMember").attr("disabled", false);
        } else {
            //invalid
            status_isValidName.innerHTML = '<i class="text-error" data-lucide="circle-alert"></i>';
            $("#memberName").parent().removeClass("input-success").addClass("input-error");
            $("#saveMember").attr("disabled", true);
        }
        loadIcons();

        $("#memberName").attr("disabled", false);
        $("#memberGroup").attr("disabled", false);
        $("#loader_isValidName").addClass("hidden");


    }
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}

function loadNames() {
    showLoader();
    currPage = 1;
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add/getNames");
    xhttp.onload = function () {

        const response = JSON.parse(this.responseText);
        userJson = response;
        if (userJson.length > 0) {
            generateNamesTable(response);
        }
        hideLoader();
    }
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

function loadSapphire() {
    showLoader();
    currPage = 1;
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add/getNamesSapphire");
    xhttp.onload = function () {
        const response = JSON.parse(this.responseText);
        sapphireJson = response;
        if (sapphireJson.length > 0) {
            generateNamesTable(response, "Sapphire");
        }
        hideLoader();


    }
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

function addPerson() {
    const nm = $('#memberName').val();
    const grp = $("#memberGroup").val();
    const data = { name: nm, group: grp };

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {

        const response = this.responseText;
        if (response == "success") {

            // $(".names").html("");
            addName(nm);
            $("#newPersonName").html(nm);
            $('#memberName').val("");
            $('.add_alert').removeClass("hide").addClass("show");
            setTimeout(function () { $('.add_alert').removeClass("show").addClass("hide"); }, 6000);
        }
    }
    xhttp.open("POST", "/add/addUser");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));

    showLoader("Adding new member - <strong>" + nm + "</strong> to <strong>" + grp + "</strong>.. please wait !");

}

$("#updateUserBtn").click(function () {

    const name = editUserName.value;
    const id = editUserID.value;
    showLoader("Updating <strong>" + name + "</strong>.. please wait !");
    const data = { name: name, link: id };
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add/updateNamelist");
    xhttp.onload = function () {
        loadNames();
    }
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
});

function deleteUser() {
    const nm = deleteMemberName.innerHTML;
    const group = deleteMemberGroup.innerHTML;

    const data = { name: nm, group: group };
    // alert(name);
    // location.href = "/delete?name=" + name;

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add/delete");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));

    if (group == "SKB") {
        for (let i = 0; i < userJson.length; i++) {
            if (userJson[i].name == nm) {
                // delete userJson[i];
                userJson.splice(i, 1);
                break;
            }
        }
        generateNamesTable(userJson);
    } else {
        for (let i = 0; i < sapphireJson.length; i++) {
            if (sapphireJson[i].name == nm) {
                // delete userJson[i];
                sapphireJson.splice(i, 1);
                break;
            }
        }
        generateNamesTable(sapphireJson, "Sapphire");
    }

    $("#deletePersonName").html(nm);
    $('.delete_alert').removeClass("hide").addClass("show");
    setTimeout(function () { $('.delete_alert').removeClass("show").addClass("hide"); }, 6000);
}

loadNames();

