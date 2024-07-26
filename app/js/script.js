import * as F from './_functions.js';

let dataTest = { "id_transaction": 1, "name": "Bar", "amount": "-21.00", "date_transaction": "2023-06-10", "id_category": 7 }

console.log(dataTest['name'])
addEventListener("load", (event) => {
    document.getElementById('allTransactions').innerHTML = "yyyyyyyyyyyyyyyes"
    console.log("hello");

    F.getTransactions();
});