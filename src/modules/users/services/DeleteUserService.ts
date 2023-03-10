import { getCustomRepository } from 'typeorm';
import AppError from '../../../shared/errors/AppError';
import { UserRepository } from '../typeorm/repositories/UserRepository';

interface IRequest {
  id: string;
}

class DeleteUserService {
  public async execute({ id }: IRequest): Promise<void> {
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findOne(id);

    if (!user) {
      throw new AppError('Product not found.');
    }

    await userRepository.remove(user);
  }
}

export default DeleteUserService;
