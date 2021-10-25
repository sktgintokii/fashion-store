import http from 'http';
import env from './env';
import app from './app';
import logger from './services/logger';

const { port } = env;

app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
  logger.info(
    `Server is running at http://localhost:${env.port} as ${env.nodeEnv}...`,
  );
});
