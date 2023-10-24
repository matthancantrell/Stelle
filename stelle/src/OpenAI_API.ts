import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { json } from 'stream/consumers';
require('dotenv').config;

const openai = new OpenAI({
    apiKey: "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"
});

const KEY = process.env.OPENAI_API_KEY;

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