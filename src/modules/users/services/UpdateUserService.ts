import { getCustomRepository } from 'typeorm';
import AppError from '../../../shared/errors/AppError';
import User from '../typeorm/entities/User';
import { UserRepository } from '../typeorm/repositories/UserRepository';
import { compare, hash } from 'bcryptjs';
interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password: string;
  old_password: string;
}

class UpdateUserService {
  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.!');
    }
    const userAlreadyExists = await userRepository.findByEmail(email);

    if (userAlreadyExists && email != user.email) {
      throw new AppError('User email already exists!');
    }

    if (password && !old_password) {
      throw new AppError('Old password is required!');
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError('Old password does not match');
      }
      user.password = await hash(password, 8);
    }

    user.name = name;
    user.email = email;

    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserService;
