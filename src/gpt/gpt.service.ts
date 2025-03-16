import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase, translateUseCase } from './use-cases';
import { OrthographyDto, ProsConsDicusserDto, TranslateDto } from './dtos';
import OpenAI from 'openai';

@Injectable()
export class GptService {

  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })


  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt
    })
  }

  async prosConsDicusser({ prompt }: ProsConsDicusserDto) {
    return await prosConsDicusserUseCase(this.openai, { prompt });
  }

  async prosConsDicusserStream({ prompt }: ProsConsDicusserDto) {
    return await prosConsDicusserStreamUseCase(this.openai, { prompt });
  }

  async translate({ prompt,lang }: TranslateDto) {
    return await translateUseCase(this.openai, { prompt,lang });
  }

}
