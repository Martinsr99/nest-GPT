import { Injectable } from '@nestjs/common';
import { ortographyCheckUseCase } from './use-cases';

@Injectable()
export class GptService {


  async ortographyCheck() {
    return await ortographyCheckUseCase()
  }
  
}
