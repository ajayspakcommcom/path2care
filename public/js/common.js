function loadHeader() {
  $("#myNavbar").load("includes/header.html", (data, status, jqXGR) => {
    // if (document.location.pathname === "/") {
    //   $("#myNavbar ul").removeClass("primary");
    // } else {
    //   $("#myNavbar ul").addClass("primary");
    // }
  });
}

function loadSubModule() {
  $("#accordion").load("includes/module-1001-submodules.html");
}
$(document).ready(function () {
  loadHeader();
  // loadSubModule();
});


