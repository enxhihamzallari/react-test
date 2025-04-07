import { VSCodeButton, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { vscode } from "./vscode";
import { addEdge, ColorMode, Connection, Panel, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { ChangeEventHandler, FormEvent, useCallback, useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";


const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Manuel' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'Advanced Model Engineering' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];


function App() {
  const [text, setText] = useState("");
  // const [count, setCount] = useState(0);//For nodes?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [colorMode, setColorMode] = useState<ColorMode>('system');
  
  // setColorMode(colorMode as ColorMode);
  
  function addNodeClick() {//After clicking the button to add a new node.
    vscode.postMessage({
      command: "ready",
      text: "Hey there partner! 🤠",
    });
    setText("");
    setNodes([
      { id: '1', position: { x: 0, y: 0 }, data: { label: 'Manuel' } },
      { id: '2', position: { x: 0, y: 100 }, data: { label: 'Advanced Model Engineering' } },
      { id: '3', position: { x: 100, y: 150 }, data: { label: 'Monalisa' } }
    ])
    
  }
  const onChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
    setColorMode(evt.target.value as ColorMode);
  };
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // const form = e.target as HTMLFormElement;

    // const formData = new FormData(form);

    // const position: MeshObject["position"] = {
    //   x: parseFloat(formData.get("positionX") as string) ?? 0,
    //   y: parseFloat(formData.get("positionY") as string) ?? 0,
    //   z: parseFloat(formData.get("positionZ") as string) ?? 0,
    // };

    // const meshObject: MeshObject = {
    //   color: formData.get("color") as string,
    //   id: Math.ceil(Math.random() * 10000),
    //   shape: formData.get("shape") as string,
    //   position,
    // };

    // setMeshObjects((objects) => [...objects, meshObject]);
  }
  
  return(
    <main>
    <div className="w-full flex gap-3">
    <VSCodeTextField
    value={text}
    onChange={(e) => {
      setText((e.target as HTMLInputElement).value);
    }}
    placeholder="Enter command here"
    className="w-1/2"
    />
          <VSCodeButton onClick={addNodeClick}><FaRegCircleCheck /></VSCodeButton>
          </div>

    
    <form
    onSubmit={handleSubmit}
    className="nodrag bg-white border border-pink-500 rounded-sm p-2 grid grid-cols-2 gap-y-2"
    >
    <label htmlFor="text" className="text-pink-500">
    Shape
    </label>
    <select
    id="text"
    name="shape"
    className=" text-gray-400 border rounded-sm"
    >
    <option value="Plane">Plane</option>
    <option value="Box">Box</option>
    <option value="Sphere">Sphere</option>
    <option value="Cone">Cone</option>
    <option value="Cylinder">Cylinder</option>
    <option value="Torus">Torus</option>
    </select>
    
    {/* {["x", "y", "z"].map((axis) => (
      <Fragment key={axis}>
      <label
      className="text-pink-500"
      htmlFor={`position${axis.toUpperCase()}`}
      >
      Position {axis.toUpperCase()}
      </label>
      <input
      className="cursor-pointer"
      type="range"
      id={`position${axis.toUpperCase()}`}
      name={`position${axis.toUpperCase()}`}
      min="-10"
      max="10"
      defaultValue="0"
      />
      </Fragment>
      ))} */}
      
      
      
      <button
      type="submit"
      className="col-span-2 w-fit mx-auto rounded-sm px-1 bg-pink-500 text-white"
      >
      ADD
      </button>
      </form>
      
      <h2>Model</h2>
      
      
      <div style={{ width: '50vw', height: '50vh' }}>
      <ReactFlow 
      nodes={nodes}
      edges={edges}
      colorMode={colorMode}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      >
      <Panel position="top-right" hidden>
      <select onChange={onChange} data-testid="colormode-select">
      <option value="system">system</option>
      </select>
      </Panel>
      </ReactFlow>
      </div>
      
      </main> );
    }
    
    export default App
    