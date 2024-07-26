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




function getAllTransactionsByDate(PDO $dbCo){
    $query = $dbCo->prepare("SELECT * FROM `transaction` ORDER BY `transaction`.`date_transaction` ASC");
    $isQueryOk = $query->execute();

    $AllTransactions = $query->fetchAll();
    if (!$isQueryOk) {
        triggerError("connection");
    }
    echo json_encode([
        $AllTransactions 
    ]);
}