<?php
$uploaddir = dirname(__FILE__) . '/';
$uploadfile = $uploaddir . basename($_FILES['swingOutFile']['name']);

echo '<pre>';
if (move_uploaded_file($_FILES['swingOutFile']['tmp_name'], $uploadfile)) {
	echo "Le fichier est valide, et a été téléchargé
	avec succès. Voici plus d'informations :\n";
} else {
	echo "Attaque potentielle par téléchargement de fichiers.
	Voici plus d'informations :\n";
}

echo 'Voici quelques informations de débogage :';
echo htmlentities(print_r($_FILES, true));


echo '</pre>';