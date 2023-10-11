import * as vscode from 'vscode'; // VSCode API Module

import { getWebviewContent } from './webview';
import * as Stelle from './stelle';
import { callOpenAI } from './OpenAI_API';
import { Console } from 'console';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Startup Log To Inform Dev That Extension Is Running
	console.log('Congratulations, your extension "stelle" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('stelle.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Ask Stelle code related questions!');
	});

	context.subscriptions.push(disposable);

	const testCommand = 'stelle.testCommand';
	const commandHandler = (name: string = 'Stelle') => {
		console.log(`Hello ${name}!!!`);
	};

	context.subscriptions.push(vscode.commands.registerCommand(testCommand, commandHandler));

	context.subscriptions.push(
		vscode.commands.registerCommand('stelle.start', () => {
			// Create & Show New Webview
			const panel = vscode.window.createWebviewPanel(
				'stelle', // Identifies type of webview. Internal use.
				'Stelle', // Title of the panel. Displayed to user
				vscode.ViewColumn.Two, // Editor Column to show the new webview panel within
				{
					enableScripts: true
				} // Webview options go here
			);

			panel.webview.onDidReceiveMessage(message => {
				console.log('Message Received...');
				if (message.command === 'submitUserData') {
					const userData = message.data;

					console.log('Received data from webview:', userData);

					console.log("Before handle");
					callOpenAI();
					console.log("After handle");
				}
			});

			panel.webview.html = getWebviewContent();
		})
	);
}

export function handleInput(input : string) {
	console.log('Entering handleInput');
	console.log('Stelle: Did you say "' + input + '"?');
	console.log('Exiting handleInput');
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log("Shutting Down...");
}
