import OpenAI from 'openai';
import * as message from './message';
import * as conversation from './conversation';

var convo = new conversation.Conversation();

const openai = new OpenAI({
    apiKey: "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"
});

export async function callOpenAI(userData : string) {
    try {
        const response = await openai.chat.completions.create({
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



export async function callOpenAIStreaming(userData : string) {
    try {
        const completion = await openai.chat.completions.create({
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
            stream: true
        });

        for await (const chunk of completion) {
            if (chunk.choices[0].delta.content !== null) {
                var data = chunk.choices[0].delta.content;
                console.log(data);
            }
        }

    } catch (error) {
        console.error("An error occurred while calling the OpenAI API: ", error);
        throw error;
    }
}

export async function Analyze(userData: string) {
    try {
        console.log(`User Data:\n${userData}`);

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
            {
                "role": "system",
                "content": "Analyze the code provided and give feedback to the user on what they did right and what they could improve upon.\nYou cannot delete code and must send back the user's full code that they provided.\nIf the code has errors, do not fix them.\nPoint the errors out in your explanation and code comments.\nBe sure to keep your answers concise and 256 characters maximum.\nYou will return a JSON object with 'response' for your explanation and 'code' for the code the user submitted with comments providing feedback.\nMaintain the original code's formatting, including indentation and spacing.\nEven if you are unable to provide feedback to the user, all of your responses must be in the provided JSON format.\nEnsure that your JSON response is valid and all special characters are properly escaped."
            },
            {
                "role": "user",
                "content": userData,
            }
            ],
            temperature: 1,
            max_tokens: 5000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
    
        if (response.choices[0].message.content !== null) {
            console.log(response.choices[0].message.content);
            var data: Record<string, any> = JSON.parse(response.choices[0].message.content);
            return data;
        } else {
            console.log("Error. Data null.");
        }
    } catch (error) {
        console.error("An error occurred while calling the OpenAI API: ", error);
        throw error;
    }
}

export async function Optimize(userData : string) {
    try {
        console.log(`User Data:\n${userData}`);

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
            {
                "role": "system",
                "content": "Optimize and improve the provided code for speed and efficiency.\nOnly add comments where you are making improvements.\nKeep your explanations concise and 256 maximum.\nMaintain the original code's formatting, including indentation and spacing.\nIf there are errors, point them out in comments without fixing them.\nYou will respond ONLY with a JSON object with 'response' for your explanation and 'code' for the optimized code with comments.\nExplain your optimizations through comments in the code.\nMaintain the original code's formatting, including indentation and spacing.\nEven if you are unable to provide feedback to the user, all of your responses must be in the provided JSON format.\nEnsure that your JSON response is valid and all special characters are properly escaped."
            },
            {
                "role": "user",
                "content": userData,
            }
            ],
            temperature: 1,
            max_tokens: 5000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
    
        if (response.choices[0].message.content !== null) {
            console.log(response.choices[0].message.content);
            var data: Record<string, any> = JSON.parse(response.choices[0].message.content);
            return data;
        } else {
            console.log("Error. Data null.");
        }
    } catch (error) {
        console.error("An error occurred while calling the OpenAI API: ", error);
        throw error;
    }
}

export async function Comment(userData : string) {
    try {
        console.log(`User Data:\n${userData}`);

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
            {
                "role": "system",
                "content": "Add comments to explain the purpose and functionality of provided code segments.\nTry to comment only where necessary to keep the code clean but comment as much as possible.\nKeep comments concise and focused on the code's operation.\nLimit explanations to 256 characters maximum per comment.\nMaintain the original code's formatting, including indentation and spacing.\nDo not modify the code.\nIf there are errors, point them out in comments without fixing them.\nProvide a JSON object with 'response' for your comments in a way that the user can easily read them and 'code' which contains the user's original code with the comment's you've added.\nEnsure that your JSON response is valid, and all special characters are properly escaped."
            },
            {
                "role": "user",
                "content": userData,
            }
            ],
            temperature: 1,
            max_tokens: 5000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
    
        if (response.choices[0].message.content !== null) {
            console.log(response.choices[0].message.content);
            var data: Record<string, any> = JSON.parse(response.choices[0].message.content);
            return data;
        } else {
            console.log("Error. Data null.");
        }
    } catch (error) {
        console.error("An error occurred while calling the OpenAI API: ", error);
        throw error;
    }
}

export async function Fill(userData : string) {
    try {
        console.log(`User Data:\n${userData}`);

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
            {
                "role": "system",
                "content": "Fill in the provided empty functions with appropriate code to make them functional.\nEnsure the code logically fits the function's purpose.\nDo not modify existing code outside the empty functions.\nIf there are errors in the original code, point them out through code comments without fixing them.\nProvide a JSON object with 'response' containing a user-readable explanation of the filled functions and 'code' containing the newly written function with comments.\nMaintain the original code's formatting, including indentation and spacing.\nEnsure that your JSON response is valid, and all special characters are properly escaped."
            },
            {
                "role": "user",
                "content": userData,
            }
            ],
            temperature: 1,
            max_tokens: 5000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
    
        if (response.choices[0].message.content !== null) {
            console.log(response.choices[0].message.content);
            var data: Record<string, any> = JSON.parse(response.choices[0].message.content);
            return data;
        } else {
            console.log("Error. Data null.");
        }
    } catch (error) {
        console.error("An error occurred while calling the OpenAI API: ", error);
        throw error;
    }
}