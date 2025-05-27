const express = require("express");
const { Player } = require("../models/players");
const WebSocket = require("ws");

const router = express.Router();

module.exports = (wss) => {
    // Criar jogador
    router.post("/save", async (req, res) => {
        try {
            // Remover o campo _id de req.body
            const { _id, ...updateData } = req.body;

            const player = await Player.findOne({ registry: req.body.registry });

            if (player == null) {
                // Caso o jogador não exista, crie um novo
                const newPlayer = new Player(req.body);
                const result = await newPlayer.save();
                return res.status(201).send(result);  // Retorna o novo jogador criado
            } else {
                // Atualize o jogador sem o campo _id
                const updatedPlayer = await Player.findOneAndUpdate(
                    { registry: req.body.registry },
                    updateData,  // Envie o objeto sem _id
                    { new: true }
                );

                if (updatedPlayer) {
                    // Envia atualização para todos os clientes conectados via WebSocket
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            const message = {
                                event: "player-updated",
                                data: updatedPlayer,
                                registry: updatedPlayer.registry
                            };
                            console.log("enviando");
                            client.send(JSON.stringify(message));
                        }
                    });

                    return res.status(200).send(updatedPlayer);
                }
            }
        } catch (err) {
            console.log(err); // Imprime o erro completo
            res.status(500).send({ error: "Erro ao processar a solicitação", details: err });
        }
    });



    // Editar jogador
    router.put("/:id", async (req, res) => {
        try {
            // Tentar atualizar o jogador


        } catch (err) {
            console.error(err);
            res.status(500).send(err); // Retornar erro 500 se algo der errado
        }
    });

    // Listar jogador por ID
    router.get("/:registry", async (req, res) => {
        try {
            const player = await Player.find({ registry: req.params.registry }); // Usando `id` ao invés de `_id`
            if (!player) {
                return res.status(404).send({ message: "Jogador não encontrado!" });
            }
            res.send(player);
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // Listar jogador por operação
    router.get("/status/:status", async (req, res) => {
        try {
            const players = await Player.find({ status: req.params.status });
            if (!players) {
                return res.status(404).send({ message: "Jogador não encontrado!" });
            }
            res.send(players);
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // Listar jogador por userId
    router.get("/user/:userRegistry", async (req, res) => {
        try {
            const players = await Player.find({ userRegistry: req.params.userRegistry });
            if (!players.length) {
                return res.status(404).send({ message: "Jogadores não encontrados para esse usuário!" });
            }
            res.send(players);
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // Listar todos os jogadores
    router.get("/", async (req, res) => {
        try {
            const players = await Player.find();
            res.send(players);
        } catch (err) {
            res.status(500).send(err);
        }
    });

    return router;
};
