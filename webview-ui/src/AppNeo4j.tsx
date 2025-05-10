/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useRef, useState } from "react";
import { InteractiveNvlWrapper, MouseEventCallbacks } from "@neo4j-nvl/react";
import { connect, runRawQuery } from "./connections";
import { styleGraph } from "./styling";
import type {
    NVL,
    Node as NVLNode,
    Relationship as NVLRelationship,
  } from "@neo4j-nvl/base";


export const App2 = () => {
    const [nodes, setNodes] = useState<NVLNode[]>([]);
    const [relationships, setRelationships] = useState<NVLRelationship[]>([]);
    const [, setLabel] = useState<string | null>(null);
    const [newNodeName, setNewNodeName] = useState("");
    const [createMode, setCreateMode] = useState<"none" | "relationship">("none");
    const [selectedNodes, setSelectedNodes] = useState<NVLNode[]>([]);
    const [selectedNode, setSelectedNode] = useState<NVLNode | null>(null);
    const nvlRef = useRef<NVL | null>(null);
    const [availableLabels, setAvailableLabels] = useState<string[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<string>("");


    const clearLabel = () => {
      setLabel(null);
    };
  
    const mergeNodes = (existing: NVLNode[], incoming: NVLNode[]) => {
      const existingIds = new Set(existing.map((n) => n.id));
      return [...existing, ...incoming.filter((n) => !existingIds.has(n.id))];
    };
  
    const mergeRelationships = (existing: NVLRelationship[], incoming: NVLRelationship[]) => {
      const existingIds = new Set(existing.map((r) => r.id));
      return [...existing, ...incoming.filter((r) => !existingIds.has(r.id))];
    };
    const getFriendlyErrorMessage = (err: any): string => {
        if (err && err.message) {
          const parts = err.message.split(":");
          const len = parts.length;
        if (len >= 2) {
            return `${parts[len - 2].trim()}: ${parts[len - 1].trim()}`;
        }
        return parts[len - 1].trim();
        }
        return "An unknown error occurred.";
      };
    const createNode = async () => {
      if (!newNodeName || !selectedLabel) {
        alert("Please enter a node name and select a label.");
        return;
       };

      const query = `
        MERGE (n:${selectedLabel} {name: $name})
        RETURN n, labels(n) AS n_labels
      `;
  try {
      const result = await connect(query, { name: newNodeName });
  
      if (!result) return;
  
      const { styledNodes } = styleGraph(result);
  
      setNodes((prev) => mergeNodes(prev, styledNodes));
      setNewNodeName("");
  
      // Force re-layout by using a ref to re-render the graph
      if (nvlRef.current) {
        setTimeout(() => {
          nvlRef.current?.fit([styledNodes[0].id]);
        }, 0);
      }
    } catch (error) {
        console.error("Caught error:", error);
        const friendlyMessage = getFriendlyErrorMessage(error);
        alert(friendlyMessage);
      }
    };
    const deleteNode = async (node: NVLNode) => {

        const query = `
          MATCH (n) WHERE id(n) = $nodeId
          DETACH DELETE n
        `;
      
        await connect(query, { nodeId: Number(node.id) });
        setNodes((prev) => prev.filter((n) => n.id !== node.id));
        setRelationships((prev) => prev.filter((r) => r.from !== node.id && r.to !== node.id));
      };
      
      const deleteRelationship = async (rel: NVLRelationship) => {
        const query = `
          MATCH ()-[r]->()
          WHERE id(r) = toInteger($relId)
          DELETE r
        `;
      try {
        await connect(query, { relId: rel.id });
        setRelationships((prev) => prev.filter((r) => r.id !== rel.id));
    } catch (error) {
        const friendlyMessage = getFriendlyErrorMessage(error);
          alert(friendlyMessage);
      }
      };

      // Fetch available labels
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const result = await runRawQuery("CALL db.labels()");
        if (result) {
          const labels = result.records.map((record: any) => record.get('label'));
          setAvailableLabels(labels);
          if (labels.length > 0) setSelectedLabel(labels[0]); // Default select first label
        }
      } catch (error) {
        console.error("Failed to fetch labels", error);
      }
    };

    fetchLabels();
  }, []);

      const mouseEventCallbacks: MouseEventCallbacks = {
        onZoom: clearLabel,
        onPan: clearLabel,
        onNodeClick: (node) => {
            if (createMode === "relationship") {
                if (selectedNodes.length === 0) {
                  setSelectedNodes([node]);
                } else if (selectedNodes.length === 1) {
                  setSelectedNodes((prev) => {
                    const secondNode = node;
                    const [firstNode] = prev;
  
                    // if (firstNode.id === secondNode.id) {
                    //   alert("Cannot create relationship to the same node.");
                    //   return [];
                    // }
  
                    const type = prompt("Enter relationship type (e.g., KNOWS)");
                    if (!type) return [];
  
                    createRelationship(firstNode, secondNode, type);
                    return [];
                  });
                }
              } 
              else {
                if (node.captions && node.captions.length > 0) {
                  nvlRef.current?.fit([node.id]);
                  const label = node.captions[0].value;
                  label && setLabel(label);
                }
              }
        },
        onRelationshipClick: (rel) => {
            const confirmDelete = window.confirm("Do you want to delete this relationship?");
        if (!confirmDelete) return;
        deleteRelationship(rel);
        },
        onNodeRightClick: (node) => {
            const confirmDelete = window.confirm("Do you want to delete this node?");
        if (!confirmDelete) return;
      
            deleteNode(node);
        },
        onNodeDoubleClick: (node) => {
            setSelectedNode(node);
        },
        onCanvasClick: () => {
            setSelectedNode(null); // Clear info on canvas click
          },
        };
      
    const getNodeName = (node: NVLNode): string | undefined => {
        if (Array.isArray(node.captions) && node.captions.length > 0) {
          // Pick the last caption or the most relevant one
          
          return node.captions[node.captions.length - 1].value;
        }
        return undefined;
      };
      
      const createRelationship = async (source: NVLNode, target: NVLNode, type: string) => {
        const sourceName = getNodeName(source);
        const targetName = getNodeName(target);
        const sourceId = source.id;
        const targetId = target.id;
      
        console.log("Creating relationship:", sourceName, targetName, type);
      
        if (!sourceName || !targetName) {
          console.error("Missing node names. Cannot create relationship.");
          return;
        }
        const params = {
            aId: Number(sourceId),
            bId: Number(targetId)
          };

        const query = 
            `MATCH (a), (b) WHERE id(a) = $aId AND id(b) = $bId 
             MERGE (a)-[r:${type.toUpperCase()}]->(b)
             RETURN a, labels(a) AS a_labels, r, b, labels(b) AS b_labels`;
        console.log("Running relationship query with:", {
                params,
                query
              });
        try {
          const result = await connect(query, {
            aId: Number(sourceId),
            bId: Number(targetId)
          });
      
          console.log("Relationship creation result:", result);
      
          if (!result) return;
      
          const { styledNodes, styledRelationships} = styleGraph(result,
            "", // label if needed
            createMode === "relationship" ? selectedNodes.map((n) => n.id) : []
          );
          console.log("Styled relationships:", styledRelationships);

      
          setNodes((prev) => mergeNodes(prev, styledNodes));
          setRelationships((prev) => mergeRelationships(prev, styledRelationships));
      
          nvlRef.current?.fit([source.id, target.id]);
          console.log("Creating relationship:", sourceName, targetName, type);
          
          
        } catch (error) {
          console.error("Relationship creation failed:", error);
          const friendlyMessage = getFriendlyErrorMessage(error);
          alert(friendlyMessage);
        }
      };
  
    useEffect(() => {
      connect(
        "MATCH (a)-[r]->(b) RETURN a, labels(a) AS a_labels, r, b, labels(b) AS b_labels LIMIT 100"
      )
        .then((result) => {
          if (!result) return;
  
          const { styledNodes, styledRelationships } = styleGraph(result);
  
          setNodes(styledNodes);
          setRelationships(styledRelationships);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
    useEffect(() => {
        setNodes((prevNodes) =>
          prevNodes.map((node) => ({
            ...node,
            borderColor: selectedNodes.some((n) => n.id === node.id) ? "red" : "black",
            borderWidth: selectedNodes.some((n) => n.id === node.id) ? 5 : 1,
          }))
        );
      }, [selectedNodes]);
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "75vh",
            background: "linear-gradient(to right, white, lightgrey)",
          }}
        >
          <InteractiveNvlWrapper
            ref={nvlRef}
            nodes={nodes}
            rels={relationships}
            mouseEventCallbacks={mouseEventCallbacks}
          />
        </div>
  
        <div style={{ padding: "1rem", background: "#eee" }}>
          <h3>Create Node</h3>
          <input
            placeholder="Node name"
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <select
                value={selectedLabel}
                onChange={(e) => setSelectedLabel(e.target.value)}
                style={{ marginRight: "0.5rem" }}
            >
                <option value="">Select Node Type</option>
                {availableLabels.map((label) => (
                <option key={label} value={label}>{label}</option>
                ))}
            </select>
          <button onClick={createNode}>Add Node</button>
          
            
        
          <div style={{ marginTop: "1rem" }}>
            <h4>Relationship Mode</h4>
            <button
              onClick={() => {
                setCreateMode((prev) => (prev === "relationship" ? "none" : "relationship"));
                setSelectedNodes([]);
              }}
              style={{
                background: createMode === "relationship" ? "#ccc" : "#fff",
                border: "1px solid #888",
                padding: "0.5rem",
              }}
            >
              {createMode === "relationship"
                ? "Cancel Relationship Mode"
                : "Create Relationship Between Two Nodes"}
            </button>
          </div>
          {selectedNode && (
  <div
    style={{
      position: "absolute",
      bottom: 10,
      left: 10,
      background: "#fff",
      padding: "0.5rem",
      border: "1px solid #ccc",
      borderRadius: "8px",
      maxWidth: "90%",
      maxHeight: "40%",
      overflowY: "auto",
    }}
  >
     <h4>Node Info</h4>
    <p><strong>ID:</strong> {selectedNode.id}</p>
    <p><strong>Captions:</strong></p>
    <ul>
      {selectedNode.captions?.map((cap, i) => (
        <li key={i}>{cap.value}</li>
      ))}
    </ul>
    <button onClick={() => setSelectedNode(null)}>Close</button>
  </div>
)}
        </div>
      </>
    );
  };