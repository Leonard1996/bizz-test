import { ALLOWED_PLACES } from '../constants/trip-api-params';

export class CreateTripDto {
  origin: (typeof ALLOWED_PLACES)[number];
  destination: (typeof ALLOWED_PLACES)[number];
  cost: number;
  duration: number;
  type: string;
  display_name: string;
}
