import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDicusserDto } from './dtos';
import { Response } from 'express';

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
}
