import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const projectType = pgEnum('project_type', [
  'frontend',
  'backend',
  'fullstack',
])

export const usersTable = pgTable('users', {
  id: text().primaryKey(),
  name: text().notNull(),
  githubId: integer().notNull().unique(),
  githubHashedAccessToken: text().notNull(),
  username: text().notNull().unique(),
  isPublicProfile: boolean(),
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
  imageSizeInBytes: integer(),
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

export const projectTechTable = pgTable(
  'project_tech',
  {
    projectId: text()
      .notNull()
      .references(() => projectsTable.id, {
        onDelete: 'cascade',
      }),
    techId: text()
      .notNull()
      .references(() => techsTable.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => [
    primaryKey({
      columns: [table.projectId, table.techId],
    }),
  ]
)
