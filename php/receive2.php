<?php

require("../vendor/autoload.php");

$config = ['settings' => [
    'displayErrorDetails' => true,
]];

$app = new \Slim\App($config);

$app->get('/', function ($request, $response, $args) {
    $response->write("Welcome to Slim!");
    return $response;
});

$app->get("/test", function($req, $resp) {
  return "Hello";
});

$app->run();
?>
