import { createServer } from "node:http";
import { readFileSync } from "node:fs";
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

createServer((req, res) => {
    if (req.method !== "POST" || req.url !== "/api/auth/login") {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not Found" }));
        return;
    }

    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
        try {
            const { email } = JSON.parse(body || "{}");

            if (!email) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Email es requerido" }));
                return;
            }

            const users = getUsers();
            const user = users.find((u) => u.email === email);

            if (!user) {
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Credenciales inválidas" }));
                return;
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                token: "mock-token-" + Date.now(),
                user: { id: user.id, name: user.name, email: user.email },
            }));
        } catch {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Cuerpo de solicitud inválido" }));
        }
    });
}).listen(PORT, HOST, () => {
    console.log(`Auth server corriendo en http://${HOST}:${PORT}`);
});
