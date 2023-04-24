const inputSlider = document.querySelector('[data-lengthSlider]');
const lengthDisplay = document.querySelector('[data-lengthNumber]');
const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolCheck = document.querySelector('#symbol');
const indicator = document.querySelector('[data-indicator]');
const allCheckbox = document.querySelectorAll('input[type=checkbox');
const generateBtn = document.querySelector('.generateButton');
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
let password = '';
let passwordLength = 10;
let checkCount = 0;
// uppercaseCheck.checked = true;
setIndicator('#ccc');
// set strength circle color to gray
handleSlider();
// set password length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + '% 100%';
}
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
function generateRandomNumber() {
  return getRndInteger(0, 9);
}
function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}
function generateSymbol() {
  const randomNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randomNum);
}
function calculateStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator('#0f0');
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator('#ff0');
  } else {
    setIndicator('#f00');
  }
}
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = 'copied';
  } catch (e) {
    copyMsg.innerText = 'Failed';
  }
  //copied span will visible
  copyMsg.classList.add('active');
  setTimeout(() => {
    copyMsg.classList.remove('active');
  }, 2000);
}
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckbox.forEach((checkBox) => {
    if (checkBox.checked) {
      checkCount++;
    }
  });
  // Special Condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}
allCheckbox.forEach((checkBox) => {
  checkBox.addEventListener('change', handleCheckBoxChange);
});
//shuffle function
function shufflePassword(array) {
  //fisher yates method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = '';
  array.forEach((el) => (str += el));
  return str;
}
inputSlider.addEventListener('input', (e) => {
  passwordLength = e.target.value;
  handleSlider();
});
copyBtn.addEventListener('click', () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});
generateBtn.addEventListener('click', () => {
  // none of the checkbox are selected
  if (checkCount <= 0) {
    return;
  }

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
  //console.log(`Starting the journey`);
  // main logic create password
  password = '';

  //let's put the stuff mentioned by checkboxes

  let funcArr = [];
  if (uppercaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }
  if (lowercaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numbersCheck.checked) {
    funcArr.push(generateRandomNumber);
  }
  if (symbolCheck.checked) {
    funcArr.push(generateSymbol);
  }
  //Compulsory Addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  //console.log(`compulsory addition done`);
  //remaining Addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randomIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randomIndex]();
  }
  console.log(`remaining addition is done`);
  //Shuffle the password
  password = shufflePassword(Array.from(password));
  //console.log(`suffle password is done`);

  //Show in the ui
  passwordDisplay.value = password;
  //Calculation strength
  //console.log(`addition to ui`);

  calculateStrength();
});
