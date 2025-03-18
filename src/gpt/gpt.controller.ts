import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDicusserDto, TextToAudioDto } from './dtos';
import { Response } from 'express';
import { TranslateDto } from './dtos/translate.dto';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('ortography-check')
  ortographyCheck(
    @Body() ortographyDto: OrthographyDto,
  ) {

    return this.gptService.orthographyCheck(ortographyDto);
  }
  
  @Post('pros-cons-discusser')
  prosConsDicusser(
    @Body() prosConsDicusserDto: ProsConsDicusserDto,
  ) {

    return this.gptService.prosConsDicusser(prosConsDicusserDto);
  }
 
  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDicusserDto: ProsConsDicusserDto,
    @Res() res: Response,
  ) {

    const stream = this.gptService.prosConsDicusserStream(prosConsDicusserDto);

    res.setHeader('Content-Type', 'aplication/json');
    res.status(HttpStatus.OK);

    for await (const chunk of await stream) {
      const piece = chunk.choices[0].delta.content || '';
      res.write(piece);
    }

    res.end()
  }

  @Post('translate')
  translate(
    @Body() translateDto: TranslateDto,
  ) {

    return this.gptService.translate(translateDto);
  }


  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string,
  ) {
    const filePath = await this.gptService.textToAudioGetter(fileId);

    res.setHeader('Content-Type','audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);

  }

  
  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToAudio(textToAudioDto);

    res.setHeader('Content-Type','audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);

  }
}

