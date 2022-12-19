import { getCustomRepository } from 'typeorm';
import AppError from '../../../shared/errors/AppError';
import { UserRepository } from '../typeorm/repositories/UserRepository';
import path from 'path';
import upload from '../../../config/upload';
import fs from 'fs';
import User from '../typeorm/entities/User';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ avatarFilename, user_id }: IRequest): Promise<User> {
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }
    if (user.avatar) {
      const userAvatarFilePath = path.join(upload.directory, user.avatar);

      const userAvatarFileAlreadyExists = await fs.promises.stat(
        userAvatarFilePath,
      );

      if (userAvatarFileAlreadyExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
