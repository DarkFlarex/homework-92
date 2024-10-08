import express from 'express';
import cors from 'cors';
import config from './config';
import * as mongoose from 'mongoose';
import usersRouter from "./routers/users";
import expressWs from 'express-ws';
import { WebSocket } from 'ws';
import User from "./models/User";
import Message from "./models/Message";

interface IncomingMessage {
  type: string;
  payload: string;
}

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
  let username: string;

  ws.on('message', async (message) => {
    try {
      const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;

      if (decodedMessage.type === 'LOGIN') {
        const token = decodedMessage.payload;
        const user = await User.findOne({ token });

        if (!user) {
          ws.send(JSON.stringify({ type: 'ERROR', payload: 'Wrong token!' }));
          ws.close();
          return;
        }
        username = user.displayName;
        connectedClients.push({ ws, username });
        onlineUser();

        const messages = await Message.find().sort({ datetime: -1 }).limit(30);
        messages.reverse();
        ws.send(JSON.stringify({ type: 'LOAD_MESSAGES', payload: messages.reverse() }));
      }

      if (decodedMessage.type === 'SEND_MESSAGE') {
        const newMessage = new Message({
          username: username,
          message: decodedMessage.payload,
          datetime: new Date().toISOString(),
        });
        await newMessage.save();

        connectedClients.forEach((client) => {
          client.ws.send(JSON.stringify({
            type: 'NEW_MESSAGE',
            payload: {
              username,
              message: decodedMessage.payload,
              datetime: newMessage.datetime,
            },
          }));
        });
      }
    } catch (e) {
      ws.send(JSON.stringify({ type: 'ERROR', payload: 'Invalid message' }));
    }
  });

  ws.on('close', () => {
    console.log('client disconnected');
    const index = connectedClients.findIndex(client => client.ws === ws);
    if (index !== -1) {
      connectedClients.splice(index, 1);
      onlineUser();
    }
  });

  const onlineUser = () => {
    const users = connectedClients.map(client => client.username);
    connectedClients.forEach((client) => {
      client.ws.send(JSON.stringify({
        type: 'UPDATE_USERS',
        payload: users,
      }));
    });
  };
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