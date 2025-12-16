export const environment = {
  production: true,

  // CAMBIO 1: El HOST ya no es localhost.
  // Es tu dominio público + el prefijo '/api' que configuramos en Traefik.
  // Nota: No pongas slash al final aquí para evitar dobles slash (//) al concatenar.
  HOST: 'https://onedoy.bcscode.com',

  // CAMBIO 2: Los nombres de los microservicios.
  // Deben coincidir EXACTAMENTE con lo que definiste en el application.properties de Zuul
  // (zuul.routes.backend.path=/api/backend/**)
  MICRO_CRUD: 'backend',   // Antes tenías 'micro-crud', cámbialo a 'backend'
  MICRO_AUTH: 'security',  // Antes tenías 'uaa', cámbialo a 'security'

  // Lo demás suele mantenerse igual si no has cambiado la configuración interna de OAuth2
  MICRO_CR: 'micro-cr', // (Valida si tienes una ruta en Zuul para esto, si no, ajústalo)
  TOKEN_AUTH_USERNAME: 'sisventasapp',
  TOKEN_AUTH_PASSWORD: 'sisventasapp2021codex',
  TOKEN_NAME: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  REINTENTOS: 0,
  GRANT_TYPE_PASSWORD: 'password',
  GRANT_TYPE_REFRESH_TOKEN: 'refresh_token',
};