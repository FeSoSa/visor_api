const express = require("express");
const Enemie = require("../models/enemies");
const WebSocket = require("ws");

const router = express.Router();

module.exports = (wss) => {
    // Criar 
    router.post("/save", async (req, res) => {
        try {
            const { _id, ...updateData } = req.body;
            const enemie = await Enemie.findOne({ _id: _id });

            if (enemie == null) {
                const newEnemie = new Enemie(req.body);
                const result = await newEnemie.save();
                return res.status(201).send(result);
            } else {
                const updatedEnemie = await Enemie.findOneAndUpdate(
                    { _id: _id },
                    updateData,
                    { new: true }
                );

                if (updatedEnemie) {
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            const message = {
                                event: "enemie-updated",
                                data: updatedEnemie,
                            };
                            client.send(JSON.stringify(message));
                        }
                    });

                    return res.status(200).send(updatedEnemie);
                }
            }
        } catch (err) {
            console.log(err); // Imprime o erro completo
            res.status(500).send({ error: "Erro ao processar a solicitação", details: err });
        }
    });

    // Listar por ID
    router.get("/load/:id", async (req, res) => {
        try {
            const enemie = await Enemie.find({ _id: req.params.id }); // Usando `id` ao invés de `_id`
            if (!enemie) {
                return res.status(404).send({ message: "Jogador não encontrado!" });
            }
            res.send(enemie);
        } catch (err) {
            res.status(500).send(err);
        }
    });

    router.delete("/remove/:id", async (req, res) => {
        try {
            const enemie = await Enemie.deleteOne({ _id: req.params.id });
            res.send(enemie);

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    const message = {
                        event: "enemie-updated",
                    };
                    client.send(JSON.stringify(message));
                }
            });
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // Listar 
    router.get("/list", async (req, res) => {
        try {
            const enemies = await Enemie.find();
            if (!enemies) {
                return res.status(404).send({ message: "Inimigos não encontrados!" });
            }
            res.send(enemies);
        } catch (err) {
            res.status(500).send(err);
        }
    });

    return router;
};
