import { load, oracledb } from "./deps.ts";

// Configuración de Oracle
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// OBtiene las variables del archivo .env
const env = await load();

// Configuración de la conexión a la base de datos Oracle
const dbConfig = {
  user: env["USER"],
  password: env["PASSWORD"],
  connectString: env["CONNECTIONSTRING"],
  poolMax: Number(env["POOL"])||10,
};

const defaultThreadPoolSize = 4;

//process.env.UV_THREADPOOL_SIZE = dbConfig.poolMax + defaultThreadPoolSize;

function setDriver() {

  oracledb.initOracleClient({ libDir: env["LIB_ORA"] });

  /*
  if ( process.platform === "win32") {
    // Windows
    oracledb.initOracleClient({ libDir: "C:\\instantclient_21_10" });
  } else if (process.platform === "darwin") {
    // macOS
    oracledb.initOracleClient({
      libDir: process.env.HOME + "/Downloads/instantclient_19_8",
    });
  }
  */
}

function getQueryLimits(query) {
  return `SELECT * FROM (SELECT A.*, ROWNUM AS MY_RNUM FROM ( ${query} ) A
             WHERE ROWNUM <= :limit + :offset) WHERE MY_RNUM > :offset`;
}

export function simpleExecute(statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn;
    let query;
    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;
    try {
      conn = await oracledb.getConnection(dbConfig);
      if (binds.limit !== undefined) {
        if (binds.offset == undefined) {
          binds.offset = 0;
        }
        query = getQueryLimits(statement);
      } else {
        query = statement;
      }
      const startTime = new Date(); //console.log("Inicio de la ejecución");

      console.log(query, binds, (new Date() - startTime) / 1000);
      const result = await conn.execute(query, binds, opts);

      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      if (conn) {
        try {
          await conn.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  })
}

export async function run(statement, binds = [], opts = {}) {  
  let conn;
  let query;
  opts.outFormat = oracledb.OBJECT;
  opts.autoCommit = true;  
  try {    
    setDriver();
    await oracledb.createPool(dbConfig);
    conn = await oracledb.getConnection();
    if (binds.limit !== undefined) {
      if (binds.offset == undefined) {
        binds.offset = 0;
      }
      query = getQueryLimits(statement);
    } else {
      query = statement;
    }
    const result = await conn.execute(query, binds, opts);
    return result;
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) {
      try {
        await oracledb.getPool().close(0);
      } catch (err) {
        console.log(err);
      }
    }
  }
}

export async function initDB() {
  setDriver();
  await oracledb.createPool(dbConfig);
  console.log("Conexión a Base de datos Oracle establecida.");
}

export async function closeDB() {
  await oracledb.getPool().close(0);
  console.log("Desconexión a Base de datos Oracle exitosa.");
}

export async function checkConn() {
  let conn = null;  
  try {
    setDriver();
    await oracledb.createPool(dbConfig);
    conn = await oracledb.getConnection();
    console.log("connected to database");
  } catch (err) {
    console.error(err.message);
  } finally {
    if (conn) {
      try {
        // Always close connections
        await oracledb.getPool().close(0);
        console.log("close connection success");
      } catch (err) {
        console.error(err.message);
      }
    }
  }
}

/*
module.exports.initDB = initDB;
module.exports.closeDB = closeDB;
module.exports.checkConn = checkConn;
module.exports.simpleExecute = simpleExecute;
*/