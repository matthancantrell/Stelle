import { ChatAPI } from './OpenAI_API';
import * as vscode from 'vscode';
import * as textEditor from './textEditor';
import { AnyTxtRecord } from 'dns';

// Integration of both API's should go in this file.

export class Stelle {

    //#region <-- CLASS SETUP -->
    chat: ChatAPI;
    editor: any;

    constructor() {
        this.chat = new ChatAPI(this.getOpenAIKey());
        this.editor = vscode.window.activeTextEditor;
    }
    //#endregion

    getLevelOfAssistance() {
        const configName = 'stelle.levelOfAssistance';
        const config = vscode.workspace.getConfiguration();
        const selectedValue = config.get(configName);
        
        if (selectedValue === "Give Me Code") { return "Give Me Code"; }
        if (selectedValue === "Teach Me How To Code") { return "Teach Me How To Code"; }
    }

    getEditor() {
        if (vscode.window.activeTextEditor) {
            this.editor = vscode.window.activeTextEditor;
            return this.editor;
        } else {
            vscode.window.showWarningMessage("No text editor available.");
            return null;
        }
    }

    getOpenAIKey(): string {
        if (process.env.OPENAI_API_KEY) 
        {
            return process.env.OPENAI_API_KEY;
        } else
        {
            return "";
        }
    }

    editorIsValid(): Boolean {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            return true;
        } else {
            vscode.window.showErrorMessage("No active text editor found. Please try again.");
            return false;
        }
    }

    levelOfAssistanceSwitch() {
        var levelOfAssistance = this.getLevelOfAssistance();

        switch(levelOfAssistance) {
            case "Give Me Code": {
                break;
            }
            case "Teach Me How To Code": {
                
            }
        }
    }

    async getSelectedText() {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            var selectedText = editor.document.getText(editor.selection);
            if (!selectedText) {
                const choice = await vscode.window.showWarningMessage('Nothing selected. Select entire file?',
				'Yes',
				'No');

                if (choice === 'Yes') {
                    await vscode.commands.executeCommand("editor.action.selectAll");
                    selectedText = editor.document.getText(editor.selection);
                    return selectedText;
                } else {
                    vscode.window.showErrorMessage("Stelle cannot help without input.");
                    return;
                }
            }
            else {
                return selectedText;
            }
        }
    }

    returnErrorString(command: string): string {
        return "Stelle " + command + ": There was an error capturing data from the API! Please try again or report your error to the extension store page.";
    }

    async handleCommand(command: string) {

        var input: string | undefined;
        if(this.editorIsValid()) {
            input = await this.getSelectedText();
        }

        if (input) {
            var response: any;

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Stelle has begun to " + command.toLocaleLowerCase() + " your code!",
                cancellable: false,
            }, async (progress) => {
                switch(command) {
                    case "Analyze": {
                        console.log("<-- ANALYZE -->");
                        response = await this.chat.Analyze(input + '');
                        break;
                    }
                    case "Optimize": {
                        console.log("<-- OPTIMIZE -->");
                        response = await this.chat.Optimize(input + '');
                        break;
                    }
                    case "Fill": {
                        console.log("<-- FILL -->");
                        response = await this.chat.Fill(input + '');
                        break;
                    }
                    case "Comment": {
                        console.log("<-- COMMENT -->");
                        response = await this.chat.Comment(input + '');
                        break;
                    }
                    case "Debug": {
                        console.log("<-- DEBUG -->");
                        response = await this.chat.Debug(input + '');
                        break;
                    }
                }

                if (response) {

                    const explanation = response.response;
                    if (explanation) {
                        vscode.window.showInformationMessage("Stelle " + command + ": " + explanation);
                    } else {
                        vscode.window.showErrorMessage(this.returnErrorString(command));
                    }

                    const codeProvided = response.codeProvided;
                    if (codeProvided) {
                        const code = response.code;
                        if (code) {
                            this.getEditor();
                            if (this.editor) {
                                const choice = await vscode.window.showInformationMessage("Would you like to add Stelle's code to your project? If you are unsatisfied with what you get, pressing `ctrl + z` will undo the effect.",
                                "Yes",
                                "No");

                                if (choice === 'Yes') {
                                    vscode.window.withProgress({ // Create A Loading Notification
                                        location: vscode.ProgressLocation.Notification, // Specify Where
                                        title: "Adding Code...", // Specify What
                                        cancellable: false // Don't Allow The User To Cancel This Process
                                    }, async (progress) => { // Async Due To Needing Other Function To Resolve
                                        await textEditor.insertCodeAtCurrentLocation(code, this.getEditor());
                                        return Promise.resolve(); // Resolve Promise To End Loading Notification
                                    });
                                    vscode.window.showInformationMessage("Stelle's code has been inserted! Enjoy!"); // Inform User Of Completion
                                } else {
                                    vscode.window.showWarningMessage("Stelle's code will not be inserted.");
                                }
                            }
                        } else {
                            vscode.window.showErrorMessage("JSON ERROR, PLEASE REPORT ERROR TO EXTENSION REPOSITORYS: ", this.returnErrorString(command));
                        }
                    }
                }
            });
        }
    }
}