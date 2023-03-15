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
  loadModuleQuestions(info, (questionBank) => {
    console.log("here comes my quesiton bank");
    let matchingQuestion = questionBank.find((question) => {
      return question.id === info.questionId;
    });
    var questionHTML;
    switch (matchingQuestion.type.toLowerCase()) {
      case "door":
        questionHTML = renderDoorQuestion(matchingQuestion);
        break;
      case "book":
        questionHTML = renderBook(matchingQuestion);
        break;
      case "bucket":
        questionHTML = renderBucketQuestion(matchingQuestion);
        break;
      case "chart":
        questionHTML = renderChartQuestion(matchingQuestion);
        break;
      default:
        console.log("call default");
        break;
    }

    let selectedEl = document.querySelector(".renderquestion");
    if (selectedEl) {
      selectedEl.classList.remove("renderquestion");
      selectedEl.innerHTML = "";
    }
    // let questionEl = $(
    //   "#" + info.moduleId + "_" + info.subModuleId + "_" + info.questionId
    // );
    let questionEl = $("#divQuestion");
    questionEl.html(questionHTML);
    questionEl.addClass("renderquestion");
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

function loadQuestions(isLocal = true, clback) {
  var data;
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
    div;
  }
}
/* ---------------- END OF COMMON FUNCTIONS ---------------- */

/* ---------------- START OF BOOK QUESTIONS ----------------  */
function renderBook(q) {
  let options = q.options,
    divId = ""; //fetchQuesitonDiv()[0].id;
  console.log(divId);
  //   // To create a cipher
  let myCipher = cipher(_KEY_);
  //   //Then cipher any text:
  let encryptedKey = myCipher(q.correctAnswer); // --> "7c606d287b6d6b7a6d7c287b7c7a61666f"
  shuffle(options);

  let html = `<div>
    <h1>${q.question}</h1>

<div class="mainouterbook">
    <div class="outerbook">
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
    <div id="div1" class="dropablebookdiv bookdropablediv bookwrapper close-book" ondrop="ValidateMyAnswer(event, '${encryptedKey}')" ondragover="allowDrop(event)"></div>
    <button class="custom-btn test min-width-auto"
    type="button" id='${
      divId + _TRY_AGAIN
    }' onClick="loadQuestion();return false;" style='visibility:hidden;'>
    try again
  </button>
  <button
    type="button" id='${
      divId + _SUBMIT
    }' style='visibility:hidden;' class="custom-btn test min-width-auto" onclick="submitMe(${JSON.stringify(
    q
  )
    .split('"')
    .join("&quot;")});return false;">
    Submit
  </button>
  `;

  return html;
}

// function redirectToSuccess() {
//   window.location.assign("module-1-17.html");
// }

function ValidateMyAnswer(ev, questionInfo) {
  ev.preventDefault();

  let elId = ev.dataTransfer.getData("text"),
    selectedEl = document.getElementById(elId),
    myDecipher = decipher(_KEY_),
    answer = myDecipher(questionInfo),
    targetEl = ev.target,
    divId = "", //fetchQuesitonDiv()[0].id,
    btnTryAgain = getCmp(divId + _TRY_AGAIN),
    btnSubmit = getCmp(divId + _SUBMIT);

  $(".bookwrapper").removeClass("close-book").addClass("open-book");

  targetEl.appendChild(selectedEl);
  if (selectedEl.getAttribute("value") === answer) {
    targetEl.previousElementSibling.innerHTML = "<span>Well done!</span>";
    btnTryAgain.style.visibility = "hidden";
    btnSubmit.style.visibility = "visible";
  } else {
    targetEl.previousElementSibling.innerHTML =
      "<span>Sorry, please try again.</span>";
    btnTryAgain.style.visibility = "visible";
    btnSubmit.style.visibility = "hidden";
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

    style='visibility:hidden;'
    class="custom-btn test min-width-auto nextQuestion"
     onclick="submitMe(${JSON.stringify(question)
       .split('"')
       .join("&quot;")});return false;">
    NEXT
  </button>
  <button
    type="button"
    style='visibility:hidden;'
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
  console.log("load another quesiton");
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
    $(".tryAgainQuestion").css("visibility", "hidden");
    $(".nextQuestion").css("visibility", "visible");
  } else {
    selectedEl.innerHTML =
      "<span>sorry, <br > please <br /> try <br /> again. </span>";
    $(".tryAgainQuestion").css("visibility", "visible");
    $(".nextQuestion").css("visibility", "hidden");
  }
}

/* ---------------- END OF DOOR QUESTIONS ----------------  */

/* BUCKET AND CHART */
function renderBucketQuestion(q) {
  let options = q.options,
    correctAnswer = q.correctAnswer;
  shuffle(options);

  let html = `<div>
  <h1>${q.Question}</h1>

<div class="mainouterborder">
  <div class="outerbook">
  ${options
    .map(
      (option, index) =>
        `<div class="minilist minibook" id="option_${index}" draggable="true" ondragstart="drag(event)" value="${option.text}">${option.option}</div>`
    )
    .join("")}
    </div>
  </div>
  
</div>

<div id="div1 bucket1" class="bucket1 dropableitemdiv bookdropablediv" ondrop="dropp(event, ${JSON.stringify(
    correctAnswer
  )
    .split('"')
    .join("&quot;")})" ondragover="allowDrop(event)"></div>
  
<div id="div2 bucket2" class="bucket2 dropableitemdiv bookdropablediv" ondrop="dropp(event, ${JSON.stringify(
    correctAnswer
  )
    .split('"')
    .join("&quot;")})" ondragover="allowDrop(event)"></div>

<button type="button" class="btn btn-submit btn-faill submitbtn" onclick="submitMe(${JSON.stringify(
    q
  )
    .split('"')
    .join("&quot;")});return false;">Submit</button>
<button type="button" class="btn btn-faill tryagainbtn" onClick="loadQuestion();return false;">Try Again</button>
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
    document.querySelector(".tryagainbtn").style.visibility = "hidden";
    document.querySelector(".submitbtn").style.visibility = "visible";
  } else {
    document.querySelector(".bucket1").style.borderColor = "red";
    document.querySelector(".bucket2").style.borderColor = "red";
    document.querySelector(".tryagainbtn").style.visibility = "visible";
    document.querySelector(".submitbtn").style.visibility = "hidden";
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
  let html = `<div>
  <h1>${q.Question}</h1>

<div class="mainouterborder">
  <div class="outerbook">
  ${options
    .map(
      (option, index) =>
        `<div class="minilist" id="option_${index}" draggable="true" ondragstart="drag(event)" value="${option.text}">${option.option}</div>`
    )
    .join("")}
    </div>
  </div>
  
<div id="div1 container1" class="container1 dropablefooddiv bookdropablediv" ondrop="drop(event, ${JSON.stringify(
    correctAnswer
  )
    .split('"')
    .join("&quot;")})" ondragover="allowDrop(event)"></div>


    <button type="button" class="btn btn-submit btn-faill submitbtn" onclick="submitMe(${JSON.stringify(
      q
    )
      .split('"')
      .join("&quot;")});return false;">Submit</button>
  <button type="button" class="btn btn-faill tryagainbtn" onClick="loadQuestion();return false;">Try Again</button>
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
      document.querySelector(".tryagainbtn").style.visibility = "hidden";
      document.querySelector(".submitbtn").style.visibility = "visible";
    } else {
      document.querySelector(".container1").style.borderColor = "red";
      document.querySelector(".tryagainbtn").style.visibility = "visible";
      document.querySelector(".submitbtn").style.visibility = "hidden";
    }
  }
}

/* BUCKET AND CHART */
