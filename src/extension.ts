import { commands, ExtensionContext } from "vscode";
import { RunPanel } from "./panels/RunPanel";

export function activate(context: ExtensionContext) {
  // Add command to the extension context
  context.subscriptions.push(
	commands.registerCommand("react-test.run", () => {
    RunPanel.render(context.extensionUri);
  })
);
}