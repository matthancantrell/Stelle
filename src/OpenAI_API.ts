import OpenAI from 'openai';
import * as message from './message';
import * as conversation from './conversation';

export class ChatAPI {
    apiKey: string = "";
    openai: OpenAI;

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

    /*  All Code Above Initializes Base Class Values. Code Below Will Work On API Functionality */

    async callOpenAI(userData : string) {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                {
                    "role": "system",
                    "content": "You are Stelle, an assistant made to help people with programming or coding.\nYou are not permitted to answer questions that are not related to code or programming.\nKeep your answers concise and at most 256 characters long.\nPlease respond with JSON objects that have sections for your responses labelled, code if you send any, and a boolean of whether or not you sent any code.\nLabel the JSON data for your response as response, the data for your code as code, and the data for whether or not code was provided as codeProvided."
                },
                {
                    "role": "user",
                    "content": userData,
                }
                ],
                temperature: 1,
                max_tokens: 256,
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
            throw error;
        }
    }
}

var convo = new conversation.Conversation();



// export async function callOpenAIStreaming(userData : string) {
//     try {
//         const completion = await openai.chat.completions.create({
//             model: "gpt-4",
//             messages: [
//             {
//                 "role": "system",
//                 "content": "You are Stelle, an assistant made to help people with programming or coding.\nYou are not permitted to answer questions that are not related to code or programming.\nKeep your answers concise and at most 256 characters long.\nPlease respond with JSON objects that have sections for your responses labelled, code if you send any, and a boolean of whether or not you sent any code.\nLabel the JSON data for your response as response, the data for your code as code, and the data for whether or not code was provided as codeProvided."
//             },
//             {
//                 "role": "user",
//                 "content": userData,
//             }
//             ],
//             temperature: 1,
//             max_tokens: 256,
//             top_p: 1,
//             frequency_penalty: 0,
//             presence_penalty: 0,
//             stream: true
//         });

//         for await (const chunk of completion) {
//             if (chunk.choices[0].delta.content !== null) {
//                 var data = chunk.choices[0].delta.content;
//                 console.log(data);
//             }
//         }

//     } catch (error) {
//         console.error("An error occurred while calling the OpenAI API: ", error);
//         throw error;
//     }
// }

// export async function Analyze(userData: string) {
//     try {
//         console.log(`User Data:\n${userData}`);

//         const response = await openai.chat.completions.create({
//             model: "gpt-4",
//             messages: [
//             {
//                 "role": "system",
//                 "content": "You are Stelle, an assistant made to help people with programming or coding.\nYou are not permitted to answer questions that are not related to code or programming.\nYour job is to analyze the provided code and tell the user what they are doing right and wrong, if anything.\nIf there are errors in their code, do not correct them.\nPoint it out in code comments on their code.\nKeep your answers concise and at most 256 characters long.\nPlease respond with JSON objects that have sections for your responses labelled, code if you send any, and a boolean of whether or not you sent any code.\nLabel the JSON data for your response as response, the data for the user's submitted code along with your code comments as code, and the data for whether or not code was provided as codeProvided."
//             },
//             {
//                 "role": "user",
//                 "content": userData,
//             }
//             ],
//             temperature: 1,
//             max_tokens: 5000,
//             top_p: 1,
//             frequency_penalty: 0,
//             presence_penalty: 0,
//         });
    
//         if (response.choices[0].message.content !== null) {
//             console.log(response.choices[0].message.content);
//             var data: Record<string, any> = JSON.parse(response.choices[0].message.content);
//             return data;
//         } else {
//             console.log("Error. Data null.");
//         }
//     } catch (error) {
//         console.error("An error occurred while calling the OpenAI API: ", error);
//         throw error;
//     }
// }

// export async function Optimize(userData : string) {
//     try {
//         console.log(`User Data:\n${userData}`);

//         const response = await openai.chat.completions.create({
//             model: "gpt-4",
//             messages: [
//             {
//                 "role": "system",
//                 "content": "You are Stelle, an assistant made to help people with programming or coding.\nYou are not permitted to answer questions that are not related to code or programming.\nYour job is to optimize and improve the provided code.\nIf there are errors in the code, correct them and provide code comments about what you fixed.\n Keep your answers concise and at most 256 characters long.\nPlease respond with JSON objects that have sections for your responses labelled, code if you send any, and a boolean of whether or not you sent any code.\nLabel the JSON data for your response as response, the data for the code you've optimized with coe comments as code, and the data for whether or not code was provided as codeProvided."
//             },
//             {
//                 "role": "user",
//                 "content": userData,
//             }
//             ],
//             temperature: 1,
//             max_tokens: 5000,
//             top_p: 1,
//             frequency_penalty: 0,
//             presence_penalty: 0,
//         });
    
//         if (response.choices[0].message.content !== null) {
//             console.log(response.choices[0].message.content);
//             var data: Record<string, any> = JSON.parse(response.choices[0].message.content);
//             return data;
//         } else {
//             console.log("Error. Data null.");
//         }
//     } catch (error) {
//         console.error("An error occurred while calling the OpenAI API: ", error);
//         throw error;
//     }
// }

// export async function Comment(userData : string) {
//     try {
//         console.log(`User Data:\n${userData}`);

//         const response = await openai.chat.completions.create({
//             model: "gpt-4",
//             messages: [
//             {
//                 "role": "system",
//                 "content": "You are Stelle, an assistant made to help people with programming or coding.\nYou are not permitted to answer questions that are not related to code or programming.\nYour job is to comment the provided code.\nIf there are errors in the code, do not fix them.\nSimply provide a comment pointing out the error.\nYour comments should be on what each line is doing and the overall function of the code provided.\nYou are not permitted to change the code provided.\nYou may only add comments to it.\nKeep your answers concise and at most 256 characters long.\nPlease respond with JSON objects that have sections for your responses labelled, code if you send any, and a boolean of whether or not you sent any code.\nLabel the JSON data for your response as response, the data for the code the user submitted with your code comments as code, and the data for whether or not code was provided as codeProvided."
//             },
//             {
//                 "role": "user",
//                 "content": userData,
//             }
//             ],
//             temperature: 1,
//             max_tokens: 5000,
//             top_p: 1,
//             frequency_penalty: 0,
//             presence_penalty: 0,
//         });
    
//         if (response.choices[0].message.content !== null) {
//             console.log(response.choices[0].message.content);
//             var data: Record<string, any> = JSON.parse(response.choices[0].message.content);
//             return data;
//         } else {
//             console.log("Error. Data null.");
//         }
//     } catch (error) {
//         console.error("An error occurred while calling the OpenAI API: ", error);
//         throw error;
//     }
// }

// export async function Fill(userData : string) {
//     try {
//         console.log(`User Data:\n${userData}`);

//         const response = await openai.chat.completions.create({
//             model: "gpt-4",
//             messages: [
//             {
//                 "role": "system",
//                 "content": "You are Stelle, an assistant made to help people with programming or coding.\nYou are not permitted to answer questions that are not related to code or programming.\nYour job is to fill in the provided functions if they are empty or missing code to make them functional.\nIf there are errors, do not fix them.\nProvide comments pointing out the errors.\nKeep your answers concise and at most 256 characters long.\nPlease respond with JSON objects that have sections for your responses labelled, code if you send any, and a boolean of whether or not you sent any code.\nLabel the JSON data for your response as response, the data for the code the user submitted with your adjustments as code, and the data for whether or not code was provided as codeProvided."
//             },
//             {
//                 "role": "user",
//                 "content": userData,
//             }
//             ],
//             temperature: 1,
//             max_tokens: 5000,
//             top_p: 1,
//             frequency_penalty: 0,
//             presence_penalty: 0,
//         });
    
//         if (response.choices[0].message.content !== null) {
//             console.log(response.choices[0].message.content);
//             var data: Record<string, any> = JSON.parse(response.choices[0].message.content);
//             return data;
//         } else {
//             console.log("Error. Data null.");
//         }
//     } catch (error) {
//         console.error("An error occurred while calling the OpenAI API: ", error);
//         throw error;
//     }
// }

// export async function Debug(userData: string) {
//     try {
//         console.log(`User Data:\n${userData}`);

//         const response = await openai.chat.completions.create({
//             model: "gpt-4",
//             messages: [
//             {
//                 "role": "system",
//                 "content": "You are Stelle, an assistant made to help people with programming or coding.\nYou are not permitted to answer questions that are not related to code or programming.\nYour job is to debug the provided code.\nFeel free to fix the provided code and ensure that you provide code comments to tell the user what you fixed.\nKeep your answers concise and at most 256 characters long.\nPlease respond with JSON objects that have sections for your responses labelled, code if you send any, and a boolean of whether or not you sent any code.\nLabel the JSON data for your response as response, the data for the code the user submitted with your adjustments as code, and the data for whether or not code was provided as codeProvided."
//             },
//             {
//                 "role": "user",
//                 "content": userData,
//             }
//             ],
//             temperature: 1,
//             max_tokens: 5000,
//             top_p: 1,
//             frequency_penalty: 0,
//             presence_penalty: 0,
//         });
    
//         if (response.choices[0].message.content !== null) {
//             console.log(response.choices[0].message.content);
//             var data: Record<string, any> = JSON.parse(response.choices[0].message.content);
//             return data;
//         } else {
//             console.log("Error. Data null.");
//         }
//     } catch (error) {
//         console.error("An error occurred while calling the OpenAI API: ", error);
//         throw error;
//     }
// }