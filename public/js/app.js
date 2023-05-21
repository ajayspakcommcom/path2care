/*jshint esversion: 6 */



/* ------------------------- CONST  --------------------------- */
const _POSTLOGINURL = 'dashboard.html', 
      _POSTDATALOGURL = ''
/* ------------------------- CONST  --------------------------- */
/* ------------------------- LOGIN PAGE --------------------------- */
function validateUserDetails() {

    if ($("#username").val() === "") {
      alert("please enter your email address");
      $("#username").focus();
      return false;
    }

   
    if (!validateEmail($("#username").val())) {
      alert("invalid email address");
      $("#username").select();
      $("#username").focus();
      return false;
    }
  
  
    if ($("#password").val() === "") {
      alert("please enter your password");
      $("#password").focus();
      return false;
    }
    let param = {
      email: $("#username").val(),
      //phone: $("#phone").val(),
      password: $("#password").val(),
      method: 'login'
    };
  
    axios
      .post("/api", param)
      .then((response) => {
       (response.data.success === true)? (localStorage.setItem("userData", JSON.stringify(response.data)),document.location.href = _POSTLOGINURL) : $('#lblmsg').text('Invalid username or password')
      })
      .catch((err) => {
        console.log("inside catch");
        console.log(err);
      });
  }
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
/* ------------------------- LOGIN PAGE --------------------------- */

/* ------------------------- DASHBOARD PAGE --------------------------- */

function loadDashboard() {

    return true;

}


function loadUserDetails() {
    let userDetails = JSON.parse(localStorage.getItem("userData"));
      $('#dvName').text(userDetails.userDetiails.name);
      $('#dvPost').text(userDetails.post)
      $('#dvLastLogin').text(userDetails.lastLogin)
      $('#dvTargetLeft').text(userDetails.targetLeft)
  }

/**
 * LOADS THE MEDICINE FROM THE DATABASE, FOR WHICH THE 
 * DATA TO BE LOADED
 */
function LoadMedicine() {
    let param = {
        method: 'getMedicine'
      };
    axios
    .post("/api", param)
    .then((response) => {
      //console.log(response.data);
      let medDetails = response.data.recordset;
      localStorage.setItem("medData", JSON.stringify(medDetails));
      let divArray = []
      //console.log(medDetails);
      medDetails.forEach(med => {
            let divData = `<div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
            <div class="product-wrapper">
              <img src="img/meds/${med.imageURL}" alt="${med.name}" class="img-responsive" />
              <div class="product-btn">
                <button type="button" class="btn btn-default btn-grad select-btn" onclick="showlogDataForm(${med.medID}, '${med.name}')">Select</button>
              </div>
            </div>
          </div>
            `

            divArray.push(divData)
      });
      $('#dvMeds').append(divArray.join(''));

     //(response.data.success === true)? (localStorage.setItem("userData", JSON.stringify(response.data.userDetiails)),document.location.href = _POSTLOGINURL) : alert('Invalid username or password')
    })
    .catch((err) => {
      console.log("inside catch");
      console.log(err);
    });
}
function hideForm() {
    $('#frmLogData').hide()
}


function showlogDataForm(medId, name) {
  //console.log(medId);
  //console.log(name.split(' ').join('').toUpperCase());
  let medName = name.split(' ').join('').toUpperCase();
  
  switch (medName) {
    case 'HISTOGLOB': SpecialityDropdown(['ENT', 'Derma', 'CP', 'Chest Phy', 'Pulmonologist', 'Pedia', 'GP']);
      IndicationDropdown(['Allergic rhinitis', 'atopic Dermatitis', 'Asthma, Urticaria(Hives)', 'Eczema', 'Chronic Bronchitis']);
      break;
    case 'LUPRODEX11.25MG':
    case 'LUPRODEX22.5MG':
      SpecialityInput(); IndicationInput();
      break;
  }

    $('.screen-2').addClass('hide');
    $('#dvform').removeClass('none');
    $('#dvMeds').hide();
    $('#frmLogData').show();
    $('.screen-3').removeClass('hide');
    $('.object-form').removeClass('hide');
    $('.thank-you-wrapper').addClass('hide');     
    const selectedMedId = $('#txtSelectedMedId').val(medId);
    setupLogDataForm(medId);
}

function setupLogDataForm(selectedMedId) {
    //console.log('Ram',selectedMedId);
    let userDetails = JSON.parse(localStorage.getItem("userData"));
    hospitalList = userDetails.userHospitalList;
    $('#hospitalList').empty();
    $.each(hospitalList, function(i, p) {
        console.log(p)
        $('#hospitalList').append($('<option></option>').val(p.id).html(p.hospitalName));
    });

      let medId =  selectedMedId; 
      let medData =  JSON.parse(localStorage.getItem("medData"));
      const selectedMed = medData.find( ({ medID }) => medID === medId );
      $('#selectedMedImg').attr('src', `img/meds/${selectedMed.imageURL}`);
      selectedMed.descp = '5 patients per month';
      $('#selectedMedTxt').text(selectedMed.descp);
      $('#selectedMedObj').text(selectedMed.objective);

      if(selectedMedId == 3 || selectedMedId == 5) {
        $('.objective').addClass('hide');
      } else {
        $('.objective').removeClass('hide');
      }

      
}

  
function validateLogData() {
  if ($("#logdate").val() === "") {
    alert("please enter your date of entry");
    $("#logdate").focus();
    return false;
  }

  //console.log(validateDate($("#logdate")[0]));
  // if(!validateDate($("#logdate")[0])) {
  //   alert("please enter correct date");
  //   $("#logdate").focus();
  //   return false;
  // }

  if(!greaterThentoday($("#logdate")[0])) {
    alert("The Date must be less or Equal to today date");
    $("#logdate").focus();
    return false;
  }

  if ($("#vials").val() === "") {
    alert("please enter No. of vials");
    $("#vials").focus();
    return false;
  }

  if ($("#patients").val() === "") {
    alert("please select no. of Patient");
    $("#patients").focus();
    return false;
  }

  if ($("#txtDrName").val() === "") {
    alert("please enter Dr name");
    $("#txtDrName").focus();
    return false;
  }

  // if ($("#txtDrCode").val() === "") {
  //   alert("please enter Dr Code");
  //   $("#txtDrCode").focus();
  //   return false;
  // }


  if ($("#txtPaitentName").val() === "") {
    alert("please enter name of the paitent");
    $("#txtPaitentName").focus();
    return false;
  }
  if ($("#hospitalList").val() === "") {
    alert("please enter hospital name");
    $("#hospitalList").focus();
    return false;
  }

  if ($("#txtCity").val() === "") {
    alert("please enter city name");
    $("#txtCity").focus();
    return false;
  }

  if ($("#txtIndication").val() === "") {
    alert("please enter Indication name");
    $("#txtIndication").focus();
    return false;
  }

  if ($("#txtSpeciality").val() === "") {
    alert("please enter Speciality name");
    $("#txtSpeciality").focus();
    return false;
  }

  let userDetails = JSON.parse(localStorage.getItem("userData"));

  let param = {
    logDate: $("#logdate").val(),
    noOfPaitent: $("#patients").val(),
    drName: $("#txtDrName").val(),
    noOfVials: $("#vials").val(),
    drCode: $("#txtDrCode").val(),
    hospitalName: $("#hospitalList").val(),
    hospitalCity: $("#txtCity").val(),
    medId: $("#txtSelectedMedId").val(),
    indication: $("#txtIndication").val(),
    speciality: $("#txtSpeciality").val(),
    prescriptions: $('#prescriptions').val(),
    strips: $('#strips').val(),
    TotalValue: $('#txtTotalValue').val(),
    empId: userDetails.userDetiails.empId,
    method: 'dataLog'
  };

  console.log(param);

  axios
      .post("/api", param)
      .then((response) => {
       if (response.data.success === true) {
         $('.object-form').addClass('hide');
         $('.thank-you-wrapper').removeClass('hide');
         $('.thank-you-wrapper').removeClass('hide');
       }
       
      })
      .catch((err) => {
        console.log("inside catch");
        console.log(err);
      });

}

function gotoDashboard() {
  $('.screen-3').addClass('hide');
  $('.screen-2').removeClass('hide');
  $('#dvMeds').show();
  $('[type="reset"]').click();
}


function validateDate(inputText)
  {
  var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
  var flag = true;
  // Match the date format through regular expression
  if(inputText.value.match(dateformat))
  {
    //document.form1.text1.focus();
    //Test which seperator is used '/' or '-'
    var opera1 = inputText.value.split('/');
    var opera2 = inputText.value.split('-');
    lopera1 = opera1.length;
    lopera2 = opera2.length;
    // Extract the string into month, date and year
    if (lopera1>1)   {
      var pdate = inputText.value.split('/');
    }
    else if (lopera2>1)  {
      var pdate = inputText.value.split('-');
    }
    var dd = parseInt(pdate[0]);
    var mm  = parseInt(pdate[1]);
    var yy = parseInt(pdate[2]);
    // Create list of days of a month [assume there is no leap year by default]
    var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
    if (mm==1 || mm>2)  {
      if (dd>ListofDays[mm-1])   {
        //alert('Invalid date format!');
        flag =  false;
      }
    }
    if (mm==2)  {
      var lyear = false;
      if ( (!(yy % 4) && yy % 100) || !(yy % 400))   {
        lyear = true;
      }
      if ((lyear==false) && (dd>=29))  {
        //alert('Invalid date format!');
        flag = false;
      }
      if ((lyear==true) && (dd>29))   {
        //alert('Invalid date format!');
        flag = false;
      }
    }
  }
  else  {
    //alert("Invalid date format!");
    flag = false;
  }

  return flag;
}


function greaterThentoday(inputText) {
  var UserDate = inputText.value;
  var ToDate = new Date();

  if (new Date(UserDate).getTime() >= ToDate.getTime()) {
      //  alert("The Date must be Bigger or Equal to today date");
        return false;
   }
  return true;
}

function changeLogo() {
  const windowWidth = $(window).width();
  
  if(windowWidth < 768) {
    $('[src="img/laxshya-logo.png"]').attr('src', 'img/laxshya-logo-m.png');
    setTimeout(() => {
      $('[src="img/logo.png"]').attr('src', 'img/logo-m.png');
    }, 1000);
  }
}

changeLogo();