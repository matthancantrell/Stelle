import { ChatAPI } from './OpenAI_API';
import * as vscode from 'vscode';

// Integration of both API's should go in this file.

export class Stelle {

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
        }
    }

    async handleCommand(command: string) {

        if(this.editorIsValid()) {
            var input = await  this.getSelectedText();
        }

        var chat = new ChatAPI(this.getOpenAIKey());


        switch(command) {
            case "Analyze": {
                console.log("<-- ANALYZE CALLED -->");
                break;
            }
            case "Optimize": {
                console.log("<-- OPTIMIZE CALLED -->");
                break;
            }
            case "Fill": {
                console.log("<-- FILL CALLED -->");
                break;
            }
            case "Comment": {
                console.log("<-- COMMENT CALLED -->");
                break;
            }
            case "Debug": {
                console.log("<-- DEBUG CALLED -->");
                break;
            }
        }
    }
}