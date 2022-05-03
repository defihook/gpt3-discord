import * as dotenv from "dotenv";
import { Configuration, CreateCompletionRequest, OpenAIApi } from "openai"
import { Client, Intents } from "discord.js"

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on("messageCreate", async function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith("!gpt3")) return;

    const args = message.content.split('\n')[0].split(' ');
    const prompt = message.content.substring(message.content.indexOf("\n") + 1) ;
    let temperature = 0.5;
    let max_tokens = 256;

    if (args.length >= 2) {
        temperature = Number(args[1]);
    }
    if (args.length >= 3) {
        max_tokens = Number(args[2]);
    }

    const config: CreateCompletionRequest = {
        prompt: prompt,
        max_tokens: max_tokens,
        temperature: temperature,
        presence_penalty: 0,
        frequency_penalty: 0.3,
        best_of: 1,
        n: 1,
        stream: false,
    };

    console.log(config);
    
    const gptResponse = await openai.createCompletion("text-davinci-002", 
        config
    )
    // @ts-ignore
    await message.reply(`${gptResponse.data.choices[0].text}`);
 }); 


client.login(process.env.BOT_TOKEN);

    
