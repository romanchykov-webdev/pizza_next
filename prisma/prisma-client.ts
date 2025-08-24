// // lib/prismaDynamic.ts
// import { PrismaClient } from '@prisma/client';
//
// type TenantConfig = {
//   databaseUrl: string;
// };
//
// export function createPrismaClient(config: TenantConfig): PrismaClient {
//   return new PrismaClient({
//     datasources: {
//       db: {
//         url: config.databaseUrl,
//       },
//     },
//   });
// }
// import { PrismaClient } from '@prisma/client';
// const prismaClientSingleton = () = {
//   return new PrismaClient();
// };
// declare global {
//   var prismaGlobal: undefined | Return Type<typeof prismaClientSingleton>;
// }
// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
// export default prisma;
//
// if (process.env.NODE_ENV 'production') globalThis.prismaGlobal = prisma;

// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  // Чтобы TS не ругался при повторном объявлении
  // и чтобы хранить prisma в глобальной области
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

// export default prisma;
