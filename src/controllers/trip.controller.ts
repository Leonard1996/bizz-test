import { Controller, Delete, Get, Param, Post, Req, Res, UseBefore } from 'routing-controllers';
import { Request, Response } from 'express';
import { TripMiddleware } from '../middlewares/trip.middleware';
import TripService from '../services/trip.service';
import { TripQuery } from '../common/types/trip-query-type';
import { CreateTripDto } from '../common/dtos/create-trip.dto';

@Controller('/trips')
export class TripController {
  @Get('/search')
  @UseBefore(TripMiddleware.validateQuery)
  public async searchTrips(@Req() request: Request, @Res() response: Response) {
    const data = await TripService.searchTrips(request.query as TripQuery);
    return response.status(200).json({ data, message: 'Success' });
  }

  @Post('/')
  @UseBefore(TripMiddleware.validateCreateTrip)
  public async create(@Req() request: Request, @Res() response: Response) {
    const data = await TripService.create(request.body as CreateTripDto);
    return response.status(201).json({ data, message: 'Success' });
  }

  @Delete('/:id')
  @UseBefore(TripMiddleware.validateTripId)
  public async delete(@Param('id') id: string, @Res() response: Response) {
    await TripService.delete(+id);
    return response.status(204).json();
  }

  @Get('/')
  public async list(@Req() request: Request, @Res() response: Response) {
    const data = await TripService.list(request.query as { page: string; limit: string });
    return response.status(200).json({ data, message: 'Success' });
  }
}
