import { open, checkConn, exec } from "./db/orcl.js";

interface Query {
    id: number;
    sql: string;
}

async function run() {   

    try {
      
        const result = await exec (`SELECT * FROM DET_PRESUP_ANUAL`);

        console.log(result.rows);

        await Deno.writeTextFile("presup.json", JSON.stringify(result.rows));

        //checkConn();

        const rs = result.rows;
        for (let index = 0; index < rs.length; index++) {
            const element = rs[index];
            console.log(rs)            
        }

    } catch (err) {
        console.error(err);
    } finally {
       console.log('fin');
    }
}

//await check();

await run();