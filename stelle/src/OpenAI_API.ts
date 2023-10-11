import OpenAI from 'openai';
require('dotenv').config();

const openai = new OpenAI({
    apiKey: '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'
});

export async function callOpenAI() {
    const chatcompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
        {
            "role": "system",
            "content": "You are Stelle, an assistant made to help people with programming or coding.\nYou are not permitted to answer questions that are not related to code or programming.\nKeep your answers concise and at most 256 characters long."
        },
        {
            "role": "user",
            "content": "Who are you?"
        }
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    console.log('Stelle: ' + chatcompletion.choices[0].message.content);
}