import { serve } from "./deps.ts";
import { open, exec } from "./db/orcl.js";

// INICIA DB Y SERVICIO API (en este caso)
open();