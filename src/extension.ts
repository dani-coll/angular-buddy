// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getLineToAddFunction } from './component-inspector';
import { addFunction } from './file-editor';
import { getComponentDocument, getCurrentComponentName, getCurrentFolderRelativePath, getWorkspaceDocuments } from './workspace';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	if (vscode.window.activeTextEditor) {
		const activeEditorAbsolutePath = vscode.window.activeTextEditor.document.uri.fsPath;

		if (activeEditorAbsolutePath.endsWith(".html")) {
			const componentName = getCurrentComponentName(activeEditorAbsolutePath);
			const folderPath = getCurrentFolderRelativePath(activeEditorAbsolutePath);

			const tsDocs: vscode.TextDocument[] = await getWorkspaceDocuments(`${folderPath}/${componentName}*.ts`, "**/*.spec.ts");
			const componentDoc = getComponentDocument(tsDocs);

			const functionName = 'sampleFunction';
			const functionParameters: string[] = []; 
			if (componentDoc) {
				const lineToEdit = getLineToAddFunction(functionName, componentDoc);

				if (lineToEdit !== undefined) {
					addFunction(functionName, componentDoc, lineToEdit, functionParameters);
				}
			}
		}
	}

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "angular-buddy" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('angular-buddy.createFunctionOnComponent', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Angular Buddy!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
