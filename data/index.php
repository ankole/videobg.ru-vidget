<?php

$directory = '/var/www/u1652415/data/www/videobg.ru/vidget/dist/assets/';

// Ищем первый JS-файл в директории
$jsFile = findNewestJsFile($directory);

if ($jsFile) {
    header('Content-Type: application/javascript');
    readfile($jsFile);
    exit;
}

header('HTTP/1.1 404 Not Found');
header('Content-Type: application/javascript');
echo '// No JavaScript files found in directory';

function findNewestJsFile($dir) {
  $jsFiles = glob($dir . '*.js');
  if (empty($jsFiles)) {
      return false;
  }

  usort($jsFiles, function($a, $b) {
      return filemtime($b) - filemtime($a);
  });
  
  return $jsFiles[0];
}

// <script src="https://videobg.ru/vidget/data/" async></script>