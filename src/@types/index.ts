export interface MovieTicketData {
  key?: string;
  _id?: string;
  title: string;
  ageRestriction: number;
  image: string;
  targetAudience: string;
  genre: string[];
  availableDate: string;
  availableTime: string;
  format: string;
  price: number;
  hallNumber: number;
  director: string;
  duration: number;
  country: string;
  year: number;
  description: string;
  ticket_count?: string;
}