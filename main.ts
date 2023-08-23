import { checkConn, closeDB, initDB, simpleExecute, serve } from "./deps.ts";
import queries from "./queries.json" assert { type: "json" };

const port = 3000;
const API_ROUTE = new URLPattern({ pathname: "/api/query/:id{/:ini}?{/:fin}?" });

async function sentence(sql: string, binds: []) {
  //console.log(binds);
  const result = await simpleExecute(sql, binds);
  return result;
}

async function handler(req: Request): Response {
  //console.log(req.url)

  const match = API_ROUTE.exec(req.url);

  console.log(match);

  if (match) {
    //console.log(match);

    const id = match.pathname.groups.id;
    const ini = match.pathname.groups.ini || 0;
    const fin = match.pathname.groups.fin || 0;

    //const body = `Book ${id}`;
    console.log(`Variables ini: ${ini}, ${fin}`);
    if (id) {
      let resBody;
      if (id == -1) {
        resBody = queries;
      } else {
        let query = queries.find((element) => element.id == id);
        if (query) {
          const body = await sentence(
            query.sql,
            (ini >= 0 && fin > 0) ? { "offset": ini, "limit": fin } : []
          );
          resBody = body.rows;
        }
      }

      if (resBody) {
        return new Response(JSON.stringify(resBody), {
          status: 200,
          headers: {
            "content-type": "application/json; charset=utf-8",
          },
        });
      }
    }
  }

  return new Response("Not found (try /query/1)", {
    status: 404,
  });
}

// Escucha señal de finalización

Deno.addSignalListener("SIGINT", async () => {
  console.log("interrupted!");
  await closeDB();
  Deno.exit();
});

console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`);

// INICIA DB Y SERVICIO API (en este caso)
initDB();
serve(handler, { port });
