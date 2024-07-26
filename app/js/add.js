
import * as F from './_functions.js';

addEventListener("load", (event) => {
console.log("ok");
F.getCategories();
});

document.getElementById("reservation-form").addEventListener("submit", 
    F.insertOperation(e))

