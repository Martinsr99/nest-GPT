import OpenAI from "openai";

interface Options {
    prompt: string;
    lang: string;
}

export const translateUseCase = async (openai: OpenAI,{prompt, lang}: Options) => {
  
    const completion = await openai.chat.completions.create({
      messages: [{role:"system",content: 
        `
        Traduce el siguiente texto al idioma ${lang}: ${prompt}
        `
      },
      {role:'user',content:prompt}],
      model: "chatgpt-4o-latest",
      temperature: 0.8,
      max_tokens: 300,
    })

    console.log(completion)
    return completion.choices[0].message
    
};
