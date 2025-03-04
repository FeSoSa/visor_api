const express = require("express");
const User = require('../models/user');
const WebSocket = require("ws");
const { randomUUID } = require("crypto");

const router = express.Router();

module.exports = (wss) => {

    router.post('/register', async (req, res) => {
        try {
            const { registry, name } = req.body;
            console.log('Request body:', req.body);

            const existingUser = await User.findOne({ registry: registry });
            console.log('Existing user:', existingUser);

            if (existingUser) return res.status(400).send('Usuário já cadastrado.');

            const user = new User({
                registry,
                name,
                role: "player",
                players: [],
                token: randomUUID()
            });

            console.log('New user object:', user);
            await user.save();
            res.status(201).send('Usuário criado com sucesso!');
        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).send(error.message);
        }
    });


    // Listar user por ID
    router.get("/:id", async (req, res) => {
        try {
            const user = await User.find({ registry: req.params.id }); // Usando `id` ao invés de `_id`
            if (!user) {
                return res.status(404).send({ message: "Usuário não encontrado!" });
            }
            res.send(user[0]);
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // Listar users
    router.get("/", async (req, res) => {
        try {
            const user = await User.find();
            res.send(user);
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // Rota para atualizar um usuário
    router.put('/update/:id', async (req, res) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedUser) return res.status(404).send('Usuário não encontrado!');

            res.send(updatedUser);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    return router;
};
