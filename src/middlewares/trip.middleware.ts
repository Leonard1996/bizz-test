import { NextFunction, Response, Request } from 'express';
import Joi from 'joi';
import { ALLOWED_PLACES, SORT_OPTIONS } from '../common/constants/trip-api-params';

export class TripMiddleware {
  public static validateQuery(req: Request, res: Response, next: NextFunction) {
    const query = Joi.object().keys({
      origin: Joi.string()
        .valid(...ALLOWED_PLACES)
        .required(),
      destination: Joi.string()
        .valid(...ALLOWED_PLACES)
        .required(),
      sort_by: Joi.string()
        .valid(...SORT_OPTIONS)
        .required()
    });

    const result = query.validate(req.query, { abortEarly: false });

    if (!result.error) {
      next();
    } else {
      return res.status(400).json({ message: result.error.message, error: result.error });
    }
  }

  public static validateCreateTrip(req: Request, res: Response, next: NextFunction) {
    const body = Joi.object().keys({
      origin: Joi.string()
        .valid(...ALLOWED_PLACES)
        .required(),
      destination: Joi.string()
        .valid(...ALLOWED_PLACES)
        .required(),
      cost: Joi.number().required(),
      duration: Joi.number().required(),
      type: Joi.string().required(),
      display_name: Joi.string().required()
    });

    const result = body.validate(req.body, { abortEarly: false });

    if (!result.error) {
      next();
    } else {
      return res.status(400).json({ message: result.error.message, error: result.error });
    }
  }

  public static validateTripId(req: Request, res: Response, next: NextFunction) {
    if (req.params.id && !isNaN(+req.params.id)) {
      next();
    } else {
      return res.status(400).json({ message: 'Invalid trip ID' });
    }
  }
}
