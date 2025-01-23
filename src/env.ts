import dotenv from 'dotenv';
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file

const __dirname = path.dirname(__filename); // get the name of the directory

const envPath = path.resolve(__dirname, '../.env')

dotenv.config({ path: envPath })