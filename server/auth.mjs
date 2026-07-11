import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3045;
const HOST = "0.0.0.0";
const DB_PATH = join(__dirname, "db.json");

function getUsers() {
    try {
        const data = JSON.parse(readFileSync(DB_PATH, "utf-8"));
        return data.users || [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    try {
        const data = JSON.parse(readFileSync(DB_PATH, "utf-8"));
        data.users = users;
        writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch {
        // ignore
    }
}

function setCorsHeaders(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res, status, data) {
    setCorsHeaders(res);
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

createServer((req, res) => {
    if (req.method === "OPTIONS") {
        setCorsHeaders(res);
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === "GET" && req.url === "/api/users") {
        const users = getUsers();
        sendJson(res, 200, users);
        return;
    }

    if (req.method === "DELETE" && req.url.startsWith("/api/users/")) {
        const id = req.url.split("/api/users/")[1];
        const users = getUsers();
        const index = users.findIndex((u) => String(u.id) === id);

        if (index === -1) {
            sendJson(res, 404, { error: "Usuario no encontrado" });
            return;
        }

        const [deleted] = users.splice(index, 1);
        saveUsers(users);
        sendJson(res, 200, { message: "Usuario eliminado", user: deleted });
        return;
    }

    if (req.method === "PUT" && req.url.startsWith("/api/users/")) {
        const id = req.url.split("/api/users/")[1];
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
            try {
                const updates = JSON.parse(body || "{}");
                const users = getUsers();
                const index = users.findIndex((u) => String(u.id) === id);

                if (index === -1) {
                    sendJson(res, 404, { error: "Usuario no encontrado" });
                    return;
                }

                users[index] = { ...users[index], ...updates };
                saveUsers(users);
                sendJson(res, 200, users[index]);
            } catch {
                sendJson(res, 400, { error: "Cuerpo de solicitud inválido" });
            }
        });
        return;
    }

    if (req.method === "POST" && req.url === "/api/auth/login") {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
            try {
                const { email } = JSON.parse(body || "{}");

                if (!email) {
                    sendJson(res, 400, { error: "Email es requerido" });
                    return;
                }

                const users = getUsers();
                const user = users.find((u) => u.email === email);

                if (!user) {
                    sendJson(res, 401, { error: "Credenciales inválidas" });
                    return;
                }

                sendJson(res, 200, {
                    token: "mock-token-" + Date.now(),
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role || "user",
                    },
                });
            } catch {
                sendJson(res, 400, { error: "Cuerpo de solicitud inválido" });
            }
        });
        return;
    }

    sendJson(res, 404, { error: "Not Found" });
}).listen(PORT, HOST, () => {
    console.log(`Auth server corriendo en http://${HOST}:${PORT}`);
});
