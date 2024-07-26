<?php
include 'includes/_config.php';
/**
 * Generate a unique token and add it to the user session. 
 *
 * @return void
 */
function generateToken(): void
{
    if (
        !isset($_SESSION['token'])
        || !isset($_SESSION['tokenExpire'])
        || $_SESSION['tokenExpire'] < time()
    ) {
        $_SESSION['token'] = md5(uniqid(mt_rand(), true));
        $_SESSION['tokenExpire'] = time() + 60 * 15;
    }
}

/**
 * Check for CSRF token
 *
 * @param string $token token
 * @return boolean Is there a valid token in user session ?
 */
function isTokenOk(string $token): bool
{
    return isset($_SESSION['token'])
        && isset($token)
        && $_SESSION['token'] === $token;
}


/**
 * Check fo referer
 *
 * @return boolean Is the current referer valid ?
 */
function isServerOk(): bool
{
    global $globalUrl;
    return isset($_SERVER['HTTP_REFERER'])
        && str_contains($_SERVER['HTTP_REFERER'], $globalUrl);
}

/**
 * Print an error in json format and stop script.
 *
 * @param string $error Error code from errors array available in _congig.php
 * @return void
 */
function triggerError(string $error, string $flag = ''): void
{
    global $errors;

    echo json_encode([
        'isOk' => false,
        'errorMessage' => $errors[$error],
        'flag' => $flag
    ]);

    exit;
}

/**
 * Removes tags from given array values;.
 *
 * @param array $data - input values
 */
function stripTagsArray(array &$data): void
{
    $data = array_map('strip_tags', $data);
}



/**
 * Gets Transactions by Date
 * @param PDO $dbCo db connection
 * @param string $dateMy ex'mm-yy'
 * @return void
 */
function getTransactionsByDate(PDO $dbCo, $dateMy)
{
    $query = $dbCo->prepare("SELECT * FROM `transaction` join `category` USING(id_category) WHERE
     DATE_FORMAT(date_transaction, '%Y-%m') =:dateMy
      ORDER BY `date_transaction` DESC");
    $isQueryOk = $query->execute([
        "dateMy" => $dateMy
    ]);

    $AllTransactions = $query->fetchAll();
    if (!$isQueryOk) {
        triggerError("connection");
    }
    echo json_encode([
        'isOk' => $isQueryOk,
        "token" => $_SESSION['token'],
        $AllTransactions
    ]);
}


/**
 * Gets all Transactions order by date desc.
 * @param PDO $dbCo db connection.
 * @return void
 */
function getAllTransactions(PDO $dbCo):void
{
    $query = $dbCo->prepare("SELECT * FROM `transaction` ORDER BY `transaction`.`date_transaction` DESC");
    $isQueryOk = $query->execute();

    $AllTransactions = $query->fetchAll();
    if (!$isQueryOk) {
        triggerError("connection");
    }
    echo json_encode([
        'isOk' => $isQueryOk,
        "token" => $_SESSION['token'],
        $AllTransactions
    ]);
}


function getSumMoney(PDO $dbCo){
    $query = $dbCo->prepare("SELECT SUM(amount) FROM `transaction`;");
    $isQueryOk = $query->execute();

    $sumMoney = $query->fetchColumn();
    if (!$isQueryOk) {
        triggerError("connection");
    }
    echo json_encode([
        'isOk' => $isQueryOk,
        "token" => $_SESSION['token'],
        "sumMoney" =>$sumMoney
    ]);
}