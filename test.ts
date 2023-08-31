import { open, checkConn, exec } from "./db/orcl.js";

interface Query {
    id: number;
    sql: string;
}

/*await run(
    `BEGIN 
        WORKFLOW.SET_PARAM(to_Date('01/08/2023','dd/mm/yyyy'), 1, 0, -1);
    END;` );*/


async function run() {   

    try {
       /*
        const result = await exec(`SELECT * FROM WORKFLOW.PROC_CAB`,  [], 
                {
                    resultSet: true,             // return a ResultSet (default is false)
                    // fetchArraySize: 100       // internal buffer allocation size for tuning
                }
        );*/


        //const result = await exec(`SELECT * FROM WORKFLOW.PROC_CAB`);

        const result = await exec (`INSERT INTO WORKFLOW.TODOITEM (ID, DESCRIPTION) VALUES (87,'DENO TEST')`);

        console.log(result);

        /*const rs = result.resultSet;
        let row;
        let i = 1;

        while ((row = await rs.getRow())) {
            console.log("getRow(): row " + i++);
            console.log(row);
        }   */   

    } catch (err) {
        console.error(err);
    } finally {
       console.log('fin');
    }
}

//await check();

await run();