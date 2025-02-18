import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const prosConsDicusserStreamUseCase = async (openai: OpenAI,{prompt}: Options) => {
  
    return await openai.chat.completions.create({
      messages: [{role:"system",content: 
        `
        Se te dará una pregunta y tu tarea es responder con pros y contras.
        La respuesta debe estar en formato markdown e incluir dos listas: "pros" y "contras".
        Asegúrate de analizar la pregunta en el contexto actual.
        `
      },
      {role:'user',content:prompt}],
      model: "chatgpt-4o-latest",
      stream: true,
      temperature: 0.8,
      max_tokens: 300,
    })

};
