import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { AudioToTextDto, ImageGenerationDto, OrthographyDto, ProsConsDicusserDto, TextToAudioDto } from './dtos';
import { Response } from 'express';
import { TranslateDto } from './dtos/translate.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${ new Date().getTime()}.${fileExtension}`;
          return cb(null, fileName)
        }
      })
    })
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({maxSize: 1024 * 1000 * 5, message: 'Max file size is bigger than 5Mb'}),
          new FileTypeValidator({fileType: 'audio/*'})
        ]
      })
    ) file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ) {
    return this.gptService.audioToText(file, audioToTextDto)
  }


  @Post('image-generation')
  async imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto,
  ) {
    return this.gptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:fileId(*)')
  async imageGenerationGetter(@Param('fileId') fileId: string, @Res() res: Response) {
    const fileContent = await this.gptService.imageGenerationGetter(fileId);
    res.setHeader('Content-Type', 'image/png');
    res.send(fileContent);
  }
  
  

}

