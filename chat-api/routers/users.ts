import express from "express";
import mongoose from "mongoose";
import User from "../models/User";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            displayName: req.body.displayName,
        });
        user.generateToken();
        await user.save();
        return res.send(user);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(error);
        }
        return next(error);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send({ error: 'Username and password are required!' });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).send({ error: 'Username not found!' });
        }

        const isMatch = await user.checkPassword(password);

        if (!isMatch) {
            return res.status(400).send({ error: 'Password is wrong!' });
        }

        user.generateToken();
        await user.save();
        return res.send(user);
    } catch (error) {
        return next(error);
    }
});

usersRouter.delete('/sessions', async (req, res, next) => {
    try {
        const headerValue = req.get('Authorization');

        if (!headerValue) return res.status(204).send();

        const [, token] = headerValue.split(' ');

        if (!token) return res.status(204).send();

        const user = await User.findOne({ token });

        if (!user) return res.status(204).send();

        user.generateToken();
        await user.save();
        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
});

export default usersRouter;