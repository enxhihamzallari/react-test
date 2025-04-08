import { useState } from "react";
import { InteractiveNvlWrapper, MouseEventCallbacks } from "@neo4j-nvl/react";
import { Node, Relationship } from "@neo4j-nvl/base";
import { VSCodeButton, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

export function App2() {
  const [text, setText] = useState("");
  const [nodes, setNodes] = useState<Node[]>([
    { id: "0", caption: "Jonny" },
    { id: "1", caption: "Advanced Model Engineering" },
  ]);
  const [relationships, setRelationships] = useState<Relationship[]>([
    { from: "0", to: "1", id: "10", caption: "is taking" },
  ]);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);

  const addNode = () => {
    const newNode = { id: String(nodes.length), caption: text };
    setNodes([...nodes, newNode]);
    setText("");
  };

  const addRelationship = () => {
    if (selectedNodes.length === 2 && text.trim()) {
      const from = selectedNodes[0].id;
      const to = selectedNodes[1].id;
      const newRel: Relationship = {
        id: String(Date.now()), // Simple unique ID
        from,
        to,
        caption: text,
      };
      setRelationships([...relationships, newRel]);
      setSelectedNodes([]);
      setText("");
    }
  };

  const mouseEventCallbacks: MouseEventCallbacks = {
    onNodeClick: (node: Node) => {
      setSelectedNodes((prev) => {
        const alreadySelected = prev.find((n) => n.id === node.id);
        if (alreadySelected) {
          return prev.filter((n) => n.id !== node.id);
        }
        if (prev.length < 2) return [...prev, node];
        return [node]; // Reset if already 2 selected
      });
    },
    onHover: (element, hitTargets, evt) => {
      console.log("onHover", element, hitTargets, evt);
    },
    onRelationshipClick: (rel, hitTargets, evt) => {
      console.log("onRelationshipClick", rel, hitTargets, evt);
    },
    onCanvasClick: (evt) => console.log("onCanvasClick", evt),
    onDrag: (nodes) => console.log("onDrag", nodes),
    onZoom: (zoomLevel) => console.log("onZoom", zoomLevel),
  };

  return (
    <div style={{ width: "100%", height: "75vh" }}>
      <div className="w-full flex gap-3 mb-2">
        <VSCodeTextField
          value={text}
          onChange={(e) => {
            setText((e.target as HTMLInputElement).value);
          }}
          placeholder="Enter node name or relationship label"
          className="w-1/2"
        />
        <VSCodeButton onClick={addNode}>Add Node</VSCodeButton>
        <VSCodeButton onClick={addRelationship} disabled={selectedNodes.length !== 2 || !text}>
          Connect Selected Nodes
        </VSCodeButton>
      </div>

      <InteractiveNvlWrapper
        nvlOptions={{ initialZoom: 3 }}
        nodes={nodes}
        rels={relationships}
        mouseEventCallbacks={mouseEventCallbacks}
      />
    </div>
  );
}
