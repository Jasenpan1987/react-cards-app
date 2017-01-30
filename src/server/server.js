import express from "express";
import http from "http";
import { isDevelopment } from "./settings";

const app = express();
const server = new http.Server(app);

app.set("view engine", "pug");
app.use(express.static("public"));

const useExternalStyles = !isDevelopment;
const scriptRoot = isDevelopment ? "http://localhost:8080/build" : "/build";

app.get("*", (req, res) => {
    res.render("index", {
        useExternalStyles,
        scriptRoot
    });
});

const PORT = process.env.PORT || "3000";

server.listen(PORT, () => {
    console.log("Http server running on port" + PORT);
    console.log("Current running enviornment is " , process.env.NODE_ENV);
});