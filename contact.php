<?php
/**
 * Handler form contatti — Studio Medico Dentistico Dott. Guido Bellia
 * Invia le richieste a infostudiobellia@gmail.com
 */

header('Content-Type: application/json; charset=utf-8');

$DEST = 'infostudiobellia@gmail.com';
$BCC  = 'fabioferrero1987@gmail.com';

function out($ok, $msg, $code = 200) {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'message' => $msg]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    out(false, 'Metodo non consentito.', 405);
}

// Honeypot anti-spam: se compilato, scarta silenziosamente.
if (!empty($_POST['website'])) {
    out(true, 'Grazie!');
}

$nominativo = trim($_POST['nominativo'] ?? '');
$telefono   = trim($_POST['telefono'] ?? '');
$email      = trim($_POST['email'] ?? '');
$messaggio  = trim($_POST['messaggio'] ?? '');
$privacy    = isset($_POST['privacy']);

if ($nominativo === '' || $email === '' || $messaggio === '') {
    out(false, 'Compila tutti i campi obbligatori.', 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    out(false, 'Indirizzo email non valido.', 422);
}
if (!$privacy) {
    out(false, 'Devi accettare l\'informativa sulla privacy.', 422);
}

$subject = 'Nuova richiesta dal sito - ' . $nominativo;

$body  = "Nuova richiesta di contatto dal sito web\n";
$body .= "----------------------------------------\n\n";
$body .= "Nominativo: $nominativo\n";
$body .= "Telefono:   " . ($telefono !== '' ? $telefono : '-') . "\n";
$body .= "Email:      $email\n\n";
$body .= "Messaggio:\n$messaggio\n";

// Encoding sicuro del nome nell'header From
$fromName = '=?UTF-8?B?' . base64_encode('Sito Studio Bellia') . '?=';
$domain   = preg_replace('/^www\./', '', $_SERVER['SERVER_NAME'] ?? 'localhost');
$headers  = "From: $fromName <no-reply@$domain>\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Bcc: $BCC\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

if (@mail($DEST, $encodedSubject, $body, $headers)) {
    out(true, 'Grazie! La tua richiesta è stata inviata. Ti ricontatteremo al più presto.');
} else {
    out(false, 'Si è verificato un errore nell\'invio. Riprova o chiamaci al 015 8353371.', 500);
}
