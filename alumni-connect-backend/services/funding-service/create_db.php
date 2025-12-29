<?php
try {
    $pdo = new PDO('pgsql:host=127.0.0.1;port=5432', 'postgres', 'root');
    $pdo->exec('CREATE DATABASE alumni_funding');
    echo "Database alumni_funding created successfully!\n";
} catch(PDOException $e) {
    if (strpos($e->getMessage(), 'already exists') !== false) {
        echo "Database alumni_funding already exists.\n";
    } else {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
