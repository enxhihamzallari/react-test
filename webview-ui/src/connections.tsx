// import { nvlResultTransformer } from "@neo4j-nvl/base";
// import neo4j, { Driver } from "neo4j-driver";
// export const URI = "bolt://localhost:7687";
// export const USER = "neo4j";
// export const PASSWORD = "12345678";

// export const connect = async (query: string, param ={}) => {
//     let driver : Driver;
    
//     try {
//         driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
//         // const serverInfo = await driver.getServerInfo();
//         const data = await driver.executeQuery(query, param, {
//             resultTransformer: nvlResultTransformer,
//         });
        
//         // console.log("connection with neo4j");
//         // console.log(serverInfo);
//         return data;
//     } catch (err) {
//         console.log(`Connection error\n${err}`);
//     }
// };
import neo4j, { Driver,  RecordShape, Result } from "neo4j-driver";
import { URI, USER, PASSWORD } from "./creds";
import { Node as NVLNode, Relationship as NVLRelationship, nvlResultTransformer } from "@neo4j-nvl/base";


export const connect = async (
  query: string,
  param = {}
): Promise<
  | {
      recordObjectMap: Map<string, RecordShape>;
      nodes: NVLNode[];
      relationships: NVLRelationship[];
    }
  | undefined
> => {
  try {
    const driver: Driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    return await driver.executeQuery(query, param, {
      resultTransformer: nvlResultTransformer,
    });
    

  } catch (err) {
    console.error(`Connection error\n${err}.`);
    throw err;
  }
};

export const runRawQuery = async (query: string, param = {}): Promise<Result | undefined> => {
  try {
    const driver: Driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    const session = driver.session();
    const result = await session.run(query, param);
    await session.close();
    await driver.close();
    return result;
  } catch (err) {
    console.error(`Raw query error\n${err}.`);
    throw err;
  }
};

