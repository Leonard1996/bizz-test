import { createConnection, Connection, getRepository } from 'typeorm';
import TripService from '../../services/trip.service';
import { CreateTripDto } from '../../common/dtos/create-trip.dto';
import { Trip } from '../../entities/trip.entity';

let connection: Connection;

describe('Trip API Integration Tests', () => {
  beforeAll(async () => {
    connection = await createConnection({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      dropSchema: true,
      entities: [Trip]
    });
  });

  beforeEach(async () => {
    const repo = getRepository(Trip);
    await repo.clear();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should create and save a new trip', async () => {
    const createTripDto = {
      origin: 'SYD',
      destination: 'GRU',
      cost: 625,
      duration: 5,
      type: 'flight',
      display_name: 'from SYD to GRU by flight'
    } as CreateTripDto;

    const savedTrip = await TripService.create(createTripDto);

    expect(savedTrip).toHaveProperty('id');
    expect(savedTrip.origin).toBe(createTripDto.origin);
    expect(savedTrip.destination).toBe(createTripDto.destination);
  });

  it('should delete a trip by ID', async () => {
    const created = await TripService.create({
      display_name: 'Trip to Delete',
      origin: 'FRA',
      destination: 'JFK',
      cost: 200,
      duration: 4,
      type: 'train'
    });

    const result = await TripService.delete(created.id);
    expect(result.affected).toBe(1);
    const deleted = await getRepository(Trip).findOne({
      id: created.id
    });
    expect(deleted).toBe(undefined);
  });

  it('should return paginated and sorted trips', async () => {
    for (let i = 1; i <= 10; i++) {
      const trip = new Trip();
      trip.displayName = `Trip ${i}`;
      trip.origin = 'Origin';
      trip.destination = 'Destination';
      trip.cost = i * 10;
      trip.duration = i;
      trip.type = 'type';
      await getRepository(Trip).save(trip);
    }
    const result = await TripService.list({ page: '1', limit: '5' });

    expect(result.total).toBe(10);
    expect(result.page).toBe(0);
    expect(result.limit).toBe(5);
    expect(result.totalPages).toBe(2);
    expect(result.data.length).toBe(5);

    expect(result.data[0].displayName).toBe('Trip 10');
    expect(result.data[4].displayName).toBe('Trip 6');
  });
});
