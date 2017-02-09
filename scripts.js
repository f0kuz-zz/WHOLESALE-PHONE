"use strict";
var MAX_TRANSACTION_PRICE = 550,
    TAX_AMMOUNT = 0.23,
    A5_PRICE = 299.99,
    Z3_PRICE = 349.99,
    REDMI2_PRICE = 159.99,
    S6_PRICE = 419.99,
    calcBtn = document.querySelector('.calc-btn'),
    btn1 = document.querySelector('#btn1'),
    // todo: Disabling buttons when conditions are false
    btn2 = document.querySelector('#btn2'),
    btn3 = document.querySelector('#btn3'),
    btn4 = document.querySelector('#btn4'),
    totalAmmount = document.querySelector('.total-ammount'),
    phones = document.querySelector('.phones'),
    quantity = document.querySelector('.quantity'),
    accessories = document.querySelector('.accessories'),
    phonesArr = document.querySelectorAll('[data-phone]'),
    info = document.querySelector('.info'),
    balance = document.querySelector('.balance'),
    max = document.querySelector('.max'),
    tax = document.querySelector('.tax'),
    spanBalance = document.createElement('span'),
    cart = [],
    grossPricePerAllPhones = [],
    estimatedGrossPricePerAllPhones = [],
    globalAccountBalance = null,
    globalQtyInputsCheck = null,
    qtyInputsArray = [],
    currInput = null;

var spanMax = document.createElement('span');
spanMax.textContent = MAX_TRANSACTION_PRICE + 'zł';
max.appendChild(spanMax);
var spanTax = document.createElement('span');
spanTax.textContent = (TAX_AMMOUNT * 100) + '%';
tax.appendChild(spanTax);

function calcTotalGrossPrice(totalNetPrice) {
    return (totalNetPrice + (totalNetPrice * TAX_AMMOUNT)).toFixed(2);
}

function showHide(container, btnHide, btnShow) {
    container.style.display = 'block';
    btnHide.style.display = 'none';
    btnShow.style.display = 'block';
}

function showAccountBalance() {
    var accountBalance = totalAmmount.querySelector('input').value;
    spanBalance.textContent = accountBalance + 'zł';
    spanBalance.style.cssText = 'color: #fff; font-size: 1.8rem';
    balance.appendChild(spanBalance);

    showHide(phones, btn1, btn2);

    globalAccountBalance = accountBalance;
}

function checkAccountBalance() {
    var qtyInputsCheck = document.querySelectorAll('.quantity input[type="text"]');

    globalQtyInputsCheck = qtyInputsCheck;

    Array.prototype.forEach.call(globalQtyInputsCheck, function (elem) {
        qtyInputsArray.push(elem);
    });

    //todo: add flashing calcBtn on keydown event
    var isEmpty = null,
        errorFieldId = [];

    qtyInputsCheck.forEach(function (elem) {
        if(elem.value === '') {
            isEmpty = true;
            errorFieldId.push(elem.className);
        }
    });

    for(var e = 0; e < errorFieldId.length; e++) {
        if(qtyInputsCheck[e].className == errorFieldId[e]) {
            qtyInputsCheck[e].className = 'error-field';
        }

    }




    if(isEmpty) {
        var emptyError = document.createElement('p');
        emptyError.textContent = 'Uzupełnij ilość sztuk';
        emptyError.classList.add('text-danger', 'error-p');
        info.appendChild(emptyError);
    } else {
        for(var i = 0; i < qtyInputsCheck.length; i++) {
            var qtyInputsId = qtyInputsCheck[i].className,
                qtyInputsQty = qtyInputsCheck[i].value;

            if(qtyInputsId == 'a5') {
                var grossPriceA5 = calcTotalGrossPrice(A5_PRICE),
                    totalGrossA5 = grossPriceA5 * qtyInputsQty;
                estimatedGrossPricePerAllPhones.push(totalGrossA5);
            } else if(qtyInputsId == 'z3') {
                var grossPriceZ3 = calcTotalGrossPrice(Z3_PRICE),
                    totalGrossZ3 = grossPriceZ3 * qtyInputsQty;
                estimatedGrossPricePerAllPhones.push(totalGrossZ3);
            } else if(qtyInputsId == 'redmi2') {
                var grossPriceRedmi2 = calcTotalGrossPrice(REDMI2_PRICE),
                    totalGrossRedmi2 = grossPriceRedmi2 * qtyInputsQty;
                estimatedGrossPricePerAllPhones.push(totalGrossRedmi2);
            } else if(qtyInputsId == 's6') {
                var grossPriceS6 = calcTotalGrossPrice(S6_PRICE),
                    totalGrossS6 = grossPriceS6 * qtyInputsQty;
                estimatedGrossPricePerAllPhones.push(totalGrossS6);
            }
        }

        var estimatedResult = estimatedGrossPricePerAllPhones.reduce(function (prevVal, currVal) {
            return prevVal + currVal
        });

        spanBalance.textContent = (globalAccountBalance - estimatedResult).toFixed(2) + 'zł';
    }

}

function addToCart(product) {
    cart.push(product);
}

function handlePhone() {
    for(var i = 0; i < phonesArr.length; i++) {
        if(phonesArr[i].checked == true) {
            addToCart(phonesArr[i]);
        }
    }
}

function handleQuantity() {
    for(var i = 0; i < cart.length; i++) {
        var typeField = document.createElement('label'),
            quantityField = document.createElement('input');

        typeField.setAttribute('for', cart[i].className);
        quantityField.setAttribute('type', 'text');
        quantityField.setAttribute('class', cart[i].className);
        typeField.textContent = cart[i].value + ': ';

        quantity.appendChild(typeField);
        quantity.appendChild(quantityField);

        // Why this method is so primitive and don't retrieve more complicated variables? like "typeField" for example
        // quantity.innerHTML += "<div class=\"row\"><div class=\"col-lg-4 type-phone\">"+typeField+"</div><div class=\"col-lg-4 quantity-phone\">"+quantityField+"</div></div>"
    }
}

function addCalcBtn() {
    calcBtn.style.display = 'block';
}

function handlePhoneAndQuantity() {
    handlePhone();
    handleQuantity();
    addCalcBtn();

    showHide(quantity, btn2, btn3);
}

function defineProperties(phone, name, net, qty) {
    Object.defineProperties(phone, {
        model: {
            value: name,
            configurable: true,
            enumerable: true,
            writable: true
        },
        netPrice: {
            value: net + 'zł',
            configurable: true,
            enumerable: true,
            writable: true
        },
        quantity: {
            value: qty,
            configurable: true,
            enumerable: true,
            writable: true
        }
    })
}

function colectPhonesInBag() {
    var qtyInputs = document.querySelectorAll('.quantity input[type="text"]'),
        bag = {};

    for(var j = 0; j < qtyInputs.length; j++) {
        bag[j] = {};
    }

    for(var i = 0; i < qtyInputs.length; i++) {
        var qtyInputsId = qtyInputs[i].className,
            qtyInputsQty = qtyInputs[i].value;

        if(qtyInputsId == 'a5') {
            var grossPriceA5 = calcTotalGrossPrice(A5_PRICE),
                totalGrossA5 = grossPriceA5 * qtyInputsQty;
            grossPricePerAllPhones.push(totalGrossA5);
            defineProperties(bag[i], cart[i].value, A5_PRICE, qtyInputsQty);
        } else if(qtyInputsId == 'z3') {
            var grossPriceZ3 = calcTotalGrossPrice(Z3_PRICE),
                totalGrossZ3 = grossPriceZ3 * qtyInputsQty;
            grossPricePerAllPhones.push(totalGrossZ3);
            defineProperties(bag[i], cart[i].value, Z3_PRICE, qtyInputsQty);
        } else if(qtyInputsId == 'redmi2') {
            var grossPriceRedmi2 = calcTotalGrossPrice(REDMI2_PRICE),
                totalGrossRedmi2 = grossPriceRedmi2 * qtyInputsQty;
            grossPricePerAllPhones.push(totalGrossRedmi2);
            defineProperties(bag[i], cart[i].value, REDMI2_PRICE, qtyInputsQty);
        } else if(qtyInputsId == 's6') {
            var grossPriceS6 = calcTotalGrossPrice(S6_PRICE),
                totalGrossS6 = grossPriceS6 * qtyInputsQty;
            grossPricePerAllPhones.push(totalGrossS6);
            defineProperties(bag[i], cart[i].value, S6_PRICE, qtyInputsQty);
        }
    }

    showHide(accessories, btn3, btn4);
}

// if(qtyInputsArray.length > 0) {
//     for(var k = 0; k < qtyInputsArray.length; k++) {
//         var currInput = qtyInputsArray[k];
//         currInput.addEventListener('blur', function (e) {
//             console.log(e.target);
//             if(e.target.value !== '') {
//                 e.target.classList.remove('error-field');
//             }
//         }, false)
//     }
// }


btn1.addEventListener('click', showAccountBalance, false);
btn2.addEventListener('click', handlePhoneAndQuantity, false);
btn3.addEventListener('click', colectPhonesInBag, false);
calcBtn.addEventListener('click', checkAccountBalance, false);




// SCRATCH

// var myCart = {
//     0: {
//         model: 'Samsung A5',
//         netPrice: n
//         quantity: 5,
//         charger: 5,
//         scriber: 2,
//         totalNetPrice: n,
//         totalGrossPrice: n
//     },
//
//     1: {
//         model: 'iPhone S6',
//         quantity: 5,
//         charger: 1,
//         scriber: 0
//     }
// };

