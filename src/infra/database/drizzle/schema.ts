import { pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const projectType = pgEnum('project_type', [
  'frontend',
  'backend',
  'fullstack',
])

export const usersTable = pgTable('users', {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  username: text().notNull().unique(),
  avatarUrl: text().notNull(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp(),
})

export const projectsTable = pgTable('projects', {
  id: text().primaryKey(),
  name: varchar({ length: 50 }).notNull(),
  description: varchar({ length: 300 }).notNull(),
  type: projectType().notNull(),
  userId: text()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
  imageUrl: text(),
  imageId: text(),
  githubUrl: text().notNull(),
  deployUrl: text(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp(),
})

export const techsTable = pgTable('techs', {
  id: text().primaryKey(),
  name: text().notNull().unique(),
  imageUrl: text().notNull(),
  imageId: text().notNull(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp(),
})
