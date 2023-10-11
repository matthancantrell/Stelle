import OpenAI from 'openai';
require('dotenv').config();

const openai = new OpenAI({
    apiKey: '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'
});

export async function callOpenAI() {
    const chatcompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content": "Hello!"}],
    });
    console.log(chatcompletion.choices[0].message);
}