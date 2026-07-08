<?php
/**
 * salvar-pedido.php
 * Recebe o formulário de contacto do index.html e grava cada pedido
 * como um ficheiro JSON dentro da pasta /pedidos.
 *
 * Requer um servidor com PHP (XAMPP local, ou qualquer hosting com PHP).
 * A pasta /pedidos é criada automaticamente na primeira submissão.
 */

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['sucesso' => false, 'erro' => 'Método não permitido.']);
    exit;
}

// Honeypot: campo invisível que só um robô preenche.
// Se vier preenchido, fingimos sucesso mas não gravamos nada.
if (!empty($_POST['site_web'])) {
    echo json_encode(['sucesso' => true]);
    exit;
}

function limpar($valor) {
    return trim(strip_tags((string) $valor));
}

$nome      = limpar($_POST['nome'] ?? '');
$email     = limpar($_POST['email'] ?? '');
$telefone  = limpar($_POST['telefone'] ?? '');
$interesse = limpar($_POST['interesse'] ?? '');
$mensagem  = limpar($_POST['mensagem'] ?? '');

if ($nome === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['sucesso' => false, 'erro' => 'Preencha o nome e um email válido.']);
    exit;
}

$pastaPedidos = __DIR__ . '/pedidos';
if (!is_dir($pastaPedidos)) {
    if (!mkdir($pastaPedidos, 0755, true) && !is_dir($pastaPedidos)) {
        http_response_code(500);
        echo json_encode(['sucesso' => false, 'erro' => 'Não foi possível preparar o armazenamento.']);
        exit;
    }
    // Protege a pasta de acesso público directo.
    file_put_contents($pastaPedidos . '/.htaccess', "Require all denied\nDeny from all\n");
}

$registo = [
    'data'      => date('Y-m-d H:i:s'),
    'nome'      => $nome,
    'email'     => $email,
    'telefone'  => $telefone,
    'interesse' => $interesse,
    'mensagem'  => $mensagem,
    'origem_ip' => $_SERVER['REMOTE_ADDR'] ?? '',
];

$nomeFicheiro = 'pedido_' . date('Ymd_His') . '_' . substr(bin2hex(random_bytes(3)), 0, 6) . '.json';
$caminhoFicheiro = $pastaPedidos . '/' . $nomeFicheiro;

$gravado = file_put_contents(
    $caminhoFicheiro,
    json_encode($registo, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);

if ($gravado === false) {
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'erro' => 'Não foi possível guardar o pedido. Tente novamente.']);
    exit;
}

echo json_encode(['sucesso' => true]);
