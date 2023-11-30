import { open, close, checkConn, exec, setConfig } from './db/orcl.js';
import {
  Application,
  isHttpError,
  Status, Router
} from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

/**
 * Setup routes.
 */

router
  .get("/api", (context) => {
    context.response.body = "Welcome to the Oracle API!";
  })
  .get("/api/query", async (context) => {
    // Get all dinosaurs.
    const query = await exec('select IDMONTO, IMPORTE, IDTIPODIST, CONF.PERIODOFDO from FDOESTIMULO.MONTODISTR M inner join FDOESTIMULO.CONFIGURACION conf on CONF.IDCONFIGURACION = M.IDCONFIGURACION where idtipodist = 1 order by conf.idconfiguracion desc');

    context.response.body = query.rows;
  })
  .get("/dinosaur/:id", async (context) => {
    // Get one dinosaur by id.    
  })
  .post("/dinosaur", async (context) => {
    // Create a new dinosaur.   
  })
  .delete("/dinosaur/:id", async (context) => {
    // Delete a dinosaur by id.
  });

/**
 * Setup middleware.
 */

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      switch (err.status) {
        case Status.NotFound:
          // handle NotFound
          console.log('ERROR')
          break;
        default:
          // handle other statuses
          console.log('ERROR DEFAULT')
      }
    } else {
      // rethrow if you can't handle the error
      console.log('ERROR')
      throw err;
    }
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

/**
 * Start server.
 */

await app.listen({ port: 8000 });