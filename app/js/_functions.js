
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
    clone.getElementById('transactionName').innerText = transaction['name'];
    time.setAttribute("datetime", transaction['date_transaction']);
    time.textContent = transaction['date_transaction'].replace(/-/g, "/");
    clone.getElementById('transactionAmount').innerText = transaction['amount'];
    console.log(time);
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
        if (!data.isOk ||! data[token]===getToken()) {
            displayError(data['errorMessage']);
            return;
        }
        console.log("ok");
        console.log(data);
      
        data[0].forEach(transaction => {

            displayTransaction(transaction);
        });


    });


}