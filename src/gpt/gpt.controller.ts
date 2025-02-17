import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDicusserDto } from './dtos';

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
}
