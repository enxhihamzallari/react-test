import * as fs from 'fs';
import neo4j, { Driver } from "neo4j-driver";
import { URI, USER, PASSWORD } from "./creds";


export async function sendTriggers() {
    const triggers = fs.readFileSync('/triggers.cql', 'utf8');
    const query = triggers;
    try {
        const driver: Driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
        const session = driver.session();
        const result = await session.run(query);
        await session.close();
        await driver.close();
        return result;
      } catch (err) {
        console.error(`Raw query error\n${err}.`);
        throw err;
      }
    ;
}