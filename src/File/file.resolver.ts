import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { FilesBoardInput } from './dto/files-board.input';
import { File } from './entities/file.entity';
import { FileService } from './file.service';
import { FilesResonseType } from './types/file.response';

@Resolver(() => File)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  //** --------------------- QUERIES --------------------- */

  @Query(returns => FilesResonseType)
  async filesBoard(@Args('input') input: FilesBoardInput) {
    return await this.fileService.filesBoard(input);
  }

  @Query(returns => FilesResonseType)
  async instructionFiles() {
    return await this.fileService.instructionFiles();
  }

  //** --------------------- MUTATIONS --------------------- */

  @Mutation(returns => FilesResonseType)
  async deleteInstructionFileBoard(@Args('fileId') fileId: string) {
    return await this.fileService.deleteInstructionFileBoard(fileId);
  }
}
