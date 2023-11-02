import * as vscode from 'vscode'; // VSCode API Module

import { getWebviewContent } from './webview';
import * as Stelle from './stelle';
import { callOpenAI, Analyze, Optimize } from './OpenAI_API';
import * as textEditor from './textEditor';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) { // All Commands Will Be Stored In Here. Will Be Run Upon Start.

	let webview: vscode.WebviewPanel | undefined = undefined;
	const editor = vscode.window.activeTextEditor;

	// Startup Log To Inform Dev That Extension Is Running
	console.log('SYSTEM: Congratulations, your extension "stelle" is now active!');

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

//	#region stelle.analyze
	context.subscriptions.push(
		vscode.commands.registerCommand('stelle.analyze', async () => {

			console.log("'stelle.analyze' starting..."); // Inform Dev That 'stelle.analyze' Has Started
			if (!editor) { // If The 'editor' Variable Is NOT Set
				vscode.window.showInformationMessage('No text editor is active.'); // Inform The User That There Is No Editor Active
				console.log("'stelle.analyze' ending..."); // Inform Dev That 'stelle.analyze' Has Ended
				return; // End The Function
			}

			const selectedText = editor.document.getText(editor.selection); // Select Text From Whatever The User Has Highlighted
			if (!selectedText) { // If There Is No Selected Text
				vscode.window.showInformationMessage('No code is selected.'); // Inform The User That There Is No Selected Text / Code
				console.log("'stelle.analyze' ending..."); // Inform Dev That 'stelle.analyze' Has Ended
				return; // End The Function
			}

			console.log("Successfully grabbed text from editor. Passing To API..."); // Inform The User That The Text Was Successfully Received
			vscode.window.withProgress({ // This Function Will Begin The Progress Bar
				location: vscode.ProgressLocation.Notification, // Make It A Notification
				title: 'Stelle has begun to analyze your code!', // This Title Will Be What The User Sees
				cancellable: false, // The User Cannot Cancel This Notification
			}, async (progress) => { // Progress Will Be Used Based On The Async Promise
				try {
					const response = await Analyze(selectedText); // 
					if (response) {
						console.log(response);
						const json = JSON.parse(response);
						console.log(json);
						const explanation = json.response;
						if (explanation) {
							console.log("Explanation parsed from json...");
						}
						const code = json.code;
						if (code) {
							console.log("Code parsed from json...");
						}

						editor.edit((editBuilder) => {
							editBuilder.replace(editor.selection, code);
							vscode.window.showInformationMessage("Stelle has analyzed your code!");
						});
						console.log("'stelle.analyze' ending...");
						return Promise.resolve();
					}
				} catch (error: any) {
					console.error(error); // Log the error for debugging
					vscode.window.showErrorMessage(`An error has occurred: ${error.message}`);
					console.log("'stelle.analyze' ending...");
					return Promise.reject(error);
				}
			});
		}));
//	#endregion

	context.subscriptions.push(
		vscode.commands.registerCommand('stelle.optimize', async () => {
			console.log("'stelle.optimize' starting...");
			if (editor) {
				const selectedText = editor.document.getText(editor.selection);
				if (selectedText) {
					const response = await Optimize(selectedText);
					if (response) {
						console.log(response);
						const explanation = response.response;
						console.log("Explanation parsed from json...");
						const code = response.code;
						console.log("Code parsed from response...");

						if (explanation && code) { console.log("Response parsed..."); }

						editor.edit((editBuilder) => {
							editBuilder.replace(editor.selection, code);
						});
					}
				}
			}
			console.log("'stelle.optimize' ending...");
		}));
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log("SYSTEM: Shutting Down...");
}
