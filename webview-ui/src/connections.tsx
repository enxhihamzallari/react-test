import neo4j, { Driver } from "neo4j-driver";
export const URI = "bolt://localhost:7687";
export const USER = "neo4j";
export const PASSWORD = "12345678";

export const connect = async () => {
    let driver : Driver;
    
    try {
        driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
        const serverInfo = await driver.getServerInfo();
        console.log("connection with neo4j");
        console.log(serverInfo);
    } catch (err) {
        console.log(`Connection error\n${err}.`);
    }
};