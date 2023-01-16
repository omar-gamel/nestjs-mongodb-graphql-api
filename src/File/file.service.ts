import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './entities/file.entity';
import { FilesBoardInput } from './dto/files-board.input';
import mongoose from 'mongoose';

@Injectable()
export class FileService {
  constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

  public async getFileById(id: string): Promise<File> {
    return await this.fileModel.findById(id);
  }
  public async filesBoard(input: FilesBoardInput) {
    const files = await this.fileModel.find({ fileType: input.fileType });
    return {
      message: '',
      code: 200,
      success: true,
      files
    };
  }

  public async instructionFiles() {
    const files = await this.fileModel.find({ fileType: 'INSTRUCTION' });
    return {
      message: '',
      code: 200,
      success: true,
      files
    };
  }

  public async deleteInstructionFileBoard(fileId: string) {
    const file = await this.fileModel.findOne({
      _id: new mongoose.Types.ObjectId(fileId),
      fileType: 'INSTRUCTION'
    });
    if (!file) return { code: 404, message: 'File not found', success: false };

    await file.remove();
    return { code: 404, message: 'File deleted successfully', success: true, file };
  }
}
