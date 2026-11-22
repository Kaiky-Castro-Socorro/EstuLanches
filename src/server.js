const pool = require('./db');
const { createApp } = require('./app');

const port = process.env.PORT || 3000;
const server = createApp(pool).listen(port, () =>
  console.log(`[EstuLanches] API no ar na porta ${port}`)
);

// Encerramento limpo (docker stop envia SIGTERM)
process.on('SIGTERM', () => {
  console.log('[EstuLanches] encerrando...');
  server.close(() => pool.end().then(() => process.exit(0)));
});
