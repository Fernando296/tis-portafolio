<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Portafolio - TIS</title>
    <!-- Agregamos algo de CSS básico para que el footer siempre quede abajo -->
    <style>
        body {
            margin: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: #ffffff;
            color: #333333;
        }
        main {
            flex: 1; /* Esto empuja el footer hacia abajo */
            padding: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 2rem;
        }
    </style>
</head>
<body>
    <!-- Incluimos el componente del Header -->
    <x-header />
    
    <!-- Contenido principal de la página -->
    <main>
        {{ $slot }}
    </main>

    <!-- Incluimos el componente del Footer -->
    <x-footer />
</body>
</html>
