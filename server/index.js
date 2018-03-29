import http from 'http';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();
const server = http.createServer(app);

const port = process.env.PORT || 7777;
app.set('port', port);

server.listen(port);

export default app;
