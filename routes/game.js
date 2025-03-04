const express = require("express");
const Game = require('../models/game');
const WebSocket = require("ws");

const router = express.Router();

module.exports = (wss) => {

    // Rota para obter o estado atual do jogo
    router.get("/", async (req, res) => {
        try {
            const game = await Game.findOne(); // Procurando o jogo no banco
            if (!game) {
                return res.status(404).send({ message: "Jogo não encontrado!" });
            }
            res.send(game);
        } catch (err) {
            res.status(500).send({ error: "Erro ao buscar o jogo", details: err });
        }
    });

    // Rota para salvar ou atualizar o estado do jogo
    router.post("/save", async (req, res) => {
        try {
            const gameData = req.body;

            // Validação básica
            if (!gameData || !gameData._id) {
                return res.status(400).send({ message: "Dados inválidos, _id é obrigatório." });
            }

            let game = await Game.findOne({ _id: gameData._id });

            if (!game) {
                // Caso o jogo não exista, cria um novo
                const newGame = new Game(gameData);
                const result = await newGame.save();
                return res.status(201).send(result);  // Retorna o novo jogo criado
            } else {
                // Caso o jogo exista, atualiza os dados
                // Atualiza somente os campos necessários, por exemplo, dbImages
                const updatedGame = await Game.findOneAndUpdate(
                    { _id: gameData._id }, // Usando _id para atualização
                    { $set: gameData },     // Usando $set para atualizar campos específicos
                    { new: true, runValidators: true } // Retorna o jogo atualizado e valida os dados
                );

                if (updatedGame) {
                    // Notificar todos os clientes via WebSocket sobre a atualização
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            const message = {
                                event: "game-updated",
                                data: updatedGame
                            };
                            client.send(JSON.stringify(message)); // Envia os dados atualizados
                        }
                    });

                    return res.status(200).send(updatedGame);
                } else {
                    return res.status(400).send({ message: "Falha ao atualizar o jogo" });
                }
            }
        } catch (err) {
            res.status(500).send({ error: "Erro ao processar a solicitação", details: err.message });
        }
    });


    return router;
};
