import { registerAs } from '@nestjs/config';

// export interface AuthConfigDyanmic {
//   jwt: {
//     secret: string;
//     expiredIn: string;
//   };
// }

// export const authConfigDyanmic = registerAs(
//   'jwt',
//   (): AuthConfig => ({
//     jwt: {
//       secret: process.env.JWT_SECRET,
//       expiredIn: process.env.JWT_EXPIRES_IN,
//     },
//   }),
// );

export interface AuthConfig {
  secret: string;
  signOptions: {
    expiresIn: string;
  };
}

export const authConfig = registerAs(
  'auth',
  (): AuthConfig => ({
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  }),
);
