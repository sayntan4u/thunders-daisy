

// var network = {
//     node: "Harshitha",
//     left: {
//         node: "Charan",
//         left: {
//             node: "Mounika",
//             left: {
//                 node: "Susanthi",
//                 left: {
//                     node: "Pavani",
//                     left: {
//                         node: "Gangotri",
//                         left: {
//                             node: "Aayushi",
//                             left: null,
//                             right: null
//                         },
//                         right: null
//                     },
//                     right: {
//                         node: "Alekhya",
//                         left: null,
//                         right: {
//                             node: "Supreeth",
//                             left: null,
//                             right: null
//                         }
//                     }
//                 },
//                 right: null
//             },
//             right: {
//                 node: "Anju",
//                 left: null,
//                 right: {
//                     node: "Leena",
//                     left: null,
//                     right: null
//                 }
//             }
//         },
//         right: {
//             node: "Srividya",
//             left: null,
//             right: {
//                 node: "Gopinadh",
//                 left: null,
//                 right: {
//                     node: "Nagarjuna",
//                     left: null,
//                     right: null
//                 }
//             }
//         }
//     },
//     right: {
//         node: "Bhaskar",
//         left: {
//             node: "Gomanth",
//             left: {
//                 node: "Pavan",
//                 left: null,
//                 right: null
//             },
//             right: {
//                 node: "Yashwanth",
//                 left: null,
//                 right: null
//             }
//         },
//         right: {
//             node: "Sowmya",
//             left: {
//                 node: "Chandini",
//                 left: null,
//                 right: null
//             },
//             right: {
//                 node: "Likitha",
//                 left: null,
//                 right: {
//                     node: "Sravika",
//                     left: null,
//                     right: null
//                 }
//             }
//         }
//     }
// }

var network;

var nodeList = [];

function getTreeNodeData(nodeData, level = null) {
    var tree = "";
    if (level == null) {
        tree += `<li>
                <a class="nodeName" href="#">${nodeData.node} <button onclick="hello()">x</button></a>
                <button class="btn btn-xs btn-error btn-square btn-soft" onclick="deleteModal('${nodeData.node}')">
                    <i class="size-4" data-lucide="x"></i>
                </button>`;
        if (nodeData.left == null & nodeData.right == null) {
            //do nothing
        } else {

            tree += "<ul>";
            if (nodeData.left != null) {
                tree += getTreeNodeData(nodeData.left);
            } else {
                tree += '<li><a href="#"></a></li>';
            }

            if (nodeData.right != null) {
                tree += getTreeNodeData(nodeData.right);
            } else {
                tree += '<li><a href="#"></a></li>';
            }
            tree += "</ul>";

        }

        tree += "</li>";
    } else {
        if (level > 0) {
            tree += `<li>
                <a class="nodeName" href="#">${nodeData.node}</a>
                <button class="btn btn-xs btn-error btn-square btn-soft" onclick="deleteModal('${nodeData.node}')">
                    <i class="size-4" data-lucide="x"></i>
                </button>`;
            if (nodeData.left == null & nodeData.right == null) {
                //do nothing
            } else {
                if (level - 1 > 0) {
                    tree += "<ul>";

                    if (nodeData.left != null) {
                        tree += getTreeNodeData(nodeData.left, level - 1);
                    } else {
                        tree += '<li><a href="#"></a></li>';
                    }

                    if (nodeData.right != null) {
                        tree += getTreeNodeData(nodeData.right, level - 1);
                    } else {
                        tree += '<li><a href="#"></a></li>';
                    }
                    tree += "</ul>";
                }

            }

            tree += "</li>";
        }
    }

    return tree;
}

function loadNetwork(nodeData = null) {
    $("#placements").html("<option>-select-</option>");

    if (nodeData == null) {
        if (sessionStorage.getItem("network")) {
            network = JSON.parse(sessionStorage.getItem("network"));
            nodeList = [];
            nodeList.push(network);
            $(".tree").html("");
            var tree = getTreeNodeData(network, 5);
            $(".tree").append("<ul>" + tree + "</ul>");
            setCount(nodeList.slice(-1)[0]);
            loadIcons();
            const placements = getPlacements(network).split(",");
            for (let i = 0; i < placements.length; i++) {
                if (placements[i] != "") {
                    $("#placements").append(`<option>${placements[i]}</option>`);
                }
            }
            showAlert();


        } else {
            $.ajax({
                url: '/network/getNetwork',
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                    sessionStorage.setItem("network", JSON.stringify(data));
                    network = data;
                    nodeList = [];
                    nodeList.push(network);
                    $(".tree").html("");
                    var tree = getTreeNodeData(network, 5);
                    $(".tree").append("<ul>" + tree + "</ul>");
                    setCount(nodeList.slice(-1)[0]);
                    loadIcons();
                    const placements = getPlacements(network).split(",");
                    for (let i = 0; i < placements.length; i++) {
                        if (placements[i] != "") {
                            $("#placements").append(`<option>${placements[i]}</option>`);
                        }
                    }
                    showAlert();

                },
                error: function (xhr, status, error) {
                    console.error('Error loading roster:', error);
                }
            });
        }

    } else {
        nodeList = [];
        nodeList.push(nodeData);
        $(".tree").html("");
        var tree = getTreeNodeData(nodeData, 5);
        $(".tree").append("<ul>" + tree + "</ul>");
        setCount(nodeList.slice(-1)[0]);
        loadIcons();
        const placements = getPlacements(nodeData).split(",");
        for (let i = 0; i < placements.length; i++) {
            if (placements[i] != "") {
                $("#placements").append(`<option>${placements[i]}</option>`);
            }
        }
        showAlert();
    }
}

function zoomNetwork(searchNode, nodeData) {
    var tree = "";
    // console.log(nodeData.node);
    if (nodeData.node == searchNode) {
        tree += getTreeNodeData(nodeData, 5);
        nodeList.push(nodeData);
        setCount(nodeData);
        // console.log(nodeList);
    } else {
        if (nodeData.left != null) {
            tree += zoomNetwork(searchNode, nodeData.left);
        }
        if (nodeData.right != null) {
            tree += zoomNetwork(searchNode, nodeData.right);
        }
    }
    return tree;
}

function addToNetwork(name, position, placement, nodeData) {
    // console.log(nodeData.node);
    if (nodeData.node == position) {
        if (placement == "L") {
            nodeData.left = {
                node: name,
                left: null,
                right: null
            }
        } else {
            nodeData.right = {
                node: name,
                left: null,
                right: null
            }

        }
    } else {
        if (nodeData.left != null) {
            addToNetwork(name, position, placement, nodeData.left);
        }
        if (nodeData.right != null) {
            addToNetwork(name, position, placement, nodeData.right);
        }
    }
}

function deleteFromNetwork(name, nodeData) {
    // console.log(nodeData.node);
    if (nodeData.left != null && nodeData.left.node == name) {
        nodeData.left = null;
    } else if (nodeData.right != null && nodeData.right.node == name) {
        nodeData.right = null;
    }

    if (nodeData.left == null && nodeData.right == null) {

    } else {
        if (nodeData.left != null) {
            deleteFromNetwork(name, nodeData.left);
        }
        if (nodeData.right != null) {
            deleteFromNetwork(name, nodeData.right);
        }
    }
}

function countNetwork(nodeData) {
    var count = 0;
    count++;
    if (nodeData.left == null & nodeData.right == null) {
        //do nothing
    } else {
        if (nodeData.left != null) {
            count += countNetwork(nodeData.left);
        }

        if (nodeData.right != null) {
            count += countNetwork(nodeData.right);
        }
    }
    return count;
}

$(document).on("click", ".nodeName", function () {
    if (nodeList[nodeList.length - 1].node != $(this).html()) {
        const tree = zoomNetwork($(this).html(), network);
        // console.log(tree);
        $(".tree").html("<ul>" + tree + "</ul>");
        $("#backBtn").attr("disabled", false);
        loadIcons();
        // nodeCount.innerHTML = countNetwork
    }
});

function setCount(nodeData) {
    var count = countNetwork(nodeData);
    var lCount, rCount;
    if (nodeData.left == null) {
        lCount = 0
    } else {
        lCount = countNetwork(nodeData.left);
    }

    if (nodeData.right == null) {
        rCount = 0
    } else {
        rCount = countNetwork(nodeData.right);
    }

    nodeCount.innerHTML = count;
    leftCount.innerHTML = lCount;
    rightCount.innerHTML = rCount;
}

function getPlacements(nodeData) {
    var placements = "";
    if (nodeData.left == null) {
        placements += (nodeData.node + "-L,");
    }
    if (nodeData.right == null) {
        placements += (nodeData.node + "-R,");
    }
    // 
    if (nodeData.left == null & nodeData.right == null) {
        //do nothing
    } else {
        if (nodeData.left != null) {
            placements += getPlacements(nodeData.left);
        }

        if (nodeData.right != null) {
            placements += getPlacements(nodeData.right);
        }
    }

    return placements;

}

$("#backBtn").click(function () {
    nodeList.pop();
    var tree = getTreeNodeData(nodeList.slice(-1)[0], 5);
    setCount(nodeList.slice(-1)[0]);
    $(".tree").html("<ul>" + tree + "</ul>");
    if (nodeList.length == 1) {
        $(this).attr("disabled", true);
    }
    loadIcons();

})

function searchNode(elem) {
    const val = $(elem).val();
    var tree;

    if (val == "") {
        tree = getTreeNodeData(network, 5);

    } else {
        tree = zoomNetwork(val, network);
    }

    if (tree != "") {
        $(".tree").html("<ul>" + tree + "</ul>");
        if (val == "") {
            $("#backBtn").attr("disabled", true);
        } else {
            $("#backBtn").attr("disabled", false);
        }
    }
    loadIcons();
}

$("#addBtnModalBtn").click(function () {
    $(this).addClass("hidden");
    $("#addNodeModal").removeClass("hidden");
    $("#addNodeModal").children("div").children("div").children(".input").children("input").focus();
});

$("#cancelBtn").click(function () {
    $("#addBtnModalBtn").removeClass("hidden");
    $("#addNodeModal").addClass("hidden");
});

$("#addBtn").click(function () {
    const name = $("#inputName").val();
    const placement = $("#placements").val();
    const pos = placement.split("-");

    if (name != "" && placement != "-select-") {
        addToNetwork(name, pos[0], pos[1], network);
        $.ajax({
            url: '/network/saveNetwork',
            type: 'POST',
            data: { network: JSON.stringify(network) },
            dataType: 'json',
            success: function (data) {
                // loadNetwork(network);
            },
            error: function (xhr, status, error) {
                console.error('Error loading roster:', error);
            }
        });
    }

    $("#inputName").val("");
    $("#placements").val("-select-");
    $("#addBtnModalBtn").removeClass("hidden");
    $("#addNodeModal").addClass("hidden");
    sessionStorage.setItem("network", JSON.stringify(network));
    loadNetwork(network);
});

function showAlert(content = null) {
    if (content == null) {
        alertContent.innerHTML = "Network loaded!";
    } else {
        alertContent.innerHTML = content;
    }
    $(".alert").removeClass("hidden");
    setTimeout(function () { $(".alert").addClass("hidden"); }, 3000);
}

function deleteModal(nodeName) {
    deleteModalName.innerHTML = nodeName;
    modalDel.showModal();
}

function deleteNode() {
    const nodeName = deleteModalName.innerHTML;
    deleteFromNetwork(nodeName, network);
    $.ajax({
        url: '/network/saveNetwork',
        type: 'POST',
        data: { network: JSON.stringify(network) },
        dataType: 'json',
        success: function (data) {

        },
        error: function (xhr, status, error) {
            console.error('Error loading roster:', error);
        }
    });
    sessionStorage.setItem("network", JSON.stringify(network));
    console.log(network);
    loadNetwork(network);
}


// deleteFromNetwork("Mounika", network);
loadNetwork();

// console.log(getPlacements(network).split(","));

// console.log(JSON.stringify(network));