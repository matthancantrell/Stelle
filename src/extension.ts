import * as vscode from 'vscode'; // VSCode API Module
import { getWebviewContent } from './webview';
import * as Stelle from './stelle';
import { callOpenAI, Analyze, Optimize, Comment, Fill } from './OpenAI_API';
import * as textEditor from './textEditor';
import * as dependencyManager from './dependencyManager';
import * as message from './message';
import * as conversation from './conversation';
import { stelleView } from './stelleView';
/* IMPORTS TO MAKE PROJECT FUNCTION */

var dependencyManagerHasRun = false;
var messages = new conversation.Conversation;
var webviewView: vscode.WebviewView | undefined;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) { // All Commands Will Be Stored In Here. Will Be Run Upon Start.
	
	let webview: vscode.WebviewPanel | undefined = undefined;
	const editor = vscode.window.activeTextEditor;
	var oldMessage: message.Message = new message.Message("", "");
	const interval = 2000;

	// Startup Log To Inform Dev That Extension Is Running
	console.log('SYSTEM: Congratulations, your extension "stelle" is now active!');

	// for(var i = 0; i < 10; i++) {
	// 	messages.addMessage(new message.Message("user", ((i + 1) +"")));
	// 	if(messages.getLength() > 5) {
	// 		console.log("Too many messages. Over by " + (messages.getLength() - 5) + " at " + messages.getMessages()[i].getMessage());
	// 	}
	// }
	// messages.removeOldestMessage();
	// messages.printConversation();

	const provider = new stelleView(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(stelleView.viewType, provider));

	function checkVar() {
		if(provider.getMessage().getRole() !== oldMessage.getRole() && provider.getMessage().getContent() !== oldMessage.getContent()) {
			messages.addMessage(provider.getMessage());
			oldMessage = provider.getMessage();
		}
	}

	const intervalID = setInterval(() => {
		checkVar();
	}, interval);

	context.subscriptions.push(vscode.commands.registerCommand('stelle.t1', () => {
		provider.test1();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('stelle.t2', () => {
		provider.test2();
	}));

	if (!dependencyManagerHasRun) {
		dependencyManager.start();
		dependencyManagerHasRun = true;
	}

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
			provider.OptimizeSend();
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