//helpers

class Doc {
  constructor(id, name, content, createdOn, lastEdited) {
    this.id = id;
    this.name = name;
    this.content = content;
    this.createdOn = createdOn;
    this.lastEdited = lastEdited;
  }
}

function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedToday = dd + "/" + mm + "/" + yyyy;

  return formattedToday;
}

//=======================
//====Page methods=======
//=======================

var docList = [];

$(document).on("click", ".file", function (e) {
  e.preventDefault();
  const fileName = $(this).html().trim();
  const id = $(this).data("id");
  $("#files-view").addClass("hidden");
  $("#fileName").val(fileName);
  $("#fileId").html(id);

  $(".go-editor").empty();
  $(".go-editor").html(docList.find((doc) => doc.id == id).content);
  $("#editor").removeClass("hidden");
});

function goBack() {
  $("#editor").addClass("hidden");
  $("#files-view").removeClass("hidden");
}

function loadDocs() {
  // docList.push(
  //   new Doc(
  //     Date.now(),
  //     "Document 1",
  //     '<p style="text-align: left;">​​​​​Hello this is doc 1<br></p>',
  //     "13/06/2025",
  //     "13/06/2025"
  //   )
  // );
  // docList.push(
  //   new Doc(
  //     Date.now() + 1,
  //     "Document 2",
  //     '<p style="text-align: left;">​​​​​Hello this is doc 2<br></p>',
  //     "13/05/2025",
  //     "10/06/2025"
  //   )
  // );

  $.ajax({
    url: "/docs/getDocs",
    type: "POST",
    dataType: "json",
    success: function (data) {
      docList = data.map(
        (doc) =>
          new Doc(doc.id, doc.name, doc.content, doc.createdOn, doc.lastEdited)
      );
      // console.log(docList);
      renderDocs();
      loadIcons();
    },
    error: function (error) {
      console.error("Error loading documents:", error);
    },
  });
}

function addDoc() {
  const id = Date.now();
  const newDoc = new Doc(
    id,
    "untitled document",
    "",
    getTodayDate(),
    getTodayDate()
  );
  docList.push(newDoc);

  $.ajax({
    url: "/docs/addDoc",
    type: "POST",
    dataType: "json",
    data: { doc: newDoc },
    success: function (data) {
      
    },
  });

  $("#files").children("tbody").empty();
  renderDocs();
  loadIcons();
}

showAlert = () => {
  const alert = document.getElementById("documentSaveAlert");
  alert.classList.remove("hidden");
  setTimeout(() => {
    alert.classList.add("hidden");
  }, 2500);
};

updateFileName = () => {
  const id = $("#fileId").html().trim();
  const newName = $("#fileName").val().trim();
  if (newName === "") {
    alert("File name cannot be empty");
    return;
  }
  const doc = docList.find((doc) => doc.id == id);
  if (doc) {
    doc.name = newName;
    doc.lastEdited = getTodayDate();
    $("#files").children("tbody").empty();
    renderDocs();
    loadIcons();
    $("#fileName").blur();
    $.ajax({
      url: "/docs/updateDoc",
      type: "POST",
      dataType: "json",
      data: { doc: doc },
      success: function (data) {
          showAlert();
      },
    });
    // showAlert();
  } else {
    alert("Document not found");
  }
};

updateContent = () => {
  const id = $("#fileId").html().trim();
  const content = $(".go-editor").html().trim();
  const doc = docList.find((doc) => doc.id == id);
  if (doc) {
    doc.content = content;
    doc.lastEdited = getTodayDate();
    $.ajax({
      url: "/docs/updateDoc",
      type: "POST",
      dataType: "json",
      data: { doc: doc },
      success: function (data) {
          showAlert();
      },
    });
  } else {
    alert("Document not found");
  }
};

function deleteDoc() {
  const id = deleteModalDocumentID.innerHTML.trim();
  docList = docList.filter((doc) => doc.id != id);
  $("#files").children("tbody").empty();
  renderDocs();
  loadIcons();
  $.ajax({
    url: "/docs/deleteDoc",
    type: "POST",
    dataType: "json",
    data: { id: id },
    success: function (data) {
      
    },
  });
}

function openDeleteModal(id, name) {
  deleteModalFileName.innerHTML = name;
  deleteModalDocumentID.innerHTML = id;
  deleteModal.showModal();
}

//=======================
//==========UI===========
//=======================

function renderDocs() {
  $("#noDocFound").addClass("hidden");
  if (docList.length == 0) {
    $("#noDocFound").removeClass("hidden");
  } else {
    $("#files")
      .children("tbody")
      .append(function () {
        return docList
          .map((doc) => {
            return `<tr>
						<td>
							<div class="flex items-center gap-1">
                                <i class="size-5 opacity-70" data-lucide="file-text"></i>
							    <div class="font-bold"><a href="" data-id="${doc.id}" class="file">${doc.name}</a></div>
							</div>
						</td>
						<td></td>
						<td>${doc.createdOn}</td>
						<td>${doc.lastEdited}</td>
						<td>
							<div class="flex items-center gap-2">
								<button class="btn btn-sm btn-square btn-ghost text-error" onclick="openDeleteModal('${doc.id}', '${doc.name}')">
                                    <i class="size-5" data-lucide="trash"></i>
                                </button>
							</div>
						</td>
                    </tr>`;
          })
          .join("");
      });
  }
}

loadDocs();
