


import { Role } from "@prisma/client";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;  // ← Prisma এর Role
  bio: string | null;
  interests: string[];
  visitedCountries: string[];
  currentLocation: string | null;
};


export type createUserInput={
    name:string,
    email:string,
    password:string
}