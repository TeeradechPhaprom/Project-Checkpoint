<?php
require 'storage.php';


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    sendJson(readPortfolios());
}

$name = trim($_POST['displayName'] ?? '');

if ($name === '') {
    sendJson(['error' => 'Display name is required'], 400);
}

$portfolio = [
    'id'                 => uniqid('p'),
    'displayName'        => $name,
    'whatIEnjoy'         => trim($_POST['whatIEnjoy'] ?? ''),
    'whatIveTried'       => trim($_POST['whatIveTried'] ?? ''),
    'whatImCuriousAbout' => trim($_POST['whatImCuriousAbout'] ?? ''),
    'items'              => [],
];

$portfolios = readPortfolios();
$portfolios[] = $portfolio;
writePortfolios($portfolios);

sendJson($portfolio, 201);
