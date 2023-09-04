import { exec } from "../db/orcl.js";

export async function ctrlProc(match: any) {
    if (match) {
      const id = match.pathname.groups.id || -1;
      const obj = match.pathname.groups.obj;
  
      let sql: string = '';
      let binds: any[] = [];
  
      if (obj === 'proc') {
        if (id === -1) {
          sql = `SELECT * FROM WORKFLOW.PROC_ITEMS`;
        } else {
          sql = `SELECT * FROM WORKFLOW.PROC_ITEMS WHERE IDPROC=:1`;
          binds = [id];
        }
      }
  
      if (obj === 'procgrp') {
        if (id === -1) {
          sql = `SELECT * FROM WORKFLOW.PROC_GRP`;
        } else {
          sql = `SELECT * FROM WORKFLOW.PROC_GRP WHERE IDPROCGRP=:1`;
          binds = [id];
        }
      }
  
      try {
        const result = await exec(sql, binds);
        if (result) return result.rows;
        return [];
      } catch (err) {
        console.error(err);
      } finally {
        null;
      }
    }
  }