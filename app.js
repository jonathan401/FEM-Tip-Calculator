// variables
const billField = document.querySelector("#bill-field");
const billers = document.querySelector("#billers");
const customField = document.querySelector("#custom-field");
const tip = document.querySelector("#tip-per-person");
const totalTips = document.querySelector("#total-tip");
const resetBtn = document.querySelector("#reset-btn");
const btnContainer = document.querySelector(".tip-percentage-wrap");
const btns = document.querySelectorAll(".tip-percentage-wrap button");
const formControls = document.querySelectorAll(".form-control");

// regex
const pattern = /^[0-9]+(\.[0-9]+)?$/i;

// helper functions
const resetValues = () => {
  tip.textContent = "$0.00";
  totalTips.textContent = "$0.00";
  return;
};

const getTips = (tip, percentage, totalPersons) => {
  let tipPercent = percentage / 100;
  let customValue = customField.value / 100;

  let tipPerPerson = (
    (tip * (customValue ? customValue : tipPercent)) /
    totalPersons
  ).toFixed(2);
  let totalPerPerson = (
    (tip * (customValue ? customValue + 1 : tipPercent + 1)) /
    totalPersons
  ).toFixed(2);

  return { tipPerPerson, totalPerPerson };
};

const getResults = (btnId = 0) => {
  customValue = customField.value;

  const { tipPerPerson, totalPerPerson } = getTips(
    billField.value,
    customValue ? customValue : btnId,
    billers.value
  );

  tip.textContent = `$${tipPerPerson}`;
  totalTips.textContent = `$${totalPerPerson}`;
};

const isValidated = () => {
  let fields = [billers, billField];
  let hasError = fields.some(
    (field) => field.value == "" || field.classList.contains("error")
  );

  return hasError;
};

// callbacks
const queryBtns = (e) => {
  let btn;
  let btnId;
  if ((e.target.tagName = "BUTTON")) {
    btn = e.target;
    btnId = e.target.getAttribute("data-value");
  }

  btns.forEach((btn) => btn.classList.remove("active"));
  btn.classList.add("active");
  customField.value = "";

  !isValidated() ? getResults(btnId) : resetValues();
};

const validate = (e) => {
  let id = e.target.getAttribute("id");
  let errorMsg = document.querySelector(`[data-id="${id}"]`);

  if (!pattern.test(e.target.value)) {
    e.target.classList.add("error");
    errorMsg.classList.add("visible");
    errorMsg.textContent = `enter a number`;
  } else if (e.target.value == 0) {
    errorMsg.textContent = `can't be zero`;
    e.target.classList.add("error");
    errorMsg.classList.add("visible");
  } else {
    e.target.classList.remove("error");
    errorMsg.classList.remove("visible");
  }
};

// event listeners
// buttons
btnContainer.addEventListener("click", queryBtns);

// forms
[billField, billers].forEach((formControl) => {
  formControl.addEventListener("keyup", validate);
});

// custom field
customField.addEventListener("keyup", () => {
  if (
    !billField.classList.contains("error") &&
    !billers.classList.contains("error")
  ) {
    getResults();
  }
});

[billers, billField, customField].forEach((f) => {
  addEventListener("input", () => {
    resetBtn.classList.remove("disabled");
  });
});

resetBtn.addEventListener("click", resetValues);
