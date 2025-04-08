import { useState } from "react";
import { InteractiveNvlWrapper, MouseEventCallbacks } from "@neo4j-nvl/react";
import { HitTargets, Node, Relationship } from "@neo4j-nvl/base";
import { VSCodeButton, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

export function App() {
  const [text, setText] = useState("");
  const [nodes, setNodes ] = useState<Node[]>([
    { id: "0", caption: "Jonny" },
    { id: "1", caption: "Advanced Model Engineering" },
  ]);
  
  const [relationships, ] = useState<Relationship[]>([
    { from: "0", to: "1", id: "10", caption: "is taking" },
  ]);
  const addElements = () => {
    const newNodes = [...nodes, { id: String(nodes.length), caption: text }]
    setNodes(newNodes)
  }
  const mouseEventCallbacks: MouseEventCallbacks = {
    onHover: (element: Node | Relationship, hitTargets: HitTargets, evt: MouseEvent) =>
      console.log('onHover', element, hitTargets, evt),
    onRelationshipRightClick: (rel: Relationship, hitTargets: HitTargets, evt: MouseEvent) =>
      console.log('onRelationshipRightClick', rel, hitTargets, evt),
    onNodeClick: (node: Node, hitTargets: HitTargets, evt: MouseEvent) =>
      console.log('onNodeClick', node, hitTargets, evt),
    onNodeRightClick: (node: Node, hitTargets: HitTargets, evt: MouseEvent) =>
      console.log('onNodeRightClick', node, hitTargets, evt),
    onNodeDoubleClick: (node: Node, hitTargets: HitTargets, evt: MouseEvent) =>
      console.log('onNodeDoubleClick', node, hitTargets, evt),
    onRelationshipClick: (rel: Relationship, hitTargets: HitTargets, evt: MouseEvent) =>
      console.log('onRelationshipClick', rel, hitTargets, evt),
    onRelationshipDoubleClick: (rel: Relationship, hitTargets: HitTargets, evt: MouseEvent) =>
      console.log('onRelationshipDoubleClick', rel, hitTargets, evt),
    onCanvasClick: (evt: MouseEvent) => console.log('onCanvasClick', evt),
    onCanvasDoubleClick: (evt: MouseEvent) => console.log('onCanvasDoubleClick', evt),
    onCanvasRightClick: (evt: MouseEvent) => console.log('onCanvasRightClick', evt),
    onDrag: (nodes: Node[]) => console.log('onDrag', nodes),
    onZoom: (zoomLevel: number) => console.log('onZoom', zoomLevel)
  }
  return (
    <div style={{ width: "100%", height: "75vh" }}>
      <div className="w-full flex gap-3">
		<VSCodeTextField
		value={text}
		onChange={(e) => {
			setText((e.target as HTMLInputElement).value);
		}}
		placeholder="Enter command here"
		className="w-1/2"
		/>
      <VSCodeButton onClick={addElements}>Add a new Node</VSCodeButton> 
      </div>
      <InteractiveNvlWrapper
        nvlOptions={{ initialZoom: 3 }}
        nodes={nodes}
        rels={relationships}
        mouseEventCallbacks={mouseEventCallbacks}
        
      />
    </div>
  );
};