import { vi, describe, it, expect } from 'vitest';
import { Request, Response } from 'express';
import { TripMiddleware } from '../../middlewares/trip.middleware';

describe('TripMiddleware', () => {
  describe('validateQuery', () => {
    it('should call next() for valid query parameters', () => {
      const req = { query: { origin: 'FRA', destination: 'JFK', sort_by: 'cheapest' } } as any as Request;
      const res = {} as Response;
      const next = vi.fn();

      TripMiddleware.validateQuery(req, res, next);

      expect(next).toHaveBeenCalledOnce();
    });

    it('should return 400 for invalid query parameters', () => {
      const req = { query: { origin: 'InvalidPlace', destination: 'PlaceB', sort_by: 'asc' } } as any as Request;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any as Response;
      const next = vi.fn();

      TripMiddleware.validateQuery(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateCreateTrip', () => {
    it('should call next() for valid body parameters', () => {
      const req = {
        body: {
          origin: 'FRA',
          destination: 'JFK',
          cost: 100,
          duration: 10,
          type: 'car',
          display_name: 'Trip1'
        }
      } as Request;
      const res = {} as Response;
      const next = vi.fn();

      TripMiddleware.validateCreateTrip(req, res, next);

      expect(next).toHaveBeenCalledOnce();
    });

    it('should return 400 for invalid body parameters', () => {
      const req = {
        body: {
          origin: 'InvalidPlace',
          destination: 'PlaceB',
          cost: 100,
          duration: 10,
          type: 'typeA',
          display_name: 'Trip1'
        }
      } as Request;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any as Response;
      const next = vi.fn();

      TripMiddleware.validateCreateTrip(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateTripId', () => {
    it('should call next() for valid trip ID', () => {
      const req = { params: { id: '123' } } as any as Request;
      const res = {} as Response;
      const next = vi.fn();

      TripMiddleware.validateTripId(req, res, next);

      expect(next).toHaveBeenCalledOnce();
    });

    it('should return 400 for invalid trip ID', () => {
      const req = { params: { id: 'abc' } } as any as Request;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any as Response;
      const next = vi.fn();

      TripMiddleware.validateTripId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid trip ID'
      });
    });
  });
});
