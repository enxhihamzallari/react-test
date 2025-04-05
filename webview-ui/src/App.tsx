import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { vscode } from "./vscode";

function App() {
  
    function handleHowdyClick() {
      vscode.postMessage({
        command: "ready",
        text: "Hey there partner! 🤠",
      });
    }

    return(
    <main>
    <h1>Hello World!</h1>
    <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton>
  </main> );
}

export default App
