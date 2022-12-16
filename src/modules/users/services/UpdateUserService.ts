import { getCustomRepository } from 'typeorm';
import AppError from '../../../shared/errors/AppError';
import User from '../typeorm/entities/User';
import { UserRepository } from '../typeorm/repositories/UserRepository';

interface IRequest {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
}

class UpdateUserService {
  public async execute({
    id,
    name,
    email,
    password,
    avatar,
  }: IRequest): Promise<User> {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne(id);

    if (!user) {
      throw new AppError('User not found.!');
    }
    const userAlreadyExists = await userRepository.findByName(email);

    if (userAlreadyExists && email != user.email) {
      throw new AppError('User email already exists!');
    }
    user.name = name;
    user.email = email;
    user.password = password;
    user.avatar = avatar;

    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserService;
