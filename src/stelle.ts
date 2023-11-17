import * as OpenAI_API from './OpenAI_API';
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
}