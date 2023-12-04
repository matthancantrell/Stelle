import OpenAI from 'openai';
import * as message from './message';
import * as vscode from 'vscode';
import * as conversation from './conversation';
import { json } from 'stream/consumers';
import { version } from 'os';
import { jsonrepair } from 'jsonrepair';

export class ChatAPI {
    //#region <-- CLASS SETUP -->
    apiKey: string = "";
    openai: OpenAI;
    commentExample: string = `{
        "codeProvided": true,
        "code": "async function test() {\n    // Await to fetch all items\n    var a = await getAllItems();\n    // Await to retrieve marketable IDs\n    var b = await getMarketableIDs();\n\n    // An unused console.log here, useful for debugging maybe\n    //console.log(b.length);\n\n    // Initializing a new array\n    var arr = new Array();\n\n    // Iterate over each key in 'b'\n    for (const key in b) {\n        // Check if both 'b' and 'a' has the property 'key'\n        if (b.hasOwnProperty(key) && a.hasOwnProperty(key)) {\n            // Access the property 'key' in 'a' to get the item\n            const item = a[key];\n            // Check if 'item.en' is an empty string after trimmed\n            if (item.en.trim() !== '') {\n                // Push the 'item.en' to 'arr'\n                arr.push(item.en);\n            }\n        }\n    }\n    // Print 'arr' to .\n    console.log(arr);\n}",
        "response": "The submitted code is an asynchronous function named 'test'. It appears to be retrieving 'all items' and 'marketable IDs' with await calls. It then builds an array with certain attribute 'en' of items from 'all items', given that 'en' is not an empty string and the key exists in 'marketable IDs'. Finally, the array is logged in the console."
        }`;

    constructor(apiKey: string) {
        this.setAPIKey(apiKey);
        this.openai = new OpenAI({
            apiKey: this.getAPIKey()
        });
    }

    private setAPIKey(apiKey: string) {
        this.apiKey = apiKey;
    }

    private getAPIKey() { return this.apiKey; }
    //#endregion

    private getSystemPrompt(command: string, levelOfAssistance: string) {
        switch(levelOfAssistance) {
            case "Give Me Code": {
                this.getPromptFromCommandGive(command);
                break;
            }

            case "Teach Me How To Code": {
                this.getPromptFromCommandTeach(command);
                break;
            }
        }
    }

    private getPromptFromCommandGive(command: string) {}

    private getPromptFromCommandTeach(command: string) {}

    async callOpenAI(userData : string, levelOfAssistance: string) {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                {
                    "role": "system",
                    "content": "You are Stelle, an assistant made to help people with programming or coding.\nYou are not permitted to answer questions that are not related to code or programming.\nYour answers MUST be concise and are permitted to be at most 256 characters long.\nPlease respond with JSON objects that have sections for your responses labelled, code if you send any, and a boolean of whether or not you sent any code.\nLabel the JSON data for your response as response, the data for your code as code, and the data for whether or not code was provided as codeProvided."
                },
                {
                    "role": "user",
                    "content": userData,
                }
                ],
                temperature: 1,
                max_tokens: 6000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            
            if (response.choices[0].message.content !== null) {
                var mes = new message.Message(response.choices[0].message.role, response.choices[0].message.content);
                //var data: Record<string, any> = JSON.parse(response.choices[0].message.content);
                return mes;
            } else {
                console.log("Error. Data null.");
            }
        } catch (error) {
            console.error("An error occurred while calling the OpenAI API: ", error);
            vscode.window.showErrorMessage("There was an error capturing data from the API! Please try again or report your error to the extension store page.");
            throw error;
        }
    }

    async ChatCommand(command: string) {

    }

    async Analyze(userData: string) {
        try {
            console.log(`User Data:\n${userData}`);
    
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                {
                    "role": "system",
                    "content": "You are Stelle, an assistant made to help people with programming or coding.\nYou are not permitted to answer questions that are not related to code or programming.\nYour job is to analyze the provided code and tell the user what they are doing right and wrong, if anything.\nIf there are errors in their code, do not correct them.\nPoint it out in code comments on their code.\nYour answers MUST be concise and are permitted to be at most 256 characters long.\nPlease respond with JSON objects that have sections for your responses labelled, code if you send any, and a boolean of whether or not you sent any code.\nLabel the JSON data for your response as response, the data for the user's submitted code along with your code comments as code, and the data for whether or not code was provided as codeProvided."
                },
                {
                    "role": "user",
                    "content": userData,
                }
                ],
                temperature: 1,
                max_tokens: 6000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
        
            if (response.choices[0].message.content !== null) {
                console.log(`Generated Data:\n` + response.choices[0].message.content);
                var data: Record<string, any> = JSON.parse(response.choices[0].message.content);
                return data;
            } else {
                console.log("Error. Data null.");
            }
        } catch (error) {
            console.error("An error occurred while calling the OpenAI API: ", error);
            vscode.window.showErrorMessage("There was an error capturing data from the API! Please try again or report your error to the extension store page.");
            throw error;
        }
    }

    async Optimize(userData : string) {
        try {
            console.log(`User Data:\n${userData}`);

            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                {
                    "role": "system",
                    "content": "You are Stelle, an assistant made to help people with programming or coding.\nYou are not permitted to answer questions that are not related to code or programming.\nYour job is to optimize and improve the provided code.\nIf there are errors in the code, correct them and provide code comments about what you fixed.\nYour answers MUST be concise and are permitted to be at most 256 characters long.\nPlease respond with JSON objects that have sections for your responses labelled, code if you send any, and a boolean of whether or not you sent any code.\nLabel the JSON data for your response as response, the data for the code you've optimized with code comments as code, and the data for whether or not code was provided as codeProvided."
                },
                {
                    "role": "system",
                    "content": "The next message is an example of how your response should be formatted.\nMake sure you are properly escaping and formatting the json response using `\n` escape character instead of making a new line.\nYour JSON MUST be all in one line using the proper escape characters."
                },
                {
                    "role": "system",
                    "content": this.commentExample
                },
                {
                    "role": "user",
                    "content": userData,
                }
                ],
                temperature: 1,
                max_tokens: 6000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
        
            if (response.choices[0].message.content !== null) {
                console.log(`Generated Data:\n` + response.choices[0].message.content);
                var data: Record<string, any> = JSON.parse(jsonrepair(response.choices[0].message.content));
                return data;
            } else {
                console.log("Error. Data null.");
            }
        } catch (error) {
            console.error("An error occurred while calling the OpenAI API: ", error);
            vscode.window.showErrorMessage("There was an error capturing data from the API! Please try again or report your error to the extension store page.");
            throw error;
        }
    }

    async Comment(userData : string) {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                {
                    "role": "system",
                    "content": "You are Stelle, an assistant made to help people with programming or coding.\nYou are not permitted to answer questions that are not related to code or programming.\nYour will comment the provided code and return a single line JSON object.\nIf there are errors in the code, do not fix them.\nInstead, provide a comment pointing out the error.\nYou should be returning the user's submitted code AND your comments on the code as inline code comments.\nEmphasize correct JSON syntax and the use of special characters like '\n'. \nYou are not permitted to change the code provided other than adding comments to it.\nYour answers MUST be concise and are permitted to be at most 256 characters long.\nPlease respond with JSON objects that have sections for your responses labelled, code if you send any, and a boolean of whether or not you sent any code.\nLabel the JSON data for your response as response, the data for the code the user submitted with your code comments as code, and the data for whether or not code was provided as codeProvided."
                },
                {
                    "role": "system",
                    "content": "The next message is an example of how your response should be formatted.\nMake sure you are properly escaping and formatting the json response using `\n` escape character instead of making a new line.\nYour JSON MUST be all in one line using the proper escape characters."
                },
                {
                    "role": "system",
                    "content": this.commentExample
                },
                {
                    "role": "system",
                    "content": "Using the provided example and instructions, apply comments to the user's code."
                },
                {
                    "role": "user",
                    "content": userData,
                }
                ],
                temperature: 0.5,
                max_tokens: 6000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
        
            if (response.choices[0].message.content !== null) {
                console.log(`Generated Data:\n` + response.choices[0].message.content);
                var data: Record<string, any> = JSON.parse(this.fixJSON(response.choices[0].message.content));
                return data;
            } else {
                console.log("Error. Data null.");
            }
        } catch (error) {
            console.error("An error occurred while calling the OpenAI API: ", error);
            vscode.window.showErrorMessage("There was an error capturing data from the API! Please try again or report your error to the extension store page.");
            throw error;
        }
    }

    async Fill(userData : string) {
        try {
            console.log(`User Data:\n${userData}`);

            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                {
                    "role": "system",
                    "content": "You are Stelle, an assistant made to help people with programming or coding.\nYou are not permitted to answer questions that are not related to code or programming.\nYour job is to fill in the provided functions if they are empty or missing code to make them functional.\nIf there are errors, do not fix them.\nProvide comments pointing out the errors.\nYour our answers concise and at most 256 characters long.\nPlease respond with JSON objects that have sections for your responses labelled, code if you send any, and a boolean of whether or not you sent any code.\nLabel the JSON data for your response as response, the data for the code the user submitted with your adjustments as code, and the data for whether or not code was provided as codeProvided."
                },
                {
                    "role": "system",
                    "content": "The next message is an example of how your response should be formatted.\nMake sure you are properly escaping and formatting the json response using `\n` escape character instead of making a new line.\nYour JSON MUST be all in one line using the proper escape characters."
                },
                {
                    "role": "system",
                    "content": this.commentExample
                },
                {
                    "role": "user",
                    "content": userData,
                }
                ],
                temperature: 1,
                max_tokens: 6000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
        
            if (response.choices[0].message.content !== null) {
                console.log(`Generated Data:\n` + response.choices[0].message.content);
                var data: Record<string, any> = JSON.parse(this.fixJSON(response.choices[0].message.content));
                return data;
            } else {
                console.log("Error. Data null.");
            }
        } catch (error) {
            console.error("An error occurred while calling the OpenAI API: ", error);
            vscode.window.showErrorMessage("There was an error capturing data from the API! Please try again or report your error to the extension store page.");
            throw error;
        }
    }

    async Debug(userData: string) {
        try {
            console.log(`User Data:\n${userData}`);

            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                {
                    "role": "system",
                    "content": "You are Stelle, an assistant made to help people with programming or coding.\nYou are not permitted to answer questions that are not related to code or programming.\nYour job is to debug the provided code.\nFeel free to fix the provided code and ensure that you provide code comments to tell the user what you fixed.\nYour answers MUST be concise andare permitted to be at most 256 characters long.\nPlease respond with JSON objects that have sections for your responses labelled, code if you send any, and a boolean of whether or not you sent any code.\nLabel the JSON data for your response as response, the data for the code the user submitted with your adjustments as code, and the data for whether or not code was provided as codeProvided."
                },
                {
                    "role": "system",
                    "content": "The next message is an example of how your response should be formatted.\nMake sure you are properly escaping and formatting the json response using `\n` escape character instead of making a new line.\nYour JSON MUST be all in one line using the proper escape characters."
                },
                {
                    "role": "system",
                    "content": this.commentExample
                },
                {
                    "role": "user",
                    "content": userData,
                }
                ],
                temperature: 1,
                max_tokens: 6000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
        
            if (response.choices[0].message.content !== null) {
                //console.log(response.choices[0].message.content);
                var data: Record<string, any> = JSON.parse(response.choices[0].message.content);
                return data;
            } else {
                console.log("Error. Data null.");
            }
        } catch (error) {
            console.error("An error occurred while calling the OpenAI API: ", error);
            vscode.window.showErrorMessage("There was an error capturing data from the API! Please try again or report your error to the extension store page.");
            throw error;
        }
    }

    fixJSON(jsonObj: string): string {
        try {
        const repaired = jsonrepair(jsonObj);
        
        console.log(repaired);
        return repaired;
        } catch (err) {
        console.error(err);
        return "";
        }
    }
}

//var convo = new conversation.Conversation();