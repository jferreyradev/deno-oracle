import { oracledb, checkConn, closeDB, initDB, simpleExecute, run } from "./deps.ts";

interface Query {
    id: number;
    sql: string;
}

/*await run(
    `BEGIN 
        WORKFLOW.SET_PARAM(to_Date('01/08/2023','dd/mm/yyyy'), 1, 0, -1);
    END;` );*/


async function run() {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `SELECT id, farmer
             FROM no_banana_farmer
             ORDER BY id`,
            [], // no bind variables
            {
                resultSet: true,             // return a ResultSet (default is false)
                // fetchArraySize: 100       // internal buffer allocation size for tuning
            }
        );

        const rs = result.resultSet;
        let row;
        let i = 1;

        while ((row = await rs.getRow())) {
            console.log("getRow(): row " + i++);
            console.log(row);
        }

        // always close the ResultSet
        await rs.close();

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}



let result = await run(`SELECT * FROM WORKFLOW.PARAMETROS`);

console.log(result);



checkConn()



