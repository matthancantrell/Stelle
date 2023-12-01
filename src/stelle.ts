import { ChatAPI } from './OpenAI_API';
import * as vscode from 'vscode';

// Integration of both API's should go in this file.

export class Stelle {

    //#region <-- CLASS SETUP -->
     chat: ChatAPI;

    constructor() {
        this.chat = new ChatAPI(this.getOpenAIKey());
    }
    //#endregion

    getLevelOfAssistance() {
        const configName = 'stelle.levelOfAssistance';
        const config = vscode.workspace.getConfiguration();
        const selectedValue = config.get(configName);
        
        if (selectedValue === "Give Me Code") { return "Give Me Code"; }
        if (selectedValue === "Teach Me How To Code") { return "Teach Me How To Code"; }
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

    async handleCommand(command: string) {

        var input: string | undefined;
        if(this.editorIsValid()) {
            input = await this.getSelectedText();
        }

        console.log();

        if (input) {
            var response: Record<string, any> | undefined;

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Stelle has begun to " + command.toLocaleLowerCase() + " your code!",
                cancellable: false,
            }, async (progress) => {
                switch(command) {
                    case "Analyze": {
                        response = await this.chat.Analyze(input + '');
                        break;
                    }
                    case "Optimize": {
                        response = await this.chat.Optimize(input + '');
                        break;
                    }
                    case "Fill": {
                        response = await this.chat.Fill(input + '');
                        break;
                    }
                    case "Comment": {
                        response = await this.chat.Comment(input + '');
                        break;
                    }
                    case "Debug": {
                        response = await this.chat.Debug(input + '');
                        break;
                    }
                }

                if (response) {
                    const explanation = response.response;
                    const code = response.code;
                }
            });
        }
    }
}