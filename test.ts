import { open, checkConn, exec } from "./db/orcl.js";

interface Query {
    id: number;
    sql: string;
}

async function run() {   

    try {
       /*
        const result = await exec(`SELECT * FROM WORKFLOW.PROC_CAB`,  [], 
                {
                    resultSet: true,             // return a ResultSet (default is false)
                    // fetchArraySize: 100       // internal buffer allocation size for tuning
                }
        );*/


        const result = await exec (`SELECT * FROM DET_PRESUP_ANUAL WHERE HIJO = 1`);

        //console.log(result);

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