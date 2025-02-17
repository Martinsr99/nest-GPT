import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const prosConsDicusserUseCase = async (openai: OpenAI,{prompt}: Options) => {
  
    const completion = await openai.chat.completions.create({
      messages: [{role:"system",content: 
        `
        Se te dará una pregunta y tu tarea es responder con pros y contras.
        La respuesta debe ser un objeto JSON donde se incluyan dos listas: "pros" y "contras".
        Asegúrate de analizar la pregunta en el contexto actual.
        `
      },
      {role:'user',content:prompt}],
      model: "chatgpt-4o-latest",
      temperature: 0.3,
      max_tokens: 150,
      response_format: {
        type: 'json_object',
      }
    })

    console.log(completion)
    return JSON.parse(completion.choices[0].message.content)
    
};
