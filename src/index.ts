import http, { IncomingMessage, ServerResponse } from "http";
import path from "path";
import fs from "fs/promises";
import url from "url";

interface Joke {
  id: string;
  joke: string;
  status: number;
}

async function requestListener(req: IncomingMessage, res: ServerResponse) {
  const parsedUrl = url.parse(req.url || "");

  let data = "";

  try {
    let pathName = parsedUrl.pathname;
    if (pathName === "/") pathName = "/index";
    const filePath = path.join(__dirname, `static${pathName}.html`);
    data = await fs.readFile(filePath, "utf-8");
  } catch {
    data = await fs.readFile(path.join(__dirname, "static/404.html"), "utf-8");
  }

  if (parsedUrl.pathname === "/dad-joke") {
    const response = await fetch("https://icanhazdadjoke.com", {
      headers: {
        accept: "application/json",
        "user-agent": "NodeJS Server",
      },
    });

    const joke: Joke = await response.json();

    data = data.replace(/{{joke}}/gm, joke.joke);
  }

  res.writeHead(200, {
    "Content-type": "text/html",
    "content-length": (await data).length,
  });

  res.write(data);
  res.end();
}

http.createServer(requestListener).listen(3000, () => {
  console.log("yeeeeeeeee haaaaaaa!");
});
