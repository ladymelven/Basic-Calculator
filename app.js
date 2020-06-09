// Set up the buttons
const inputDisplay = document.querySelector('.display');
const digitKeys = document.querySelectorAll('.number');
const operatorKeys = document.querySelectorAll('.oper');
const clearKey = document.getElementById('clear');
const equalKey = document.getElementById('equal');
const changeSignKey = document.getElementById('sign');

let currentInput = [];
let currentNumber = '';
let powered = false;

// Reset user input
const clearInput = () => {
	currentInput = [];
	currentNumber = '';
	inputDisplay.innerHTML = '0';
	powered = false;
};

// Change positive to negative & vice versa
const changeSign = () => {
	if (currentNumber === '0' || currentNumber === '' ||
			inputDisplay.innerHTML === 'ERROR' || inputDisplay.innerHTML === '0') {
		return;
	}
	if (currentNumber.includes('-')) {
		currentNumber = currentNumber.replace('-', '');
	} else {
		currentNumber = '-' + currentNumber;
	}

	const inputString = inputDisplay.innerHTML;
	let reversedString = reverseString(inputString);
	let newString;
	if (reversedString.match(/\+|-|\*|\//)) {
		newString = reversedString.replace(/\+|-|\*|\//, '-$&');
	} else {
		newString = reversedString + '-';
	}
	let newStringStraight = reverseString(newString);
	if (/\d--/.test(newStringStraight)) {
		newStringStraight = newStringStraight.replace('--', '+');
	} else if (newStringStraight.includes('--')) {
		newStringStraight = newStringStraight.replace('--', '');
	} else if (newStringStraight.includes('+-')) {
		newStringStraight = newStringStraight.replace('+-', '-');
	}
	inputDisplay.innerHTML = newStringStraight;
};

// Insert radical sign to display when extracting square root
const reverseString = (string) => {
	const splitString = string.split('');
	const reversedArray = splitString.reverse();
	const reversedString = reversedArray.join('');
	return reversedString;
};

const insertRadical = () => {
	const inputString = inputDisplay.innerHTML;
	let reversedString = reverseString(inputString);
	let newString;
	if (reversedString.match(/\+|-|\*|\//)) {
		newString = reversedString.replace(/\+|-|\*|\//, '\u221a$&');
	} else {
		newString = reversedString + '\u221a';
	}
	const newStringStraight = reverseString(newString);
	inputDisplay.innerHTML = newStringStraight;
};

// Collect input data and calculate result
const addDigit = (digit) => {
	if ((currentNumber.includes('.') || currentNumber === '') && digit === '.') {
		return;
	}
	if (powered) {
		return;
	} // not letting user further append the number that has already been raised

	if (inputDisplay.innerHTML === '0' ||
			inputDisplay.innerHTML === 'ERROR') {
		inputDisplay.innerHTML = '';
	} // Remove default 0 and ERROR from display

	currentNumber += digit;
	inputDisplay.insertAdjacentHTML('beforeend', digit);
	console.log(currentNumber);
	console.log(currentInput);
};

const raiseToPower = (pow) => {
	const numToPow = parseFloat(currentNumber);
	if (numToPow < 0 && pow < 1) {
		currentNumber = '';
		clearInput();
		inputDisplay.innerHTML = 'ERROR';
		return; // In case user tries to extract a radical from negative number
	}
	const poweredNum = Math.pow(numToPow, pow);
	currentNumber = poweredNum.toString();
	powered = true;
};

const addOperator = (operator) => {
	if ((currentInput.length === 0 && currentNumber === '') ||
		inputDisplay.innerHTML === 'ERROR') {
		return;
	};

	if (operator === 'sqrt') {
		if (currentNumber === '' || currentNumber === '0') { return; }
		insertRadical();
		raiseToPower(0.5);
	} else if (operator === 'sqr') {
		if (currentNumber === '' || currentNumber === '0') { return; }
		raiseToPower(2);
		inputDisplay.insertAdjacentHTML('beforeend', '^2');
	} else {
		const lastIndex = currentInput.length - 1;
		if ((currentInput[lastIndex] === '+' ||
				currentInput[lastIndex] === '-' ||
				currentInput[lastIndex] === '*' ||
				currentInput[lastIndex] === '/') && currentNumber === '') {
			currentInput.pop();
			inputDisplay.innerHTML = inputDisplay.innerHTML.replace(/.$/g, '');
		}

		if (currentNumber !== '') {
			currentInput.push(currentNumber);
			currentNumber = '';
		}
		currentInput.push(operator);
		inputDisplay.insertAdjacentHTML('beforeend', operator);
		powered = false;
	}
	console.log(currentNumber);
	console.log(currentInput);
};

const performCalc = () => {
	if ((currentInput.length === 0 && currentNumber === '') ||
		inputDisplay.innerHTML === 'ERROR') {
		return;
	};

	if (currentNumber !== '') { currentInput.push(currentNumber); }

	const lastIndex = currentInput.length - 1;
	if (currentInput[lastIndex] === '+' ||
			currentInput[lastIndex] === '-' ||
			currentInput[lastIndex] === '*' ||
			currentInput[lastIndex] === '/') {
		currentInput.pop();
	}

	const stringToCalc = currentInput.join('');
	const calcResult = eval(stringToCalc);
// as we only have numerical expression as input, eval() shouldn't be harmful
	inputDisplay.innerHTML = calcResult;
	if (calcResult === Infinity || isNaN(calcResult)) {
		currentNumber = '';
		clearInput();
		inputDisplay.innerHTML = 'ERROR';
		return;
	}
	currentInput = [];
	currentNumber = calcResult.toString();
	powered = false;
};

// Event listeners
digitKeys.forEach(function (key) {
	key.addEventListener('click', addDigit.bind(this, key.value));
});

operatorKeys.forEach(function (key) {
	key.addEventListener('click', addOperator.bind(this, key.value));
});

clearKey.addEventListener('click', clearInput);
equalKey.addEventListener('click', performCalc);
changeSignKey.addEventListener('click', changeSign);
