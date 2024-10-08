import express from 'express';
import cors from 'cors';
import config from './config';
import * as mongoose from 'mongoose';
import usersRouter from "./routers/users";
import expressWs from 'express-ws';
import { WebSocket } from 'ws';

const app = express();
expressWs(app);
app.use(cors());
const port = 8000;
app.use(express.json());

app.use(cors(config.corsOptions));
app.use(express.json());
app.use(express.static('public'));
app.use('/users', usersRouter);

const router = express.Router();

const connectedClients: { ws: WebSocket; username: string }[] = [];

router.ws('/chatWs', (ws, req) => {
  console.log('client connected, total clients: ', connectedClients.length);


  ws.on('close', () => {
    console.log('client disconnected');
    const index = connectedClients.findIndex(client => client.ws === ws);
    if (index !== -1) {
      connectedClients.splice(index, 1);
    }
  });

});

app.use(router);

const run = async () => {
  await mongoose.connect(config.database);

  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);