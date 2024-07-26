
//api functions
/**
 * Get current global token value.
 * @returns 
 */
export function getToken() {
    return document.getElementById('token').dataset.token;
}


/**
 * Generate asynchronous call to api.php with parameters
 * @param {string} method GET, POST, PUT or DELETE
 * @param {object} params An object with data to send.
 * @returns 
 */
export async function callApi(method, param) {
    try {
        const response = await fetch("api.php",
            {
                method: method,
                body: JSON.stringify(param),
                headers: {
                    'Content-type': 'application/json'
                }
            });
        return await response.json();



    }
    catch (error) {
        console.error("Unable to load data from server : " + error);
        displayError("Unable to load data from server : " + error);
    }

}



/**
 * Display error message with template
 * @param {string} errorMessage 
 */
export function displayError(errorMessage) {
    const li = document.importNode(document.getElementById('templateError').content, true);
    const m = li.querySelector('[data-error-message]');
    m.innerText = errorMessage;
    document.getElementById('errorsList').appendChild(li);
    setTimeout(() => m.remove(), 2000);
}

/**
 * Display message with template
 * @param {string} message 
 */
export function displayMessage(message) {
    const li = document.importNode(document.getElementById('templateMessage').content, true);
    const m = li.querySelector('[data-message]')
    m.innerText = message;
    document.getElementById('messagesList').appendChild(li);
    setTimeout(() => m.remove(), 2000);
}





/**
 *
 *display one element transaction.
 * @param {object} transaction
 * @return {void}
 */
export function displayTransaction(transaction) {
    const clone = document.importNode(document.getElementById('transactionTemplate').content, true);
    const time = clone.getElementById('transactionTime');
    const amount = clone.getElementById('transactionAmount');
    clone.getElementById('transactionName').innerText = transaction['name'];
    time.setAttribute("datetime", transaction['date_transaction']);
    time.textContent = transaction['date_transaction'].replace(/-/g, "/");
    amount.innerText = transaction['amount'];
    clone.getElementById("categoryIcon").classList.add(`bi-${transaction['icon_class']}`)
    if (parseInt(transaction['amount']) > 0) {
        amount.classList.add(`bg-success-subtle`);
    }
    else {
        amount.classList.add(`bg-warning-subtle`);

    }

    clone.getElementById('transactionName').appendChild(time)
    document.getElementById('allTransactions').appendChild(clone);

}



/**
 *
 *send request to api to get transactions data.or return
 * @return {void} 
 */
export function getTransactions() {
    callApi("POST", {
        action: "getTransaction",
        token: getToken()

    }).then(data => {
        if (!data.isOk || !data[token] === getToken()) {
            displayError(data['errorMessage']);
            return;
        }

        data[0].forEach(transaction => {

            displayTransaction(transaction);
        });


    });


}




/**
 *
 *send request to api to get sum money data.or return
 * @return {void} 
 */
export function getSumMoney() {
    callApi("POST", {
        action: "getSumMoney",
        token: getToken()

    }).then(data => {
        if (!data.isOk || !data[token] === getToken()) {
            displayError(data['errorMessage']);
            return;
        }
        document.getElementById('sumMoney').innerHTML = data["sumMoney"];
    });


}


/**
 *
 *send request to api to get get categories data.or return
 * @return {void} 
 */
export function getCategories() {

    callApi("POST", {
        action: "getCategories",
        token: getToken()

    }).then(data => {
        if (!data.isOk || !data[token] === getToken()) {
            displayError(data['errorMessage']);
            return;
        }
        data["categories"].forEach(Category => {

            displayCategory(Category);
        });

        console.log(data);
    });

}


/**
 * Display Category(Category) with template
 * @param {object} Category 
 */
export function displayCategory(Category) {
    const template = document.importNode(document.getElementById('categoriesTemplate').content, true);
    const CategoryT = template.querySelector('.js-category')
    CategoryT.innerText = Category['category_name'];
    CategoryT.value = Category['id_category'];
    document.getElementById('category').appendChild(CategoryT);

}



/**
 * is a valide name input field? shows an error message.
 * @param {string} name The name of the field being validated.
 * @param {string} value The input value.
 * @returns {boolean} false if not and true if it is valide.
 */
function isValidateName(name, value) {
    const namePattern = new RegExp(/^[a-zA-Z0-9_.-]*$/);

    if (!value) {
        displayErrorForm(`Le ${name} est obligatoire.`);
        return false;
    }

    if (!namePattern.test(value)) {
        displayError(`Le ${name} invalide.`);
        return false;
    }
    return true;

}

/**
 *
 * is a Valide date? and show the error if not.
 * @param {string} dateInput date input(date).
 * @return {boolean} false if not and true if it is valide.
 */
function isValideDate(dateInput) {

    let birthDay = new Date(dateInput);
    if (isNaN(birthDay)) {
        displayError(`Le date invalide.`);
        return false;
    };
    return true;
}

/**
 * is valide amount ?  show the error if not.
 * @param {string} amount input amount
 * @returns {boolean} false if not and true if it is valide.
 */
function isValideAmount(amount) {
    const regextel = new RegExp(/[0-9]/gi);

    if (!regextel.test(amount)) {
        displayError(`Le amount est invalide.`);
        return false;
    }
    return true;

}

/**
 * is valide amount ?  show the error if not.
 * @param {string} tel input amount
 * @returns {boolean} false if not and true if it is valide.
 */
function isValideCategoryId(id) {
    if (!id < 0 || !id > 10) {
        displayError(`Le amount est invalide.`);
        return false;
    }
    return true;

}


export function insertOperation(e) {
    e.preventDefault();
    if (!isValidateName(document.getElementById("nameOperation").value)) return;
    if (!isValideDate(document.getElementById("dateOperation").value)) return;
    if (!isValideAmount(document.getElementById("amountOperation").value)) return;
    if (!isValideAmount(e.target.value)) return;
    if (!isValideCategoryId(e.target.value)) return;

    callApi("POST", {
        action: "insertOperation",
        token: getToken(),
        nameOperation: document.getElementById("nameOperation").value,
        dateOperation: document.getElementById("dateOperation").value,
        amountOperation:document.getElementById("amountOperation").value,
        categoryId:document.getElementById("amountOperation").value,


    }).then(data => {
        if (!data.isOk || !data[token] === getToken()) {
            displayError(data['errorMessage']);
            return;
        }
        data["categories"].forEach(Category => {

            displayCategory(Category);
        });

        console.log(data);
    });

}

function handleSubmit(e) {

   
   

}
