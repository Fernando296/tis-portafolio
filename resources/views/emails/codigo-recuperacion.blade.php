<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Código de Recuperación de Contraseña</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6865CD; text-align: center;">Recuperación de Contraseña</h2>
        <p style="font-size: 16px; color: #333333;">Hola,</p>
        <p style="font-size: 16px; color: #333333;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Tu código de verificación es:</p>
        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 24px; font-weight: bold; background-color: #59BEC0; color: #ffffff; padding: 10px 20px; border-radius: 5px; letter-spacing: 5px;">
                {{ $code }}
            </span>
        </div>
        <p style="font-size: 16px; color: #333333;">Escribe este código en la aplicación para poder cambiar tu contraseña.</p>
        <p style="font-size: 14px; color: #777777; margin-top: 30px;">Si no has solicitado restablecer tu contraseña, puedes ignorar este correo; tu cuenta está a salvo.</p>
    </div>
</body>
</html>
