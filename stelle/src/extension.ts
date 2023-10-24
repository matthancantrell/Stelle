import * as vscode from 'vscode'; // VSCode API Module

import { getWebviewContent } from './webview';
import * as Stelle from './stelle';
import { callOpenAI } from './OpenAI_API';
import * as textEditor from './textEditor';
import { escape } from 'querystring';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) { // All Commands Will Be Stored In Here. Will Be Run Upon Start.

	let webview: vscode.WebviewPanel | undefined = undefined;
	const editor = vscode.window.activeTextEditor;

	// Startup Log To Inform Dev That Extension Is Running
	console.log('SYSTEM: Congratulations, your extension "stelle" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	//#region stelle.helloWorld
	let disposable = vscode.commands.registerCommand('stelle.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Ask Stelle code related questions!');
	});
	context.subscriptions.push(disposable);
	//#endregion
	//#region stelle.testCommand
	const testCommand = 'stelle.testCommand';
	const commandHandler = (name: string = 'Stelle') => {
		console.log(`Hello ${name}!!!`);
	};
	context.subscriptions.push(vscode.commands.registerCommand(testCommand, commandHandler));
	//#endregion
	//#region stelle.start
	context.subscriptions.push(
		vscode.commands.registerCommand('stelle.start', async () => {

			if (webview) {
				webview.reveal(vscode.ViewColumn.Two);
			} else {
				// Create & Show New Webview
				webview = vscode.window.createWebviewPanel(
					'stelle', // Identifies type of webview. Internal use.
					'Stelle', // Title of the panel. Displayed to user
					vscode.ViewColumn.Two, // Editor Column to show the new webview panel within
					{
						enableScripts: true
					} // Webview options go here
				);
				webview.webview.html = await getWebviewContent();
				webview.onDidDispose(
					() => {
						webview = undefined;
					},
					undefined,
					context.subscriptions
				);
			}

			webview.webview.onDidReceiveMessage(async message => {
				console.log('SYSTEM: Message Received...');
				if (message.command === 'submitUserData') {
					const userData = message.data;

					console.log('User:', userData);
					var stelleData = await callOpenAI(userData);

					webview?.webview.postMessage({ command: 'update', data: stelleData });
					
					if (editor) {
						
						// const lineNumber = 5;
						// var codeToInsert;
						// if (stelleData) {
						// 	codeToInsert = stelleData["code"];
						// }
						// //const codeToInsert = 'Hello from Stelle!';

						// const insert = new vscode.TextEdit(
						// 	new vscode.Range(new vscode.Position(lineNumber, 0), new vscode.Position(lineNumber, 0)),
						// 	codeToInsert
						// );

						// const edit = new vscode.WorkspaceEdit();
						// edit.set(editor.document.uri, [insert]);
						// vscode.workspace.applyEdit(edit);

						if (stelleData) {
							textEditor.insertCodeAtCurrentLocation(stelleData["code"], editor);
						}
					}
				} else {
					console.log(message.data);
				}
			});

			webview.webview.postMessage({ command: 'updateStelleHTML' });
		})
	);
	//#endregion
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log("SYSTEM: Shutting Down...");
}
