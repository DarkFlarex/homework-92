import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import { Box, Button, Grid, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import {Chat} from "../../types";
import dayjs from 'dayjs';

const Messages = () => {
    const [messages, setMessages] = useState<Chat[]>([]);
    const [messageText, setMessageText] = useState('');
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const user = useAppSelector(selectUser);

    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/chatWs');

        ws.current.onclose = () =>
            console.log('WS disconnected!');

        ws.current.onopen = () => {
            console.log('WS connected');

            if (user?.token) {
                ws.current?.send(JSON.stringify({
                    type: 'LOGIN',
                    payload: user.token
                }));
            }
        };

        ws.current.onmessage = (event) => {
            const decodedMessage = JSON.parse(event.data);

            if (decodedMessage.type === 'LOAD_MESSAGES') {
                const loadedMessages = decodedMessage.payload;
                setMessages(loadedMessages);
            }
            if (decodedMessage.type === 'NEW_MESSAGE') {
                const { username, message,datetime } = decodedMessage.payload;
                setMessages((prevMessages) => [
                    { username, message, datetime },
                    ...prevMessages,
                ]);
            }
            if (decodedMessage.type === 'UPDATE_USERS') {
                setOnlineUsers(decodedMessage.payload);
            }
        };

        return () => {
            ws.current?.close();
        };
    }, [user?.token]);

    const sendMessage = (event: React.FormEvent) => {
        event.preventDefault();
        if (ws.current) {
            ws.current.send(JSON.stringify({
                type: 'SEND_MESSAGE',
                payload: messageText,
            }));
            setMessageText('');
        }
    };

    return (
        <Grid container spacing={4}>
            <Grid item xs={12} md={2}>
                <Typography variant="h6" gutterBottom>Online users</Typography>
                <List
                sx={{
                    backgroundColor: 'text.disabled',
                    padding: 1,
                    borderRadius: 2,
                }}>
                    {onlineUsers.length > 0 ? (
                        onlineUsers.map((onlineUser, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={onlineUser}
                                      sx={{
                                         borderBottom: '1px solid black',
                                      }}/>
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body1">No users online</Typography>
                    )}
                </List>
            </Grid>

            <Grid item xs={12} md={2} />

            <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>Chat room</Typography>
                <Box
                    sx={{
                        maxHeight: 600,
                        overflowY: 'auto',
                        backgroundColor: 'text.disabled',
                        padding: 2,
                        borderRadius: 2,
                        marginBottom: 2
                    }}
                >
                    {messages && messages.length > 0 ? (
                        messages.map((message, index) => (
                            <Box key={index} sx={{ marginBottom: 1 }}>
                                <Typography variant="body1">
                                    <strong>{message.username}:</strong>
                                    <span>{message.message} </span>
                                    <strong>{dayjs(message.datetime).format('YYYY-MM-DD HH:mm:ss')}</strong>
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body1">No messages.</Typography>
                    )}
                </Box>

                <Box component="form" onSubmit={sendMessage} sx={{display: 'flex', alignItems: 'center' }}>
                    <TextField
                        required
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Send message..."
                        sx={{ marginRight: 2 }}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Отправить
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
};
export default Messages;