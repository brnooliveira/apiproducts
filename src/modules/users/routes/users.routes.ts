import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import UsersController from '../controllers/UsersController';
import isAuth from '../../../shared/http/middlewares/IsAuth';
import multer from 'multer';
import upload from '../../../config/upload';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();

const usersController = new UsersController();

const usersAvatarController = new UserAvatarController();

const uploadMulter = multer(upload);

usersRouter.get('/', isAuth, usersController.index);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.patch(
  '/avatar',
  isAuth,
  uploadMulter.single('avatar'),
  usersAvatarController.update,
);

export default usersRouter;
