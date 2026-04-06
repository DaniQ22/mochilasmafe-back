import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { CreateBackpackDto } from './dto/create-backpack.dto';
import { BackpacksService } from './backpacks.service';
import { Backpack } from './interfaces/backpack.interface';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('backpacks')
export class BackpacksController {
  constructor(private readonly backpacksService: BackpacksService) {}

  @Get()
  findAll(): Promise<Backpack[]> {
    return this.backpacksService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.backpacksService.delete(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('images', 8, {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads'),
        filename: (_req, file, callback) => {
          const extension = extname(file.originalname) || '.jpg';
          const filename = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${extension}`;
          callback(null, filename);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          callback(
            new BadRequestException('Only image files are allowed.'),
            false,
          );
          return;
        }

        callback(null, true);
      },
    }),
  )
  async create(
    @Body() dto: CreateBackpackDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<Backpack> {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required.');
    }

    const imageUrls = files.map((f) => `/uploads/${f.filename}`);
    return this.backpacksService.create(dto, imageUrls);
  }
}
