<?php
require 'storage.php';


$title = trim($_POST['title'] ?? '');

if ($title === '') {
    sendJson(['error' => 'Title is required'], 400);
}


// ถ้ามีการส่ง id มา (ตอน Import) ให้ใช้ id เดิม จะได้ตรวจ Item ซ้ำได้ ถ้าไม่มีค่อยสร้างใหม่
$id = trim($_POST['id'] ?? '');
if ($id === '') {
    $id = uniqid('item');
}

// evidence ส่งมาเป็น array (evidence[]) หรือข้อความเดียวก็ได้
$evidenceInput = $_POST['evidence'] ?? [];
if (!is_array($evidenceInput)) {
    $evidenceInput = [$evidenceInput];
}
$evidence = [];
foreach ($evidenceInput as $e) {
    if (trim($e) !== '') {
        $evidence[] = trim($e);
    }
}

$item = [
    'id'          => $id,
    'title'       => $title,
    'type'        => trim($_POST['type'] ?? ''),
    'date'        => trim($_POST['date'] ?? ''),
    'role'        => trim($_POST['role'] ?? ''),
    'description' => trim($_POST['description'] ?? ''),
    'skills'      => array_map('trim', explode(',', $_POST['skills'] ?? '')),
    'reflection'  => [
        'whatIDid'     => trim($_POST['whatIDid'] ?? ''),
        'whatILearned' => trim($_POST['whatILearned'] ?? ''),
        'challenge'    => trim($_POST['challenge'] ?? ''),
        'nextStep'     => trim($_POST['nextStep'] ?? ''),
    ],
    'evidence'    => $evidence,
];

$portfolios = readPortfolios();

foreach ($portfolios as $i => $portfolio) {
    if ($portfolio['id'] === ($_POST['portfolioId'] ?? '')) {
        foreach (($portfolio['items'] ?? []) as $existing) {
            if (($existing['id'] ?? null) === $item['id']) {
                sendJson(['error' => 'This item is already in the portfolio'], 409);
            }
        }
        $portfolios[$i]['items'][] = $item;
        writePortfolios($portfolios);
        sendJson($item, 201);
    }
}

sendJson(['error' => 'Portfolio not found'], 404);
