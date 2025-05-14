import { ALLOWED_PLACES, SORT_OPTIONS } from '../constants/trip-api-params';

export type TripQuery = {
  origin: (typeof ALLOWED_PLACES)[number];
  destination: (typeof ALLOWED_PLACES)[number];
  sorty_by: (typeof SORT_OPTIONS)[number];
};
