
import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// AI Model schema
export const aiModelSchema = z.object({
  id: z.number(),
  name: z.string(),
  provider: z.string(),
  model_type: z.string(),
  capabilities: z.array(z.string()),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type AIModel = z.infer<typeof aiModelSchema>;

// Chat Session schema
export const chatSessionSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string(),
  ai_model_id: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type ChatSession = z.infer<typeof chatSessionSchema>;

// Message schema
export const messageSchema = z.object({
  id: z.number(),
  session_id: z.number(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  message_type: z.enum(['text', 'image', 'video', 'code']),
  metadata: z.record(z.any()).nullable(),
  created_at: z.coerce.date()
});

export type Message = z.infer<typeof messageSchema>;

// Media File schema
export const mediaFileSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  filename: z.string(),
  original_filename: z.string(),
  file_type: z.enum(['image', 'video']),
  file_size: z.number(),
  mime_type: z.string(),
  file_path: z.string(),
  metadata: z.record(z.any()).nullable(),
  created_at: z.coerce.date()
});

export type MediaFile = z.infer<typeof mediaFileSchema>;

// Search Query schema
export const searchQuerySchema = z.object({
  id: z.number(),
  user_id: z.number(),
  query: z.string(),
  search_type: z.enum(['deep_search', 'think']),
  ai_model_id: z.number(),
  results: z.record(z.any()).nullable(),
  created_at: z.coerce.date()
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

// Input schemas for creating entities

export const createUserInputSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email()
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createAIModelInputSchema = z.object({
  name: z.string(),
  provider: z.string(),
  model_type: z.string(),
  capabilities: z.array(z.string()),
  is_active: z.boolean().default(true)
});

export type CreateAIModelInput = z.infer<typeof createAIModelInputSchema>;

export const createChatSessionInputSchema = z.object({
  user_id: z.number(),
  title: z.string(),
  ai_model_id: z.number()
});

export type CreateChatSessionInput = z.infer<typeof createChatSessionInputSchema>;

export const createMessageInputSchema = z.object({
  session_id: z.number(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  message_type: z.enum(['text', 'image', 'video', 'code']).default('text'),
  metadata: z.record(z.any()).nullable().optional()
});

export type CreateMessageInput = z.infer<typeof createMessageInputSchema>;

export const uploadMediaInputSchema = z.object({
  user_id: z.number(),
  filename: z.string(),
  original_filename: z.string(),
  file_type: z.enum(['image', 'video']),
  file_size: z.number(),
  mime_type: z.string(),
  file_path: z.string(),
  metadata: z.record(z.any()).nullable().optional()
});

export type UploadMediaInput = z.infer<typeof uploadMediaInputSchema>;

export const createSearchQueryInputSchema = z.object({
  user_id: z.number(),
  query: z.string(),
  search_type: z.enum(['deep_search', 'think']),
  ai_model_id: z.number()
});

export type CreateSearchQueryInput = z.infer<typeof createSearchQueryInputSchema>;

// Media editing schemas
export const cropImageInputSchema = z.object({
  media_id: z.number(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number()
});

export type CropImageInput = z.infer<typeof cropImageInputSchema>;

export const resizeMediaInputSchema = z.object({
  media_id: z.number(),
  width: z.number(),
  height: z.number(),
  maintain_aspect_ratio: z.boolean().default(true)
});

export type ResizeMediaInput = z.infer<typeof resizeMediaInputSchema>;

export const applyFilterInputSchema = z.object({
  media_id: z.number(),
  filter_type: z.enum(['blur', 'sharpen', 'brightness', 'contrast', 'saturation', 'sepia', 'grayscale']),
  intensity: z.number().min(0).max(100).default(50)
});

export type ApplyFilterInput = z.infer<typeof applyFilterInputSchema>;

// Chat and AI interaction schemas
export const chatInputSchema = z.object({
  session_id: z.number(),
  message: z.string(),
  ai_model_id: z.number().optional()
});

export type ChatInput = z.infer<typeof chatInputSchema>;

export const codeGenerationInputSchema = z.object({
  user_id: z.number(),
  prompt: z.string(),
  language: z.string(),
  ai_model_id: z.number()
});

export type CodeGenerationInput = z.infer<typeof codeGenerationInputSchema>;

export const dateTimeQueryInputSchema = z.object({
  timezone: z.string().optional(),
  format: z.string().optional()
});

export type DateTimeQueryInput = z.infer<typeof dateTimeQueryInputSchema>;
