import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { vscode } from "./vscode";
import { addEdge, Connection, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { useCallback } from "react";

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 

function App() {
  

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
    function handleHowdyClick() {//After clicking the button to add a new node.
      vscode.postMessage({
        command: "ready",
        text: "Hey there partner! 🤠",
      });

      setNodes([
        { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
        { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
        { id: '3', position: { x: 100, y: 100 }, data: { label: '3' } }
      ])
    }
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
 
    return(
    <main>
    <h1>Hello World!</h1>
    <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton>
    
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    </div>
  </main> );
}

export default App
