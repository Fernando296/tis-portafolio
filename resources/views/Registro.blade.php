
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Registro</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/pages/Registro/RegistroCuentaPage.tsx'])
</head>
<body class="bg-[#ededed]">
    <div id="app"></div>
</body>
</html>