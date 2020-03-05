<?php

    header('Access-Control-Allow-Origin: *');

    $uploadDir = './uploads/';
    $uploadFile = $uploadDir . basename($_FILES['userfile']['name']);
    if (move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadFile)) {
        echo '{"codigo": 501, "mensagem": "Sucesso!"}';
    } else {
        echo '{"erro": "Possível ataque de upload de arquivo"}';
    }
?>