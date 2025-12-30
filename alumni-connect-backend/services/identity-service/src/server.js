import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import cors from 'cors';
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';
import { authenticate } from './middlewares/auth.middleware.js';

const app = express();
const PORT = process.env.PORT || 4001;

// Apollo Server setup
const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
      extensions: {
        code: error.extensions?.code,
        ...error.extensions,
      },
    };
  },
});

await server.start();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// GraphQL endpoint with authentication context
app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => {
      const user = authenticate(req);
      return { user };
    },
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'identity-service' });
});

app.listen(PORT, () => {
  console.log(`🚀 Identity Service running on http://localhost:${PORT}/graphql`);
});