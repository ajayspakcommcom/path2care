const _POSTADMINLOGINURL = '\\admin-dashbaord'
function validateAdminUserDetails() {

    if ($("#username").val() === "") {
        alert("please enter your username");
        $("#username").focus();
        return false;
      }
  
      if ($("#password").val() === "") {
        alert("please enter your password");
        $("#password").focus();
        return false;
      }
      let param = {
        username: $("#username").val(),
        password: $("#password").val(),
        method: 'adminuserlogin'
      };
    
      axios
        .post("/api", param)
        .then((response) => {
            console.log(response.data.success);
            (response.data.success === true)? (document.location.href = _POSTADMINLOGINURL) : $('#lblmsg').text('Invalid username or password')
        })
        .catch((err) => {
          console.log("inside catch");
          console.log(err);
        });
}

function _getOrgChart(parentId) {

    

}


/**
 * 
 * 
 * var tree = [];
var treeNode;
data = response.data.recordset;
console.log(data)
function recData (parentId, data) {
    data.forEach(rec =>{
       
        if (!rec.ParentID) {
             treeNode = data.find( ({ EmpID }) => EmpID === 37 );
             tree.push({...treeNode})
        } else {
             //console.log('child')
             treeNode = tree.find( ({ EmpID }) => EmpID === rec.ParentID );
            console.log(treeNode)
            console.log(treeNode.hasOwnProperty('childrens'));
           //  console.log('childrens' in treeNode); 
           //  if(treeNode.hasOwnProperty('childrens')) {
                
           //  } else {
           //      treeNode.childrens = [];
           //  }
           //  treeNode.childrens.push({...rec})
           
        }
    }) 
    
    // let record = data.find( ({ ParentId }) => ParentId === parentId ); 
    // if (record) {
                
    // } else {
    //     treeNode = data.find( ({ EmpID }) => EmpID === 37 );
    // }
     tree = {...treeNode}
    
    
}
recData(37, data)
console.log(tree)
 */

function loadAdminHeader() {
  $("#loadAdminHeader").load("includes/admin-header.html", (data, status, jqXGR) => {});
}

$(document).ready(function () {
  loadAdminHeader();
});


