import * as vscode from 'vscode'; // VSCode API Module
import { getWebviewContent } from './webview';
import * as Stelle from './stelle';
import { callOpenAI, Analyze, Optimize, Comment, Fill } from './OpenAI_API';
import * as textEditor from './textEditor';
import * as dependencyManager from './dependencyManager';
/* IMPORTS TO MAKE PROJECT FUNCTION */

var dependencyManagerHasRun = false;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) { // All Commands Will Be Stored In Here. Will Be Run Upon Start.
	
	let webview: vscode.WebviewPanel | undefined = undefined;
	const editor = vscode.window.activeTextEditor;

	// Startup Log To Inform Dev That Extension Is Running
	console.log('SYSTEM: Congratulations, your extension "stelle" is now active!');

	if (!dependencyManagerHasRun) {
		dependencyManager.start();
		dependencyManagerHasRun = true;
	}

	//#region stelle.start
	context.subscriptions.push(
		vscode.commands.registerCommand('stelle.start', async () => {

			if (webview) { webview.reveal(vscode.ViewColumn.Two); } 
			else {
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
				webview.onDidDispose(() => { webview = undefined; },
					undefined,
					context.subscriptions
				);
			}

			webview.webview.onDidReceiveMessage(async message => {
				//Log a confirmation message when a message is received
				console.log('SYSTEM: Message Received...');
				//Check for the 'submitUserData' command in the received message
				if (message.command === 'submitUserData') {
					//Store the user data from the message
					const userData = message.data;
					//Log the received user data
					console.log('User:', userData);
					//Call OpenAI function using the user's data
					var stelleData = await callOpenAI(userData);

					//Post the data returned from OpenAI back to the webview
					webview?.webview.postMessage({ command: 'update', data: stelleData });
					
					//If the editor is valid '
					if (editor) {
						console.log("Editor is valid");
						//If data from the OpenAI function is valid, insert this data as code at the current location in the text editor
						if (stelleData) { textEditor.insertCodeAtCurrentLocation(stelleData["code"], editor); }
					}
				} else { console.log(message.data); } // If the command is not 'submitUserData', log the message data
			});
			// Sending the 'updateStelleHTML' command back to webview 
			webview.webview.postMessage({ command: 'updateStelleHTML' });
		})
	);
	//#endregion

//	#region stelle.analyze
	context.subscriptions.push(
		vscode.commands.registerCommand('stelle.analyze', async () => {

			console.log("'stelle.analyze' starting..."); // Inform Dev That 'stelle.analyze' Has Started

			if (!editor) { // If The 'editor' Variable Is NOT Set
				vscode.window.showWarningMessage('No text editor is active.'); // Inform The User That There Is No Editor Active
				console.log("'stelle.analyze' ending..."); // Inform Dev That 'stelle.analyze' Has Ended
				return; // End The Function
			}

			var selectedText = editor.document.getText(editor.selection); // Select Text From Whatever The User Has Highlighted
			if (!selectedText) { // If There Is No Selected Text
				console.log('No code provided. Asking User To Provide File...');
				const choice = await vscode.window.showInformationMessage('No code is selected. Would you like to analyze the entire file?',
				'Yes',
				'No'
				);

				if (choice === 'Yes') { // If the User Wants To Provide Entire File...
					console.log('Grabbing all code from page...'); // Inform Dev That All Code Is Being Grabbed From Page
					await vscode.commands.executeCommand("editor.action.selectAll"); // This Await Ensures The Code Waits Until The Selection Is Complete Before Proceeding
					selectedText = editor.document.getText(editor.selection); // Update 'selectedText' With Entire File
				} else { // If The User Does Not Provide Any Code
					vscode.window.showErrorMessage('Stelle is unable to analyze without code provided. Please try again.'); // Inform The User That The Code Cannot Be Analyzed
					console.log("'stelle.analyze' ending..."); // Inform Dev That 'stelle.analyze' Has Ended
					return; // End The Function
				}
			}

			if (selectedText) {
				console.log("Successfully captured data from editor. Passing To API..."); // Inform The User That The Text Was Successfully Received
				vscode.window.withProgress({ // This Function Will Begin The Progress Bar
					location: vscode.ProgressLocation.Notification, // Make It A Notification
					title: 'Stelle has begun to analyze your code!', // This Title Will Be What The User Sees
					cancellable: false, // The User Cannot Cancel This Notification
				}, async (progress) => { // Progress Will Be Used Based On The Async Promise
					try {
						const json = await Analyze(selectedText); // 
						if (json) {
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
			} else {
				vscode.window.showErrorMessage('Unable to analyze without code provided. Please try again.');
			}
		}));
//	#endregion

//	#region stelle.optimize 
	context.subscriptions.push(
		vscode.commands.registerCommand('stelle.optimize', async () => {
			
			console.log("'stelle.optimize' starting...");

			if (!editor) { // If The 'editor' Variable Is NOT Set
				vscode.window.showWarningMessage('No text editor is active.'); // Inform The User That There Is No Editor Active
				console.log("'stelle.optimize' ending because no active editor..."); // Inform Dev That 'stelle.analyze' Has Ended
				return; // End The Function
			}

			var selectedText = editor.document.getText(editor.selection); // Select Text From Whatever The User Has Highlighted
			if (!selectedText) { // If There Is No Selected Text
				console.log('No code provided. Asking User To Provide File...');
				const choice = await vscode.window.showInformationMessage('No code is selected. Would you like to optimize the entire file?',
				'Yes',
				'No'
				);

				if (choice === 'Yes') { // If the User Wants To Provide Entire File...
					console.log('Grabbing all code from page...'); // Inform Dev That All Code Is Being Grabbed From Page
					await vscode.commands.executeCommand("editor.action.selectAll"); // This Await Ensures The Code Waits Until The Selection Is Complete Before Proceeding
					selectedText = editor.document.getText(editor.selection); // Update 'selectedText' With Entire File
				} else { // If The User Does Not Provide Any Code
					vscode.window.showErrorMessage('Stelle is unable to analyze without code provided. Please try again.'); // Inform The User That The Code Cannot Be Analyzed
					console.log("'stelle.optimize' ending because no provided code..."); // Inform Dev That 'stelle.analyze' Has Ended
					return; // End The Function
				}
			}

			if (selectedText) {

				console.log("Successfully captured data from editor. Passing to API...");

				vscode.window.withProgress({ // This Function Will Begin The Progress Bar
					location: vscode.ProgressLocation.Notification, // Make It A Notification
					title: 'Stelle has begun to optimize your code!', // This Title Will Be What The User Sees
					cancellable: false, // The User Cannot Cancel This Notification
				}, async (progress) => { // Progress Will Be Used Based On The Async Promise
					try {
						const response = await Optimize(selectedText);
						if (response) {

							const explanation = response.response;
							if (explanation) {
								console.log("Explanation parsed from json...");
							}
							
							const code = response.code;
							if (code) {
								console.log("Code parsed from json...");
							}
	
							editor.edit((editBuilder) => {
								editBuilder.replace(editor.selection, code);
								vscode.window.showInformationMessage("Stelle has optimized your code!");
							});
							console.log("'stelle.optimize' ending...");
							return Promise.resolve();
						}
					} catch (error: any) {
						console.error(error); // Log the error for debugging
						vscode.window.showErrorMessage(`An error has occurred: ${error.message}`);
						console.log("'stelle.optimize' ending due to error...");
						return Promise.reject(error);
					}
				});	
			} else {
				vscode.window.showErrorMessage('Unable to optimize without code provided. Please try again.');
			}
		}));
//	#endregion

//	#region stelle.comment
context.subscriptions.push(
	vscode.commands.registerCommand('stelle.comment', async () => {
		
		console.log("'stelle.comment' starting...");

		if (!editor) { // If The 'editor' Variable Is NOT Set
			vscode.window.showWarningMessage('No text editor is active.'); // Inform The User That There Is No Editor Active
			console.log("'stelle.comment' ending because no active editor..."); // Inform Dev That 'stelle.comment' Has Ended
			return; // End The Function
		}

		var selectedText = editor.document.getText(editor.selection); // Select Text From Whatever The User Has Highlighted
		if (!selectedText) { // If There Is No Selected Text
			console.log('No code provided. Asking User To Provide File...');
			const choice = await vscode.window.showInformationMessage('No code is selected. Would you like to comment on the entire file?',
			'Yes',
			'No'
			);

			if (choice === 'Yes') { // If the User Wants To Provide Entire File...
				console.log('Grabbing all code from page...'); // Inform Dev That All Code Is Being Grabbed From Page
				await vscode.commands.executeCommand("editor.action.selectAll"); // This Await Ensures The Code Waits Until The Selection Is Complete Before Proceeding
				selectedText = editor.document.getText(editor.selection); // Update 'selectedText' With Entire File
			} else { // If The User Does Not Provide Any Code
				vscode.window.showErrorMessage('Stelle is unable to comment without code provided. Please try again.'); // Inform The User That The Code Cannot Be Commented Upon
				console.log("'stelle.comment' ending because no provided code..."); // Inform Dev That 'stelle.comment' Has Ended
				return; // End The Function
			}
		}

		if (selectedText) {

			console.log("Successfully captured data from editor. Passing to API...");

			vscode.window.withProgress({ // This Function Will Begin The Progress Bar
				location: vscode.ProgressLocation.Notification, // Make It A Notification
				title: 'Stelle has begun to comment on your code!', // This Title Will Be What The User Sees
				cancellable: false, // The User Cannot Cancel This Notification
			}, async (progress) => { // Progress Will Be Used Based On The Async Promise
				try {
					const response = await Comment(selectedText);
					if (response) {

						const explanation = response.response;
						if (explanation) {
							console.log("Explanation parsed from json...");
						}
						
						const code = response.code;
						if (code) {
							console.log("Code parsed from json...");
						}

						editor.edit((editBuilder) => {
							editBuilder.replace(editor.selection, code);
							vscode.window.showInformationMessage("Stelle has commented on your code!");
						});
						console.log("'stelle.comment' ending...");
						return Promise.resolve();
					}
				} catch (error: any) {
					console.error(error); // Log the error for debugging
					vscode.window.showErrorMessage(`An error has occurred: ${error.message}`);
					console.log("'stelle.comment' ending due to error...");
					return Promise.reject(error);
				}
			});	
		} else {
			vscode.window.showErrorMessage('Unable to comment without code provided. Please try again.');
		}
	}));
//	#endregion

//	#region stelle.fill
context.subscriptions.push(
	vscode.commands.registerCommand('stelle.fill', async () => {
		
		console.log("'stelle.fill' starting...");

		if (!editor) { // If The 'editor' Variable Is NOT Set
			vscode.window.showWarningMessage('No text editor is active.'); // Inform The User That There Is No Editor Active
			console.log("'stelle.comment' ending because no active editor..."); // Inform Dev That 'stelle.comment' Has Ended
			return; // End The Function
		}

		var selectedText = editor.document.getText(editor.selection); // Select Text From Whatever The User Has Highlighted
		if (!selectedText) { // If There Is No Selected Text
			console.log('No code provided. Asking User To Provide File...');
			const choice = await vscode.window.showInformationMessage('No code is selected. Would you like to comment on the entire file?',
			'Yes',
			'No'
			);

			if (choice === 'Yes') { // If the User Wants To Provide Entire File...
				console.log('Grabbing all code from page...'); // Inform Dev That All Code Is Being Grabbed From Page
				await vscode.commands.executeCommand("editor.action.selectAll"); // This Await Ensures The Code Waits Until The Selection Is Complete Before Proceeding
				selectedText = editor.document.getText(editor.selection); // Update 'selectedText' With Entire File
			} else { // If The User Does Not Provide Any Code
				vscode.window.showErrorMessage('Stelle is unable to comment without code provided. Please try again.'); // Inform The User That The Code Cannot Be Commented Upon
				console.log("'stelle.comment' ending because no provided code..."); // Inform Dev That 'stelle.comment' Has Ended
				return; // End The Function
			}
		}

		if (selectedText) {

			console.log("Successfully captured data from editor. Passing to API...");

			vscode.window.withProgress({ // This Function Will Begin The Progress Bar
				location: vscode.ProgressLocation.Notification, // Make It A Notification
				title: 'Stelle has begun to comment on your code!', // This Title Will Be What The User Sees
				cancellable: false, // The User Cannot Cancel This Notification
			}, async (progress) => { // Progress Will Be Used Based On The Async Promise
				try {
					const response = await Fill(selectedText);
					if (response) {

						const explanation = response.response;
						if (explanation) {
							console.log("Explanation parsed from json...");
						}
						
						const code = response.code;
						if (code) {
							console.log("Code parsed from json...");
						}

						editor.edit((editBuilder) => {
							editBuilder.replace(editor.selection, code);
							vscode.window.showInformationMessage("Stelle has commented on your code!");
						});
						console.log("'stelle.comment' ending...");
						return Promise.resolve();
					}
				} catch (error: any) {
					console.error(error); // Log the error for debugging
					vscode.window.showErrorMessage(`An error has occurred: ${error.message}`);
					console.log("'stelle.comment' ending due to error...");
					return Promise.reject(error);
				}
			});	
		} else {
			vscode.window.showErrorMessage('Unable to comment without code provided. Please try again.');
		}
	}));
//	#endregion
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log("SYSTEM: Shutting Down...");
}
