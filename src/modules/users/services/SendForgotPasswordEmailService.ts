import { getCustomRepository } from 'typeorm';
import AppError from '../../../shared/errors/AppError';
import { UserRepository } from '../typeorm/repositories/UserRepository';
import UserTokenRepository from '../typeorm/repositories/UserTokenRepository';
import EtherealMail from '../../../config/mail/EtherealMail';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const userRepository = getCustomRepository(UserRepository);

    const userTokenRepository = getCustomRepository(UserTokenRepository);

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    const token = await userTokenRepository.generate(user.id);

    console.log(token);

    await EtherealMail.sendMail({
      to: email,
      body: `Solicitacao de redefinicao de senha recebida: ${token?.token}`,
    });
  }
}

export default SendForgotPasswordEmailService;
