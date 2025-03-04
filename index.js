const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/user");

app.use(bodyParser.json());
app.use(cors({
    origin: ["https://meu-app.vercel.app", "http://localhost:3000", 'http://192.168.18.216:3000'], // Substitua pelo IP da máquina servidor
}));

const { randomUUID } = require("crypto");

//! WebSocket
const wss = new WebSocket.Server({ server: server });
wss.on("connection", function connection(ws) {
    console.log("Novo cliente conectado");

    // Enviar mensagem inicial ao cliente
    //ws.send("Olá! Você está conectado ao servidor WebSocket.");

    // Escutar por mensagens recebidas do cliente
    ws.on("message", function incoming(data, isBinary) {
        //console.log("Mensagem recebida:", message.toString());

        // Responder com uma confirmação de que a mensagem foi recebida
        ws.send("Mensagem recebida pelo servidor");

        // Enviar a mensagem para todos os clientes conectados, exceto o que enviou
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });

    // Evento de erro
    ws.on("error", (err) => {
        console.error("Erro no WebSocket:", err);
    });

    // Evento de desconexão
    ws.on("close", () => {
        console.log("Cliente desconectado.");
    });
});

//! Conectar ao MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/rpg", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Conectado ao MongoDB"))
    .catch((err) => console.log("Erro na conexão com MongoDB:", err));

//! Middleware para permitir requisições CORS e parsear o JSON

//! Importar rotas
const playersRoutes = require("./routes/players")(wss);
app.use("/player", playersRoutes);
const userRoutes = require("./routes/user")(wss);
app.use("/user", userRoutes);
const gameRoutes = require("./routes/game")(wss);
app.use("/game", gameRoutes);

app.get("/", (req, res) => {
    console.log("Recebendo algo aqui", req.body);
    res.send("API está funcionando");
});

app.post("/signIn", async (req, res) => {
    try {
        const { registry } = req.body;
        if (!registry) {
            return res.status(400).send({ message: "O campo 'registry' é obrigatório!" });
        }

        const user = await User.findOne({ registry: registry });
        if (!user) {
            return res.status(404).send({ message: "Usuário não encontrado!" });
        }
        user.token = randomUUID();
        const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true });

        res.status(200).send(updatedUser);
    } catch (err) {
        console.error("Erro ao autenticar usuário:", err);
        res.status(500).send({ message: "Erro interno do servidor", error: err });
    }
});

//! Definindo a porta do servidor
server.listen(8080, '0.0.0.0', () => console.log("Servidor rodando na porta 8080"));
