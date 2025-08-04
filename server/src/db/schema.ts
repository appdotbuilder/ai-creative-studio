
import { serial, text, pgTable, timestamp, integer, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['user', 'assistant', 'system']);
export const messageTypeEnum = pgEnum('message_type', ['text', 'image', 'video', 'code']);
export const fileTypeEnum = pgEnum('file_type', ['image', 'video']);
export const searchTypeEnum = pgEnum('search_type', ['deep_search', 'think']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// AI Models table
export const aiModelsTable = pgTable('ai_models', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  provider: text('provider').notNull(),
  model_type: text('model_type').notNull(),
  capabilities: jsonb('capabilities').notNull(), // Array of strings stored as JSONB
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Chat Sessions table
export const chatSessionsTable = pgTable('chat_sessions', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => usersTable.id).notNull(),
  title: text('title').notNull(),
  ai_model_id: integer('ai_model_id').references(() => aiModelsTable.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Messages table
export const messagesTable = pgTable('messages', {
  id: serial('id').primaryKey(),
  session_id: integer('session_id').references(() => chatSessionsTable.id).notNull(),
  role: roleEnum('role').notNull(),
  content: text('content').notNull(),
  message_type: messageTypeEnum('message_type').default('text').notNull(),
  metadata: jsonb('metadata'), // Nullable for additional message data
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Media Files table
export const mediaFilesTable = pgTable('media_files', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => usersTable.id).notNull(),
  filename: text('filename').notNull(),
  original_filename: text('original_filename').notNull(),
  file_type: fileTypeEnum('file_type').notNull(),
  file_size: integer('file_size').notNull(),
  mime_type: text('mime_type').notNull(),
  file_path: text('file_path').notNull(),
  metadata: jsonb('metadata'), // Nullable for EXIF data, dimensions, etc.
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Search Queries table
export const searchQueriesTable = pgTable('search_queries', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => usersTable.id).notNull(),
  query: text('query').notNull(),
  search_type: searchTypeEnum('search_type').notNull(),
  ai_model_id: integer('ai_model_id').references(() => aiModelsTable.id).notNull(),
  results: jsonb('results'), // Nullable for storing search results
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  chatSessions: many(chatSessionsTable),
  mediaFiles: many(mediaFilesTable),
  searchQueries: many(searchQueriesTable),
}));

export const aiModelsRelations = relations(aiModelsTable, ({ many }) => ({
  chatSessions: many(chatSessionsTable),
  searchQueries: many(searchQueriesTable),
}));

export const chatSessionsRelations = relations(chatSessionsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [chatSessionsTable.user_id],
    references: [usersTable.id],
  }),
  aiModel: one(aiModelsTable, {
    fields: [chatSessionsTable.ai_model_id],
    references: [aiModelsTable.id],
  }),
  messages: many(messagesTable),
}));

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  session: one(chatSessionsTable, {
    fields: [messagesTable.session_id],
    references: [chatSessionsTable.id],
  }),
}));

export const mediaFilesRelations = relations(mediaFilesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [mediaFilesTable.user_id],
    references: [usersTable.id],
  }),
}));

export const searchQueriesRelations = relations(searchQueriesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [searchQueriesTable.user_id],
    references: [usersTable.id],
  }),
  aiModel: one(aiModelsTable, {
    fields: [searchQueriesTable.ai_model_id],
    references: [aiModelsTable.id],
  }),
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type AIModel = typeof aiModelsTable.$inferSelect;
export type NewAIModel = typeof aiModelsTable.$inferInsert;

export type ChatSession = typeof chatSessionsTable.$inferSelect;
export type NewChatSession = typeof chatSessionsTable.$inferInsert;

export type Message = typeof messagesTable.$inferSelect;
export type NewMessage = typeof messagesTable.$inferInsert;

export type MediaFile = typeof mediaFilesTable.$inferSelect;
export type NewMediaFile = typeof mediaFilesTable.$inferInsert;

export type SearchQuery = typeof searchQueriesTable.$inferSelect;
export type NewSearchQuery = typeof searchQueriesTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  users: usersTable,
  aiModels: aiModelsTable,
  chatSessions: chatSessionsTable,
  messages: messagesTable,
  mediaFiles: mediaFilesTable,
  searchQueries: searchQueriesTable,
};
