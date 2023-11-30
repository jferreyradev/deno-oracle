//import { serve } from "./deps.ts";
import { ctrlProc } from "./controllers/ctrlProc.ts";
import { ctrlReportes } from "./controllers/ctrlReportes.ts";

const port = 3000;

const PROC_ROUTE = new URLPattern({ pathname: "/api/:obj/:id*{/:ini}?{/:fin}?" });
const REPORTE_ROUTE = new URLPattern({ pathname: "/api/reporte{s}?/:id?{/download}*{/:ini}?{/:fin}?" });

async function handler(req: Request): Response {
  const matchProc = PROC_ROUTE.exec(req.url);
  const matchRepor = REPORTE_ROUTE.exec(req.url);

  let rows:any[]=[];

  if (matchRepor) {
    rows = await ctrlReportes(matchRepor);    
  }else if (matchProc){
    rows = await ctrlProc(matchProc);
  }
  
  if (rows.length||0 > 0) {
    return new Response(JSON.stringify(rows),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
          "content-type": "application/json; charset=utf-8"
        }
      });
  }
  return new Response("Not found (try /api/proc/1)", { status: 404 });
}

Deno.addSignalListener("SIGINT", async () => {
  console.log("interrupted!");
  await close();
  Deno.exit();
});

Deno.serve(handler, { port });

/*

import queries from "./queries.json" assert { type: "json" };

const port = 3000;
const API_ROUTE = new URLPattern({ pathname: "/api/query/:id{/:ini}?{/:fin}?" });

async function sentence(sql: string, binds: []) {
  //console.log(binds);
  const result = await exec(sql, binds);
  return result;
}

async function handler(req: Request): Response {

  const matchProc = API_ROUTE.exec(req.url);

  //console.log(matchProc);

  if (matchProc) {
    //console.log(matchProc);

    const id = matchProc.pathname.groups.id;
    const ini = matchProc.pathname.groups.ini || 0;
    const fin = matchProc.pathname.groups.fin || 0;

    //const body = `Book ${id}`;
    //console.log(`Variables ini: ${ini}, ${fin}`);
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
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "content-type": "application/json; charset=utf-8"
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
  await close();
  Deno.exit();
});

console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`);

// INICIA DB Y SERVICIO API (en este caso)
open();
serve(handler, { port });

*/