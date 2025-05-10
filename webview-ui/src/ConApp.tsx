// import { useEffect, useState } from "react"
// import { connect } from "./connections"
// import { Relationship, Node } from "@neo4j-nvl/base";
// import { InteractiveNvlWrapper } from "@neo4j-nvl/react";
// import { styleGraph } from "./styling";


// export function ConApp() {
// const [nodes, setNodes] = useState<Node[]>([
//   { id: "0", caption: "Jonny" },
//   { id: "1", caption: "Advanced Model Engineering" },
// ]);
// const [relationships, setRelationships] = useState<Relationship[]>([
//   { from: "0", to: "1", id: "10", caption: "is taking" },
// ]);
//       useEffect(()=>{
//         connect("call db.schema.visualization()")
//         .then((result) =>{
//           console.log(result);
    
//           const { styledNodes, styledRels } = styleGraph(result);
//           setNodes(styledNodes);
//           setRelationships(styledRels);
//         }).catch((err) =>{
//           console.log(err);
//         });
//       }, [])


//     return <>
//     <div 
//     style={{ 
//       width: "100%", 
//       height: "95vh",
//       background: "linear-gradient(to right, white, lightgrey)" 
//       }}>
//     <InteractiveNvlWrapper
//             nvlOptions={{ initialZoom: 3 }}
//             nodes={nodes}
//             rels={relationships}
//             mouseEventCallbacks={{
//               onZoom: true,
//               onPan: true,
//               onNodeClick: (node: Node) => {
//                 console.log(node);
//                 const label = node.captions[0].value;
//                 const query = `MATCH (a)-[r]->(b) RETURN a, labels(a) AS a_labels, r, b, labels(b) AS b_labels LIMIT 100`;
//                 connect(query, {label}).then((result) => {
//                   console.log(result);
//                   const {styledNodes, styledRels} = styleGraph(result);
//                   setNodes(styledNodes);
//                   setRelationships(styledRels);
//                 })
//               }
//             }}
//           />
//         </div>
//     </>
// }
