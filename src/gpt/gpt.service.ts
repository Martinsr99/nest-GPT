import { Injectable, NotFoundException } from '@nestjs/common';
import { imageGenerationUseCase, orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase, translateUseCase } from './use-cases';
import { AudioToTextDto, ImageGenerationDto, OrthographyDto, ProsConsDicusserDto, TextToAudioDto, TranslateDto } from './dtos';
import OpenAI from 'openai';
import { textToAudioUseCase } from './use-cases/textToAudioUseCase';
import * as path from 'path';
import * as fs from 'fs';
import { audioToTextUseCase } from './use-cases/audio-to-text.use-case';

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


  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, { prompt, voice });
  }

  async textToAudioGetter(fileId: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/audios/',
      `${fileId}.mp3`,
    );

    const wasFound = fs.existsSync(filePath);

    if (!wasFound) throw new NotFoundException(`File ${fileId} not found`);

    return filePath;
  }

  async audioToText (audioFile: Express.Multer.File, audioToTextDto?: AudioToTextDto) {

    const { prompt } = audioToTextDto;
    return await audioToTextUseCase(this.openai, {audioFile, prompt})
  }

  async imageGeneration (imageGenerationDto: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openai, imageGenerationDto)
  }

  async imageGenerationGetter(fileId: string): Promise<Buffer> {
    const filePath = path.resolve('./', './generated/images/' + fileId);
    if (!fs.existsSync(filePath)) throw new NotFoundException(`File ${fileId} not found`);
    return fs.readFileSync(filePath);
  }
  
}
