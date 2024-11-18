import { Injectable } from '@nestjs/common';
import { ortographyCheckUseCase } from './use-cases';
import { OrtographyDto } from './dtos';

@Injectable()
export class GptService {


  async ortographyCheck(ortographyDto: OrtographyDto) {
    return await ortographyCheckUseCase({
      prompt: ortographyDto.prompt
    })
  }

}
