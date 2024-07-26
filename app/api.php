<?php
session_start();

require_once 'includes/_connection.php';
require_once 'includes/_functions.php';


header('Content-type:application/json');
//prenvent visteurs acess to this page
if (!isServerOk()) {
    triggerError('referer');
}
$inputData = json_decode(file_get_contents('php://input'), true);
if (!is_array($inputData)) {
    $inputData = $_REQUEST;
}
stripTagsArray($inputData);
if (!isTokenOk($inputData['token'])) {
    triggerError('token');
}


if ($_SERVER['REQUEST_METHOD'] === 'POST' && $inputData['action'] === 'getTransaction') {
    //this month and year
    $dateMY = date("Y-m");
    getTransactionsByDate($dbCo, $dateMY);

}

//sum money
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $inputData['action'] === 'getSumMoney') {
    getSumMoney($dbCo);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $inputData['action'] === 'getCategories') {
    getCategories($dbCo);
}


if ($_SERVER['REQUEST_METHOD'] === 'POST' && $inputData['action'] === 'insertOperation') {
    
}
