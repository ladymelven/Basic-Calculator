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
	const lastItem = currentInput[currentInput.length - 1];
	if (currentNumber === '0' || currentNumber === '' ||
			inputDisplay.innerHTML === 'ERROR' || inputDisplay.innerHTML === '0') {
		return;
	}
	if (currentNumber.includes('-')) {
		currentNumber = currentNumber.replace('-', '');
	} else if (lastItem === '-') {
		currentInput.pop();
		currentInput.push('+');
	} else {
		currentNumber = '-' + currentNumber;
	}

	// Update UI
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
	if (currentNumber.includes('.') && digit === '.') {
		return;
	}
	if (powered) {
		return;
	} // not letting user further append the number that has already been raised

	if ((inputDisplay.innerHTML === '0' && digit !== '.') ||
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

const calculate = (input) => {
	let oldArray = input;
	let newArray = [];
	// Calculate multiplications and divisions first
	while (oldArray.includes('*') || oldArray.includes('/')) {
		let indexToCalc = oldArray.findIndex(element => element === '*' || element === '/');
		for (let i = 0; i < (indexToCalc - 1); i++) {
			newArray.push(oldArray[i]);
		}
		let newItem;
		if (oldArray[indexToCalc] === '*') {
			newItem = oldArray[indexToCalc - 1] * oldArray[indexToCalc + 1];
		} else if (oldArray[indexToCalc] === '/') {
			newItem = oldArray[indexToCalc - 1] / oldArray[indexToCalc + 1];
		}
		newArray.push(newItem);
		for (let i = indexToCalc + 2; i < oldArray.length; i++) {
			newArray.push(oldArray[i]);
		}
		oldArray = newArray;
		newArray = [];
	}
	// Then do additions and subtractions
	while (oldArray.includes('+') || oldArray.includes('-')) {
		let indexToCalc = oldArray.findIndex(element => element === '+' || element === '-');
		for (let i = 0; i < (indexToCalc - 1); i++) {
			newArray.push(oldArray[i]);
		}
		let newItem;
		if (oldArray[indexToCalc] === '+') {
			newItem = parseFloat(oldArray[indexToCalc - 1]) +
			parseFloat(oldArray[indexToCalc + 1]);
		} else if (oldArray[indexToCalc] === '-') {
			newItem = parseFloat(oldArray[indexToCalc - 1]) -
			parseFloat(oldArray[indexToCalc + 1]);
		}
		newArray.push(newItem);
		for (let i = indexToCalc + 2; i < oldArray.length; i++) {
			newArray.push(oldArray[i]);
		}
		oldArray = newArray;
		newArray = [];
	}
	const result = oldArray[0];
	console.log(result);
	return result;
};

// Actually calculating output
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
	} // If the last input element is an operator, pop it out

	let calcResult = calculate(currentInput);
// as we only have numerical expression as input, eval() shouldn't be harmful
	calcResult = (Math.round(calcResult * Math.pow(10, 12))) /
	Math.pow(10, 12); // Round down to 12 decimals at max
	inputDisplay.innerHTML = calcResult;
	console.log('result is ' + calcResult);
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
