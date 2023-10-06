// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
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
				vscode.ViewColumn.One, // Editor Column to show the new webview panel within
				{} // Webview options go here
			);
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
