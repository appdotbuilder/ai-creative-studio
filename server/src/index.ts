
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createUserInputSchema,
  createAIModelInputSchema,
  createChatSessionInputSchema,
  createMessageInputSchema,
  uploadMediaInputSchema,
  createSearchQueryInputSchema,
  cropImageInputSchema,
  resizeMediaInputSchema,
  applyFilterInputSchema,
  chatInputSchema,
  codeGenerationInputSchema,
  dateTimeQueryInputSchema
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { getAIModels } from './handlers/get_ai_models';
import { createAIModel } from './handlers/create_ai_model';
import { createChatSession } from './handlers/create_chat_session';
import { getChatSessions } from './handlers/get_chat_sessions';
import { sendMessage } from './handlers/send_message';
import { getMessages } from './handlers/get_messages';
import { chatWithAI } from './handlers/chat_with_ai';
import { uploadMedia } from './handlers/upload_media';
import { getMediaFiles } from './handlers/get_media_files';
import { cropImage } from './handlers/crop_image';
import { resizeMedia } from './handlers/resize_media';
import { applyFilter } from './handlers/apply_filter';
import { deepSearch } from './handlers/deep_search';
import { thinkSearch } from './handlers/think_search';
import { generateCode } from './handlers/generate_code';
import { getCurrentDateTime } from './handlers/get_current_datetime';
import { getSearchHistory } from './handlers/get_search_history';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User management
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),

  // AI Models
  getAIModels: publicProcedure
    .query(() => getAIModels()),
  
  createAIModel: publicProcedure
    .input(createAIModelInputSchema)
    .mutation(({ input }) => createAIModel(input)),

  // Chat Sessions
  createChatSession: publicProcedure
    .input(createChatSessionInputSchema)
    .mutation(({ input }) => createChatSession(input)),
  
  getChatSessions: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getChatSessions(input.userId)),

  // Messages and Chat
  sendMessage: publicProcedure
    .input(createMessageInputSchema)
    .mutation(({ input }) => sendMessage(input)),
  
  getMessages: publicProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(({ input }) => getMessages(input.sessionId)),
  
  chatWithAI: publicProcedure
    .input(chatInputSchema)
    .mutation(({ input }) => chatWithAI(input)),

  // Media Management
  uploadMedia: publicProcedure
    .input(uploadMediaInputSchema)
    .mutation(({ input }) => uploadMedia(input)),
  
  getMediaFiles: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getMediaFiles(input.userId)),

  // Media Editing
  cropImage: publicProcedure
    .input(cropImageInputSchema)
    .mutation(({ input }) => cropImage(input)),
  
  resizeMedia: publicProcedure
    .input(resizeMediaInputSchema)
    .mutation(({ input }) => resizeMedia(input)),
  
  applyFilter: publicProcedure
    .input(applyFilterInputSchema)
    .mutation(({ input }) => applyFilter(input)),

  // Search Features
  deepSearch: publicProcedure
    .input(createSearchQueryInputSchema)
    .mutation(({ input }) => deepSearch(input)),
  
  thinkSearch: publicProcedure
    .input(createSearchQueryInputSchema)
    .mutation(({ input }) => thinkSearch(input)),
  
  getSearchHistory: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getSearchHistory(input.userId)),

  // Code Generation
  generateCode: publicProcedure
    .input(codeGenerationInputSchema)
    .mutation(({ input }) => generateCode(input)),

  // DateTime Tools
  getCurrentDateTime: publicProcedure
    .input(dateTimeQueryInputSchema)
    .query(({ input }) => getCurrentDateTime(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`AI Web Application TRPC server listening at port: ${port}`);
}

start();
