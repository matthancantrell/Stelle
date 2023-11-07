import OpenAI from 'openai';

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
            var data: Record<string, any> = JSON.parse(response.choices[0].message.content);
            console.log(data);
            return data;
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
        console.error("An errir occurred while calling the OpenAI API: ", error);
        throw error;
    }
}

export async function Analyze(userData: string) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
            {
                "role": "user",
                "content": userData,
            },
            {
                "role": "system",
                "content": "Analyze the code provided and explain it simply to the user. If there is no implementation, use context to explain what the code should do and how to achieve this. Be sure to keep your answers concise and 256 characters maximum. You will return a JSON object with the structure of 'response' and 'code'. Response will have your explanation for the user to read and understand. Code will be the code they submitted with comments explaining what the code does. If the code has errors, do not fix them. Point the errors out in your explanation and code comments. Maintain formatting of the data when you send it back to ensure clarity and understanding. This includes indention, spacing, etc."
            }
            ],
            temperature: 1,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
    
        if (response.choices[0].message.content !== null) {
            console.log(response.choices[0].message.content);
            var data = response.choices[0].message.content;
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
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
            {
                "role": "user",
                "content": userData,
            },
            {
                "role": "system",
                "content": "Analyze the code provided and optimize it for the user. Make sure to explain what you're doing and why through an explanation and code comments. Only add comments where you are making optimizations. Make sure to only explain any changes made that optimize the code. You do not need to comment line by line if you are not optimizing every line. Be sure to keep your answers concise and 256 characters maximum. You will return a JSON object with the structure of 'response' and 'code'. Response will have your explanation for the user to read and understand. Code will be the code they submitted with comments explaining what the code does. If the code has errors, do not fix them. Point the errors out in your explanation and code comments. Maintain formatting of the data when you send it back to ensure clarity and understanding. This includes indention, spacing, etc."
            }
            ],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
    
        if (response.choices[0].message.content !== null) {
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

async function streamTest() {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
            {
                "role": "system",
                "content": "You are an assistant. Make sure to help the user with anything they may need."
            }
            ],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stream: true,
        });

        
    } catch (error) {
    }
}