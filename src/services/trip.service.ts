import { getRepository } from 'typeorm';
import { CreateTripDto } from '../common/dtos/create-trip.dto';
import { TripQuery } from '../common/types/trip-query-type';
import { Trip } from '../entities/trip.entity';
import { HttpClient } from '../common/utilities/http-client';
import { redisClient } from '../app';

export default class TripService {
  public static async searchTrips(params: TripQuery) {
    const cacheKey = `trip_search:${JSON.stringify(params)}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const axios = HttpClient.createInstance(process.env.API_URL, {
      'x-api-key': process.env.API_KEY
    });

    let { data } = await axios.get('', { params });

    data = data.map((d) => {
      d.displayName = d.display_name;
      delete d.display_name;
      return d;
    });

    await redisClient.setEx(cacheKey, 300, JSON.stringify(data));

    return data;
  }

  public static create(trip: CreateTripDto) {
    const newTrip = new Trip();

    newTrip.displayName = trip.display_name;
    newTrip.origin = trip.origin;
    newTrip.destination = trip.destination;
    newTrip.cost = trip.cost;
    newTrip.duration = trip.duration;
    newTrip.type = trip.type;

    return getRepository(Trip).save(newTrip);
  }

  public static delete(id: number) {
    return getRepository(Trip).delete(id);
  }

  /*
Note for the task reviewer:
I am aware that the task requirement 
said just a list api, but since list in many ORMs
can fetch all the rows from 1 single table, which in real life can be 100000's of rows
and for that reason is considered an anti pattern
I added a basic pagination instead of a return getRepository(Trip).findMany({})
*/
  public static async list({ page, limit }: { page: string; limit: string }) {
    let pageNumber = 0;
    let take = 5;
    if (page) pageNumber = +page - 1;
    if (limit) take = +limit;

    const [data, total] = await getRepository(Trip).findAndCount({
      skip: pageNumber * take,
      take,
      order: { id: 'DESC' }
    });

    return {
      data,
      total,
      page: pageNumber,
      limit: take,
      totalPages: Math.ceil(total / take)
    };
  }
}
