import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './entities/file.entity';

@Injectable()
export class FileTransformer {
  constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

  public async getFileById(id: string): Promise<File> {
    return await this.fileModel.findById(id);
  }
}
