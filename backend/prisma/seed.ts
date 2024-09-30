import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();
async function main() {
  const hashPassword = await hash("123456", 8);
  const admin = await prisma.user.upsert({
    where: { email: "admin@protectdata.com.br" },
    update: {},
    create: {
      manager: true,
      email: "admin@protectdata.com.br",
      password: hashPassword,
      name: "Administrador"
    }
  });
  console.log({ admin });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
