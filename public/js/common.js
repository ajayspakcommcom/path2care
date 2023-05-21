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

function SpecialityDropdown(arrVal) {
  let optionList;
  for (let val of arrVal) {
    optionList += `<option value="${val}">${val}</option>`;
  }

  let comboxHtml = `<label for="txtSpeciality">Speciality</label>
                  <select class="form-control" id="txtSpeciality" name="txtSpeciality">${optionList}</select>`; 
  $('#specialityField').html(comboxHtml);
}

function SpecialityInput() {
  let inputField = `<label for="txtSpeciality">Speciality</label><input type="text" class="form-control" id="txtSpeciality" maxlength="99" />`;
  $('#specialityField').html(inputField);
}

function IndicationDropdown(arrVal) {
  let optionList;
  for (let val of arrVal) {
    optionList += `<option value="${val}">${val}</option>`;
  }

  let comboxHtml = `<label for="txtIndication">Indication</label>
                          <select class="form-control" id="txtIndication" name="txtIndication">${optionList}</select>`;
  $('#indicationField').html(comboxHtml);
}

function IndicationInput() {
  let inputField = `<label for="txtIndication">Indication</label><input type="text" class="form-control" id="txtIndication" name="txtIndication" maxlength="99" />`;
  $('#indicationField').html(inputField);
}

