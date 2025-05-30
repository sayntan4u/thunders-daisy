var network = {
    node: "Harshitha",
    left: {
        node: "Charan",
        left: {
            node: "Mounika",
            left: {
                node: "Susanthi",
                left: {
                    node: "Pavani",
                    left: {
                        node: "Gangotri",
                        left: {
                            node: "Aayushi",
                            left: null,
                            right: null
                        },
                        right: null
                    },
                    right: {
                        node: "Alekhya",
                        left: null,
                        right: {
                            node: "Supreeth",
                            left: null,
                            right: null
                        }
                    }
                },
                right: null
            },
            right: {
                node: "Anju",
                left: null,
                right: {
                    node: "Leena",
                    left: null,
                    right: null
                }
            }
        },
        right: {
            node: "Srividya",
            left: null,
            right: {
                node: "Gopinadh",
                left: null,
                right: {
                    node: "Nagarjuna",
                    left: null,
                    right: null
                }
            }
        }
    },
    right: {
        node: "Bhaskar",
        left: {
            node: "Gomanth",
            left: {
                node: "Pavan",
                left: null,
                right: null
            },
            right: {
                node: "Yashwanth",
                left: null,
                right: null
            }
        },
        right: {
            node: "Sowmya",
            left: {
                node: "Chandini",
                left: null,
                right: null
            },
            right: {
                node: "Likitha",
                left: null,
                right: {
                    node: "Sravika",
                    left: null,
                    right: null
                }
            }
        }
    }
}

var nodeList = [];

function getTreeNodeData(nodeData, level = null) {
    var tree = "";
    if (level == null) {
        tree += `<li>
                <a class="nodeName" href="#">${nodeData.node}</a>`;
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
                <a class="nodeName" href="#">${nodeData.node}</a>`;
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

function loadNetwork() {
    nodeList.push(network);
    var tree = getTreeNodeData(network, 5);
    $(".tree").append("<ul>" + tree + "</ul>");

}

function zoomNetwork(searchNode, nodeData) {
    var tree = "";
    // console.log(nodeData.node);
    if (nodeData.node == searchNode) {
        tree += getTreeNodeData(nodeData, 5);
        nodeList.push(nodeData);
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

$(document).on("click", ".nodeName", function () {
    if (nodeList[nodeList.length - 1].node != $(this).html()) {
        const tree = zoomNetwork($(this).html(), network);
        // console.log(tree);
        $(".tree").html("<ul>" + tree + "</ul>");
        $("#backBtn").attr("disabled", false);
    }
});

$("#backBtn").click(function () {
    nodeList.pop();
    var tree = getTreeNodeData(nodeList.slice(-1)[0], 5);
    $(".tree").html("<ul>" + tree + "</ul>");
    if (nodeList.length == 1) {
        $(this).attr("disabled", true);
    }

})



loadNetwork();