import path from "path"

const config = {
  schema: path.join(__dirname, "prisma/schema.prisma"),
  migrate: {
    migrations: path.join(__dirname, "prisma/migrations"),
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
}

export default config
