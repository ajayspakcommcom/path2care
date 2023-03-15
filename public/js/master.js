/*jshint esversion: 6 */
const question = { DOOR: "door" };
const _KEY_ = "DEEP_PROJECT_SPAK";
const _TRY_AGAIN = "_tryagain",
  _SUBMIT = "_submit";
/**
 *
 * encrypt and depcrpt
 *
 */

const cipher = (salt) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);

  return (text) =>
    text.split("").map(textToChars).map(applySaltToChar).map(byteHex).join("");
};

const decipher = (salt) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);
  return (encoded) =>
    encoded
      .match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
};
/**
 * end of encypt
 */

function fetchQuestion(info) {
  // GET THE RIGHT MODULE, SUBMODULE AND RIGHT QUESTION
  var matchingQuestion,
    questionFound = false;
  let questionEl = $("#divQuestion");
  loadModuleQuestions(info, (questionBank) => {
    //console.log("here comes my quesiton bank");
    let matchingQuestion = questionBank.find((question) => {
      return question.id === info.questionId;
    });
    if (matchingQuestion) {
      var questionHTML;
      switch (matchingQuestion.type.toLowerCase()) {
        case "door":
          questionHTML = renderDoorQuestion(matchingQuestion);
          $("#divQuestion")
            .removeClass()
            .addClass(
              "section-4-right-part video-content width-500 height renderquestion"
            );
          break;
        
        case "book":
          questionHTML = renderBook(matchingQuestion);
          $("#divQuestion")
            .removeClass()
            .addClass(
              "section-4-right-part video-content width-500 height renderquestion plusbooth-question-wrapper1"
            );
          break;
        case "bucket":
          questionHTML = renderBucketQuestion(matchingQuestion);
          $("#divQuestion")
            .removeClass()
            .addClass(
              "section-4-right-part video-content width-500 height renderquestion"
            );
          break;
        case "chart":
          questionHTML = renderChartQuestion(matchingQuestion);
          $("#divQuestion")
            .removeClass()
            .addClass(
              "section-4-right-part video-content width-500 height renderquestion"
            );
          break;
        case "dart":
          questionHTML = renderDartQuestion(matchingQuestion);
          $("#divQuestion")
            .removeClass()
            .addClass(
              "section-4-right-part video-content width-500 height renderquestion injection-question-wrapper"
            );
          break;
        default:
          console.log("call default");
          $("#divQuestion")
            .removeClass()
            .addClass(
              "section-4-right-part video-content width-500 height renderquestion"
            );
          break;
      }

      let selectedEl = document.querySelector(".renderquestion");
      if (selectedEl) {
        selectedEl.classList.remove("renderquestion");
        selectedEl.innerHTML = "";
      }

      questionEl.html(questionHTML);
      questionEl.addClass("renderquestion");

      //console.log(matchingQuestion);

      if (matchingQuestion.type.toLowerCase() === "book") {
        let questionCSS = "";
        let questionSubType = matchingQuestion.subType || "";
        switch (questionSubType.toLowerCase()) {
          case "bloodtest":
            //questionCSS = "blood-test-question-wrapper";
            questionEl
              .removeClass()
              .addClass(
                "section-4-right-part video-content width-500 height renderquestion blood-test-question-wrapper"
              ); //.removeClass("blue-box-question-wrapper");

              if(matchingQuestion.question == 'In case of hypoglycemia in patients with diabetes, what should be the mode of therapy?') {
                questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion blood-test-question-wrapper nutrionalsimplecard");
              } 
            break;
          case "bluebox":
              if(matchingQuestion.question == 'The Best Way of knowing glycaemic variability is by...') {
                questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion blue-box-question-wrapper handsonthebest");
              } 
              else {
                questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion blue-box-question-wrapper");
              }

              if(matchingQuestion.question == 'Dietary sources of omega 3 fat are?') {
                questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion blue-box-question-wrapper liquidfish");
              }

              if(matchingQuestion.question == 'What is favourable omega 3: omega 6 fat ratio of PUFA?' || matchingQuestion.question == 'Which nutrient has a high satiety index and prevents re-eating or snacking?') {
                questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion blue-box-question-wrapper liquidpufatime");
              }

              if(matchingQuestion.question == 'What are the sources of good quality fat?' || matchingQuestion.question == 'Bariatric diets should be rich in what nutrients?' || matchingQuestion.question == 'Die plans for the patient have to be') {
                questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion blue-box-question-wrapper ghee");
              }

              if(matchingQuestion.question == 'Die plans for the patient have to be') {
                questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion blue-box-question-wrapper realistic");
              }

              if(matchingQuestion.question == 'Outcome of counselling is known when') {
                questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion blue-box-question-wrapper setgoalaremetwith");
              }

            break;
         
          case "mybook":
            questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion my-book-question-wrapper");
            break;
          case "sickmybook":
            questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion my-book-question-wrapper sick-wrapper-my-book");
            break;
          case "plusbooth":
            if(matchingQuestion.question == 'The following modes of insulin delivery are available in India except...') {
              questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion plusbooth-question-wrapper therepyinhalerans");
            } else if (matchingQuestion.question == 'Hypoglycaemia should be treated with any fast action Carbohydrate of') {
              questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion plusbooth-question-wrapper gdm15gm");
            } else {
              questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion plusbooth-question-wrapper");
            }
            break;
          case "plusbooth1":
            questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion plusbooth-question-wrapper plusbooth-question-wrapper-2");
            break;
          case "bluebox2":
              if(matchingQuestion.question == 'Meal Planing takes into account...') {
                questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion blue-box-question-wrapper1 mealalloftheabove");
              } else {
                questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion blue-box-question-wrapper1");
              }
              break;
          case "injection2":
                if(matchingQuestion.question == 'Which of these is a non-insulin injectable anti-diabetic agent?') {
                  questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion injection-question-wrapper1 injection-question-wrapper2 therepyglp1ra");
                } 
                else if(matchingQuestion.question == 'Most important facet of counselling is') {
                  questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion injection-question-wrapper1 injection-question-wrapper2 goalsettings");
                }
                else {
                  questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion injection-question-wrapper1 injection-question-wrapper2");
                }
            break;
          case "injection3":
            questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion injection-question-wrapper1 injection-question-wrapper3");
            break;
          case "macrovascular":
            questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion my-book-question-wrapper-1");
            break;
          case "emergencymanagement":
            questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion blood-test-question-wrapper-1");
            break;
          case "preventmanagement":
            questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion blue-box-question-wrapper1 preventmanagement-wrapper");
            break;
          case "plate":
            if(matchingQuestion.question == 'A Healthy eating plate can consisst of all the these except...') {
              questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion plat-question-wrapper mnttransfat");
            } else {
              questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion plat-question-wrapper");
            }
            break;
          default:
            questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion blue-box-question-wrapper1");
        }
        //questionEl.addClass(questionCSS);
      }
      else if (matchingQuestion.type.toLowerCase() === "door")
      {
        let questionCSS = "";
        let questionSubType = matchingQuestion.subType || "";
        
        switch (questionSubType.toLowerCase()) {
          case "monitoringcommon":
            questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion monitoringcommon-wrapper");
            break;
            case "gdmmacrosomia":
              questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion gdmmacrosomia-wrapper");
              break;
            case "preventingtheevidence":
              questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion preventingtheevidence-wrapper");
              break;
              case "thirdsamedoor":
                questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion same-door-wrapper");
                break;
          default:
            questionEl.removeClass().addClass("section-4-right-part video-content width-500 height renderquestion");
        }
      }
    } else {
   
      loadQuestions(true, (modules) => {
        let matchingModule = modules.find((module) => {
          return module.ModuleId === info.moduleId;
        });
        let matchingSubModule = matchingModule.subModules.find((module) => {
          return module.subModuleId === info.subModuleId;
        });
        let o = info,
          userData = fetchUserDetails();
        o.userId = userData.userId;
        o.BadgeEarned = matchingSubModule.badge;
        o.method = "updateuserbadge";

        axios
          .post("/api", o)
          .then((response) => {
            questionEl
              .removeClass()
              .addClass(
                "section-4-right-part video-content width-500 height renderquestion loremipsumcls success"
              );

            questionEl.html(`
            <div align='center'>
                <img src='img/badge/${o.BadgeEarned}' />
                <span class="congratulation">Congratulations!</span>
                <strong>You have earned a new badge</strong>
            </div>`);

            var usrBadge = [];
            if (userData.UserBadges) {
              usrBadge = userData.UserBadges.filter(
                (x) =>
                  x.userid === o.userId &&
                  x.moduleID === o.moduleId &&
                  x.submoduleid === o.subModuleId
              );
            } else {
              userData.UserBadges = [];
            }
            /* UDPATE USER MODULE INFO
              DUMMY OBJECT
            StartDate: "2021-10-05 07:21:00"
            endDate: "2021-10-05 07:22:00"
            moduleID: 1001
            submoduleid: 2001
              userid: 13
            */

            /* FIRST FIND IF THE MODULE INFO EXISTS */
            let usermodule = [];
            if (userData.UserModules) {
              usermodule = userData.UserModules.filter(
                (x) =>
                  x.userid === o.userId &&
                  x.moduleID === o.moduleId &&
                  x.submoduleid === o.subModuleId
              );
              if (usermodule.length > 0) {
                userData.UserModules.find(
                  (x) =>
                    x.userid === o.userId &&
                    x.moduleID === o.moduleId &&
                    x.submoduleid === o.subModuleId
                ).endDate = new Date();
              } else {
                usermodule = {
                  StartDate: new Date(),
                  endDate: new Date(),
                  moduleID: o.moduleId,
                  submoduleid: o.subModuleId,
                  userid: o.userId,
                };
                userData.UserModules.push(usermodule);
              }
            } else {
              userData.UserModules = [];
              let usermodule = {
                StartDate: new Date(),
                endDate: new Date(),
                moduleID: o.moduleId,
                submoduleid: o.subModuleId,
                userid: o.userId,
              };
              userData.UserModules.push(usermodule);
            }

            if (usrBadge.length === 0) {
              userData.UserBadges.push(o);
            } else {
              console.log("ammend");

              let windowWidth = $(window).width();

              if(windowWidth < 768) {
                $('.mob-goto-module').addClass('show');
              }

            }
            let ud = {
              userDetails: [userData],
            };

            localStorage.setItem("userData", JSON.stringify(ud));
          })
          .catch((err) => {
            console.log("inside catch");
            console.log(err);
          });
      });
    }
  });
  return false;
}

function loadModuleQuestions(moduleInfo, clback) {
  return loadQuestions(true, (modules) => {
    let matchingModule = modules.find((module) => {
      return module.ModuleId === moduleInfo.moduleId;
    });
    let matchingSubModule = matchingModule.subModules.find((module) => {
      return module.subModuleId === moduleInfo.subModuleId;
    });
    clback(matchingSubModule.questions);
  });
}

function loadQuestions(isLocal, clback) {
  var data;
  isLocal = true;
  if (isLocal) {
    $.getJSON("js/modules.json", function (modules) {
      clback(modules);
    });
  }
}

function logMe(msg, flag = true) {
  if (flag) {
    console.log("=========================");
    console.log(msg);
    console.log("=========================");
  }
}

function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function fetchQuesitonDiv() {
  let moduleId = $("#moduleId").val(),
    subModuleId = $("#subModuleId").val(),
    questionId = $("#questionId").val();

  //1001_2001_1

  return $("#" + moduleId + "_" + subModuleId + "_" + questionId);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function getCmp(id) {
  let div = $("#" + id);
  if (div[0]) {
    return div[0];
  } else {
    return div;
  }
}
/* ---------------- END OF COMMON FUNCTIONS ---------------- */

/* ---------------- START OF BOOK QUESTIONS ----------------  */
function renderBook(q) {
  let options = q.options,
    divId = ""; //fetchQuesitonDiv()[0].id;
  //console.log(divId);
  //   // To create a cipher
  let myCipher = cipher(_KEY_);
  //   //Then cipher any text:
  let encryptedKey = myCipher(q.correctAnswer); // --> "7c606d287b6d6b7a6d7c287b7c7a61666f"
  shuffle(options);

  let html = `
    <div class="no-flex">
    <h1>${q.question}</h1>

<div class="mainouterbook">
    <div class="outerbook four-div-elem">
    ${options
      .map(
        (option, index) =>
          `<div class="minibook custom-btn test book-drag-btn" id="option_${index}" draggable="true" ondragstart="drag(event)" value="${option.text}">${option.text}</div>`
      )
      .join("")}
      </div>
    </div>
    
  </div>

  <div class="dropablebookdiv bookdropablediv bookchnagetext"></div>
    <div id="div1" class="dropablebookdiv bookdropablediv bookwrapper ${
      q.subType ? q.subType : `close-book`
    }" ondrop="ValidateMyAnswer(event, '${encryptedKey}', '${
    q.subType
  }')" ondragover="allowDrop(event)"></div>

    <div class="no-flex text-center rule-submit-btn-wrapper">
      <button class="custom-btn test min-width-auto rule-submit-btn"
      type="button" id='${
        divId + _TRY_AGAIN
      }' onClick="loadQuestion();return false;" style='display:none;'>
      try again
    </button>

    <button 
      type="button" id='${divId + _SUBMIT}' 
      style='display:none;' 
      class="custom-btn test min-width-auto rule-submit-btn" 
      onclick="submitMe(${JSON.stringify(q)
        .split('"')
        .join("&quot;")}); addClassToDrugWrapper(); return false;">
      Next
    </button>
    </div>`;

  return html;
}

// function redirectToSuccess() {
//   window.location.assign("module-1-17.html");
// }

function addClassToDrugWrapper() {
  $(".renderquestion").addClass("height");
}

function ValidateMyAnswer(ev, questionInfo, subtype) {
  ev.preventDefault();

  let elId = ev.dataTransfer.getData("text"),
    selectedEl = document.getElementById(elId),
    myDecipher = decipher(_KEY_),
    answer = myDecipher(questionInfo),
    targetEl = ev.target,
    divId = "", //fetchQuesitonDiv()[0].id,
    btnTryAgain = getCmp(divId + _TRY_AGAIN),
    btnSubmit = getCmp(divId + _SUBMIT);

  //debugger;
  let subopen = subtype != "undefined" ? subtype + "-open" : "open-book",
    subClose = subtype != "undefined" ? subtype : "close-book";

  //bloodTest-open;
  $(".bookwrapper").removeClass(subClose).addClass(subopen);

  //$(".bookwrapper").removeClass("close-book").addClass("open-book");

  targetEl.appendChild(selectedEl);
  if (selectedEl.getAttribute("value") === answer) {
    targetEl.previousElementSibling.innerHTML = "<span>Well done!</span>";
    btnTryAgain.style.display = "none";
    btnSubmit.style.display = "inline-block";
  } else {
    targetEl.previousElementSibling.innerHTML =
      "<span>Sorry, please try again.</span>";
    btnTryAgain.style.display = "inline-block";
    btnSubmit.style.display = "none";
  }
}

/* ---------------- END OF BOOK QUESTIONS ------------------  */

/* ---------------- START OF DOOR QUESTIONS ----------------  */

function renderDoorQuestion(question) {
  let options = question.options;
  // To create a cipher
  let myCipher = cipher(_KEY_);
  //Then cipher any text:
  let encryptedKey = myCipher(question.correctAnswer); // --> "7c606d287b6d6b7a6d7c287b7c7a61666f"
  shuffle(options);

  let newHtmlStr = `
    <h1>${question.question}</h1>
    <div id='questionResponse'></div>
   <div>
    ${options
      .map(
        (option, index) =>
          `<div class="door" id="option_${index}" onClick="selectMe(this, '${encryptedKey}')" value="${option.text}">
           <span>${option.text}</span>
          </div>`
      )
      .join("")}
    </div>
    <div>
    <button
    type="button"

    style='display:none;'
    class="custom-btn test min-width-auto nextQuestion"
     onclick="submitMe(${JSON.stringify(question)
       .split('"')
       .join("&quot;")});return false;">
    NEXT
  </button>
  <button
    type="button"
    style='display:none;'
    class="custom-btn test min-width-auto tryAgainQuestion"
     onclick="tryAgain();return false;">
    try again
  </button>
    </div>
    `;
  return newHtmlStr;
}
function tryAgain(param) {
  loadQuestion();
}

function submitMe(questionInfo) {
  $("#questionId").val(parseInt(questionInfo.id + 1));
  loadQuestion();
  //console.log("load another quesiton");
}

function selectMe(selectedEl, questionInfo) {
  let myDecipher = decipher(_KEY_),
    answer = myDecipher(questionInfo);

  let questionEl = $("#divQuestion .doorSelected");

  if (questionEl.length > 0) {
    questionEl.removeClass("doorSelected");
    questionEl.text(questionEl.attr("value"));
  }
  selectedEl.classList.add("doorSelected");

  if (selectedEl.getAttribute("value") === answer) {
    selectedEl.innerHTML = "<span>You're <br /> right!</span>";
    selectedEl.classList.add("greenText");
    $(".tryAgainQuestion").css("display", "none");
    $(".nextQuestion").css("display", "inline-block");
  } else {
    selectedEl.innerHTML =
      "<span>sorry, <br > please <br /> try <br /> again. </span>";
    $(".tryAgainQuestion").css("display", "inline-block");
    $(".nextQuestion").css("display", "none");
  }
}

/* ---------------- END OF DOOR QUESTIONS ----------------  */

/* BUCKET AND CHART */
function renderBucketQuestion(q) {
  let options = q.options,
    correctAnswer = q.correctAnswer;
  shuffle(options);

  let html = `<div class="no-flex">
  <h1>${q.Question}</h1>

<div class="mainouterborder">
  <div class="outerbook">
  ${options
    .map(
      (option, index) =>
        `<div class="minilist minibook custom-btn test book-drag-btn" id="option_${index}" draggable="true" ondragstart="drag(event)" value="${option.text}">${option.option}</div>`
    )
    .join("")}
    </div>
  </div>
  
</div>

<div class="drop-wrapper">
  <div id="div1 bucket1" class="bucket1 dropableitemdiv bookdropablediv" ondrop="dropp(event, ${JSON.stringify(
    correctAnswer
  )
    .split('"')
    .join("&quot;")})" ondragover="allowDrop(event)">
  </div>
    
  <div id="div2 bucket2" class="bucket2 dropableitemdiv bookdropablediv" ondrop="dropp(event, ${JSON.stringify(
    correctAnswer
  )
    .split('"')
    .join("&quot;")})" ondragover="allowDrop(event)">
  </div>
</div>


<div class="drag-btn-wrapper"> 
<button type="button" class="btn btn-submit btn-faill submitbtn custom-btn test" style="display: none !important" onclick="submitMe(${JSON.stringify(
    q
  )
    .split('"')
    .join("&quot;")});return false;">Next</button>

<button type="button" class="btn btn-faill tryagainbtn custom-btn test" style="display: none !important" onClick="loadQuestion();return false;">Try Again</button>
</div>

`;

  return html;
}

function onValidate(correctAnswer) {
  let formattedCorrectAnswer = JSON.parse(correctAnswer);
  let bucket1 = formattedCorrectAnswer.filter((x) => x.bucket === "1");
  let bucket2 = formattedCorrectAnswer.filter((x) => x.bucket === "2");
  let valuesOfBucket1 = [],
    valuesOfBucket2 = [],
    isContains = false,
    isConsist = true;
  document
    .querySelector(".bucket1")
    .childNodes.forEach((x) => valuesOfBucket1.push(x.textContent));
  document
    .querySelector(".bucket2")
    .childNodes.forEach((x) => valuesOfBucket2.push(x.textContent));
  Object.keys(bucket1).forEach(function (item) {
    isContains =
      valuesOfBucket1.includes(bucket1[item].option) &&
      valuesOfBucket2.includes(bucket2[item].option);
    if (!isContains) {
      isConsist = isContains;
    }
  });
  if (isConsist) {
    document.querySelector(".bucket1").style.borderColor = "green";
    document.querySelector(".bucket2").style.borderColor = "green";
    document.querySelector(".tryagainbtn").style.display = "none";
    document.querySelector(".submitbtn").style.display = "inline-block";
  } else {
    document.querySelector(".bucket1").style.borderColor = "red";
    document.querySelector(".bucket2").style.borderColor = "red";
    document.querySelector(".tryagainbtn").style.display = "inline-block";
    document.querySelector(".submitbtn").style.display = "none";
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function dropp(ev, correctAnswer) {
  let count = 0;
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
  document.querySelectorAll(".dropableitemdiv").forEach((item) => {
    if (item.childElementCount === correctAnswer.length / 2) {
      count = count + item.childElementCount;
    }
  });
  if (count === correctAnswer.length) {
    this.onValidate(JSON.stringify(correctAnswer));
  }
}

function renderChartQuestion(q) {
  let options = q.options,
    correctAnswer = q.correctAnswer;
  shuffle(options);
  let html = `<div class="no-flex">
  <h1>${q.Question}</h1>

<div class="mainouterborder">
  <div class="outerbook">
  ${options
    .map(
      (option, index) =>
        `<div class="minilist minibook custom-btn test book-drag-btn" id="option_${index}" draggable="true" ondragstart="drag(event)" value="${option.text}">${option.option}</div>`
    )
    .join("")}
    </div>
  </div>
  
  <div class="chart-drag-wrapper">
    <div id="div1 container1" class="container1 dropablefooddiv bookdropablediv chart-wrapper" ondrop="drop(event, ${JSON.stringify(
      correctAnswer
    )
      .split('"')
      .join("&quot;")})" ondragover="allowDrop(event)"></div>
    <div class="drag-btn-wrapper chart-btn-wrapper">
      <button type="button" class="btn btn-submit btn-faill submitbtn custom-btn test" style="display: none !important" onclick="submitMe(${JSON.stringify(
        q
      )
        .split('"')
        .join("&quot;")});return false;">Next</button>
      <button type="button" class="btn btn-faill tryagainbtn custom-btn test" style="display: none !important" onClick="loadQuestion();return false;">Try Again</button>
    </div>
  </div>

`;

  return html;
}

function drop(ev, correctAnswer) {
  let arrayOfSelectedItems = [];
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
  let [basket] = document.getElementsByClassName("dropablefooddiv");
  if (basket.childElementCount === 3) {
    basket.childNodes.forEach(function (item) {
      arrayOfSelectedItems.push(item.textContent);
    });
    let correctAnswerOption = correctAnswer.reduce(function (arr, cur) {
      arr.push(cur.option);
      return arr;
    }, []);
    if (
      JSON.stringify(correctAnswerOption) ===
      JSON.stringify(arrayOfSelectedItems)
    ) {
      document.querySelector(".container1").style.borderColor = "green";
      $(".tryagainbtn").hide();
      $(".submitbtn").show();
    } else {
      //debugger;
      document.querySelector(".container1").style.borderColor = "red";
      $(".tryagainbtn").show();
      $(".submitbtn").hide();
    }
  }
}

/* BUCKET AND CHART */

/*------------------------------------- START OF DART QUESTION ------------------------------------- */
function renderDartQuestion(q) {
  let options = q.options,
    divId = ""; //fetchQuesitonDiv()[0].id;
  //console.log(divId);
  //   // To create a cipher
  let myCipher = cipher(_KEY_);
  //   //Then cipher any text:
  let encryptedKey = myCipher(q.correctAnswer); // --> "7c606d287b6d6b7a6d7c287b7c7a61666f"
  shuffle(options);

  let html = `
    <div class="no-flex">
    <h1>${q.question}</h1>

<div class="mainouterbook">
    <div class="outerbook">
    ${options
      .map(
        (option, index) =>
          ` <div class="minibook custom-btn test book-drag-btn" id="option_${index}" draggable="true" ondragstart="drag(event)" value="${option.text}">
            <span class="darttext darttext${index}">${option.text}</span>
          </div> `
      )
      .join("")}
      </div>
    </div>
    
  </div>

  <div class="dropablebookdiv bookdropablediv bookchnagetext"></div>
    <div id="div1" class="dropablebookdiv bookdropablediv bookwrapper dartmat" ondrop="ValidateMyDartAnswer(event, '${encryptedKey}', '${
    q.subType
  }')" ondragover="allowDrop(event)" ></div>

    <div class="no-flex text-center rule-submit-btn-wrapper">
      <button class="custom-btn test min-width-auto rule-submit-btn"
      type="button" id='${
        divId + _TRY_AGAIN
      }' onClick="loadQuestion();return false;" style='display:none;'>
      try again
    </button>

    <button 
      type="button" id='${divId + _SUBMIT}' 
      style='display:none;' 
      class="custom-btn test min-width-auto rule-submit-btn" 
      onclick="submitMe(${JSON.stringify(q)
        .split('"')
        .join("&quot;")}); addClassToDrugWrapper(); return false;">
      Next
    </button>
    </div>`;

  return html;
}

function addClassToDrugWrapper() {
  $(".renderquestion").addClass("height");
}

function ValidateMyDartAnswer(ev, questionInfo, subtype) {
  ev.preventDefault();

  let elId = ev.dataTransfer.getData("text"),
    selectedEl = document.getElementById(elId),
    myDecipher = decipher(_KEY_),
    answer = myDecipher(questionInfo),
    targetEl = ev.target;

  $(".bookwrapper").removeClass("close-book").addClass("open-book");

  targetEl.appendChild(selectedEl);
  if (selectedEl.getAttribute("value") === answer) {
    targetEl.previousElementSibling.innerHTML = "<span>Well done!</span>";
    $("#" + _TRY_AGAIN).hide();
    $("#" + _SUBMIT).show();
  } else {
    targetEl.previousElementSibling.innerHTML =
      "<span>Sorry, please try again.</span>";
    $("#" + _TRY_AGAIN).show();
    $("#" + _SUBMIT).hide();
  }
}

/*------------------------------------- END OF DART QUESTION --------------------------------------- */


/***********************************************Mobile U***********************************************/




/***********************************************Mobile U***********************************************/

