import * as dotenv from "dotenv";
import { Configuration, CreateCompletionRequest, OpenAIApi } from "openai"
import { Client, Intents } from "discord.js"

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let lastRequest: CreateCompletionRequest = {
    prompt: "hello",
    max_tokens: 10,
    temperature: 1,
    presence_penalty: 0,
    frequency_penalty: 0.3,
    best_of: 1,
    n: 1,
    stream: false,
};

let lastResponse = "";

client.on("messageCreate", async function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith("!gpt3")) return;
    if (message.content.startsWith("!gpt3 ...")) {
        lastRequest.prompt = lastRequest.prompt + '\n' + lastResponse;
        // @ts-ignore
        lastRequest.max_tokens = lastRequest.max_tokens + 128;
        console.log(lastRequest);
        const gptResponse = await openai.createCompletion("text-davinci-002", lastRequest);
        // @ts-ignore
        lastResponse = gptResponse.data.choices[0].text || "fin.";

        await message.reply(`${lastResponse}`);
        return;
    }

    const args = message.content.split('\n')[0].split(' ');
    const prompt = message.content.substring(message.content.indexOf("\n") + 1);
    let temperature = 0.5;
    let max_tokens = 256;
    let frequency_penalty = 0.3;
    let presence_penalty = 0;

    if (args.length >= 2) {
        temperature = Number(args[1]);
    }
    if (args.length >= 3) {
        max_tokens = Number(args[2]);
    }
    if (args.length >= 4) {
        frequency_penalty = Number(args[3]);
    }
    if (args.length >= 5) {
        presence_penalty = Number(args[4]);
    }

    const config: CreateCompletionRequest = {
        prompt: prompt,
        max_tokens: max_tokens,
        temperature: temperature,
        presence_penalty: presence_penalty,
        frequency_penalty: frequency_penalty,
        best_of: 1,
        n: 1,
        stream: false,
    };

    lastRequest = config;

    console.log(config);

    const gptResponse = await openai.createCompletion("text-davinci-002", config);

    // @ts-ignore
    lastResponse = gptResponse.data.choices[0].text;

    await message.reply(`${lastResponse}`);
});


client.login(process.env.BOT_TOKEN);


