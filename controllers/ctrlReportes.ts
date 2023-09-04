import { exec } from "../db/orcl.js";
import queries from "./queries.json" assert { type: "json" };

export async function ctrlReportes(match: any) {
    if (match) {
        
        const id = match.pathname.groups.id || 0;
        const ini = match.pathname.groups.ini || 0;
        const fin = match.pathname.groups.fin || 0;



        if ((match.pathname.input.split('/')).includes("download") ){
            console.log("Disponible descarga");
        }

        if (id === 0) {
            return queries;
        } else {
            let query = queries.find((element) => element.id == id);
            if (query) {
                try {
                    const result = await exec(query.sql,
                        (ini >= 0 && fin > 0) ? { "offset": ini, "limit": fin } : []
                    );
                    if (result) return result.rows;
                    return [];
                } catch (err) {
                    console.error(err);
                } finally {
                    null;
                }
            }
        }
    }
}