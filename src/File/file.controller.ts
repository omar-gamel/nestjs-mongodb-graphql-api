import { Body, Controller, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { routeGuard } from '../Common/utils/route-guard';
import { Model } from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';
import { File } from './entities/file.entity';
import { FilesInterceptor } from '@nestjs/platform-express';

const models = [
  'articles',
  'banners',
  'categories',
  'certifications',
  'chatMessages',
  'courses',
  'discussions',
  'paths',
  'sections',
  'testimonials',
  'users',
  'certificationStamps',
  'signatures',
  'questions',
  'cvs',
  'siteMap',
  'badges'
];
@Controller()
export class FileController {
  constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

  @UseInterceptors(FilesInterceptor('files'))
  @Post('/uploadNormalFiles')
  async emailVerification(@Req() req, @Res() res: Response, @Body() body, @UploadedFiles() files) {
    try {
      if (!req.body || !req.body.destination) {
        return res.json({
          status_code: 404,
          message: 'you must include destination for the file'
        });
      }

      if (!models.includes(req.body.destination)) {
        return res.json({
          status_code: 404,
          message: `destination must be in ${models}`
        });
      }

      if (
        req.body.destination !== 'courses' &&
        req.files.filter(file => file.size > 60 * 1000 * 100).length
      ) {
        return res.json({
          status_code: 404,
          message: 'file should not exceed 60 mb'
        });
      }

      if (req.body.destination === 'questions') {
        const { data, error } = routeGuard(req);
        if (error) {
          return res.json(data);
        } else {
          req.userId = data.userId;
        }
      }
      if (
        ['certificationStamps', 'signatures', 'siteMap', 'badges'].includes(req.body.destination)
      ) {
        // check user
        const { data, error } = routeGuard(req);
        if (error) {
          return res.json(data);
        } else {
          req.userId = data.userId;
        }
        // const user = await this.userModel.findById(req.userId);
        // if (user.role !== 'ADMIN') {
        //   return res.json({
        //     status_code: 403,
        //     message: `${req.body.destination} must be uploaded by admin`
        //   });
        // }
      }
      let destination = path.join(__dirname, `../public/uploads/${req.body.destination}`);
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }
      if (req.fileValidationError) {
        return res.status(415).json({ message: req.fileValidationError });
      }
      const files = req.files;
      let filesArr = [];

      for (let file of files) {
        let fileName = file.originalname.replace(/ /g, '');
        let filePath = `${req.body.destination}/${Date.now()}-${fileName}`;
        await this.asyncWrite(path.join(__dirname, `../public/uploads/${filePath}`), file.buffer);
        filesArr.push({
          name: fileName,
          mimetype: file.mimetype,
          path: `/${filePath}`,
          size: file.size,
          user: req.userId,
          fileType: 'NORMAL'
        });
      }
      const response = await this.fileModel.create(filesArr);
      return res.status(200).json({ data: response });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  private asyncWrite(path, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, err => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}
