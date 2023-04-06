// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { log } from "console";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "gitpod-config-generator" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "gitpod-config-generator.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from gitpod-config-generator!"
      );
    }
  );

  let addConfigFile = vscode.commands.registerCommand(
    "gitpod-config-generator.addConfigFile",
    () => {
      vscode.window.showInformationMessage("Add Gitpod config file");
    }
  );

  let generateConfig = vscode.commands.registerCommand(
    "gitpod-config-generator.generateConfig",
    () => {
      vscode.window
        .showInputBox({
          placeHolder: "Select language",
          ignoreFocusOut: true,
          prompt: "Select language",
          value: "javascript",
        })
        .then((language) => {
          vscode.window
            .showInputBox({
              placeHolder: "Select framework",
              ignoreFocusOut: true,
              prompt: "Select framework",
              value: "react",
            })
            .then((framework) => {
              vscode.workspace
                .openTextDocument({
                  content: `# List the start up tasks. Learn more: https://www.gitpod.io/docs/configure/workspaces/tasks
tasks:
  - name: Script Task
    init: echo 'init script' # runs during prebuild => https://www.gitpod.io/docs/configure/projects/prebuilds
    command: echo 'start script'

# List the ports to expose. Learn more: https://www.gitpod.io/docs/configure/workspaces/ports
ports:
  - name: Frontend
    description: Port 3000 for the frontend
    port: 3000
    onOpen: open-preview
`,
                  language: "yaml",
                })
                .then((doc) => {
                  vscode.window.showTextDocument(doc);
                });
            });
        });

      vscode.window.showInformationMessage("Generate Gitpod config file");
    }
  );

  let selectLanguage = vscode.commands.registerCommand(
    "gitpod-config-generator.selectLanguage",
    () => {
      // add a checkbox to select some options for language and framework & then excute a command to create new file named as .gitpod.yml
      vscode.window
        .showQuickPick(["javascript or typescript", "go"])
        .then((language) => {
          const workspaceFolders = vscode.workspace.workspaceFolders || [];
          let fileContent = "hello world";
          if (!workspaceFolders) {
            vscode.window.showErrorMessage("No workspace folder found.");
            // return;
          }

          // log workspace folders
          workspaceFolders?.forEach((folder) => {
            console.log(folder.uri.fsPath);
            vscode.window.showInformationMessage(folder.uri.fsPath);
          });

          if (language === "javascript or typescript") {
            fileContent = `# List the start up tasks. Learn more: https://www.gitpod.io/docs/configure/workspaces/tasks
tasks:
  - name: Script Task
    init: echo 'init script' # runs during prebuild => https://www.gitpod.io/docs/configure/projects/prebuilds
    command: echo 'start script'

# List the ports to expose. Learn more: https://www.gitpod.io/docs/configure/workspaces/ports
ports:
  - name: Frontend
    description: Port 3000 for the frontend
    port: 3000
    onOpen: open-preview
`;
          } else if (language === "go") {
            fileContent = `# List the start up tasks. Learn more: https://www.gitpod.io/docs/configure/workspaces/tasks
tasks:
  - name: Script Task
    init: go mod download # runs during prebuild => https://www.gitpod.io/docs/configure/projects/prebuilds
    command: go run ./... 

vscode:
  extensions:
    - golang.Go
`;
          } else {
            fileContent = `# Learn more about this file: https://www.gitpod.io/docs/introduction/learn-gitpod/gitpod-yaml`;
          }

          const rootPath = workspaceFolders[0].uri.fsPath;
          const fileName = ".gitpod.yml";
          const filePath = path.join(rootPath, fileName);
          fs.writeFile(filePath, fileContent, function (err) {
            if (err) {
              vscode.window.showErrorMessage(
                "Error creating YAML file: " + err.message
              );
            } else {
              vscode.workspace.openTextDocument(filePath).then((document) => {
                const edit = new vscode.WorkspaceEdit();
                edit.insert(
                  document.uri,
                  new vscode.Position(0, 0),
                  "# This is a dummy YAML file\n\n"
                );
                return vscode.workspace.applyEdit(edit).then(() => {
                  vscode.window.showTextDocument(document);
                });
              });
              vscode.window.showInformationMessage(
                "Generated Gitpod config file"
              );
            }
          });
        });
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(addConfigFile);
  context.subscriptions.push(generateConfig);
  context.subscriptions.push(selectLanguage);
}

// This method is called when your extension is deactivated
export function deactivate() {}
