import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// HTTP Link - Point to Gateway
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql',
});

// Auth Link - Add JWT token to headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  
  // 🔍 DEBUG: Log token info
  console.log('🔑 Apollo Auth Link:');
  console.log('   Token exists:', !!token);
  console.log('   Token preview:', token ? token.substring(0, 30) + '...' : 'NO TOKEN');
  
  const authHeaders = {
    ...headers,
    authorization: token ? `Bearer ${token}` : '',
  };
  
  console.log('   Authorization header:', authHeaders.authorization ? '✅ Set' : '❌ Not set');
  
  return {
    headers: authHeaders
  };
});

// Error Link - Handle GraphQL and Network errors
// Error Link - Handle GraphQL and Network errors
// Error Link - Handle GraphQL and Network errors
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, path, extensions }) => { // ✅ Removed 'locations'
      console.error(
        `[GraphQL error]: Message: ${message}, Path: ${path}`
      );
      
      if (extensions?.code === 'UNAUTHENTICATED' || message.includes('Not authenticated')) {
        console.error('⚠️ Authentication error detected');
        console.error('Operation:', operation.operationName);
        console.error('Variables:', operation.variables);
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]:`, networkError);
  }
});

// Apollo Client
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: false,
            merge(existing = { posts: [] }, incoming) {
              return {
                ...incoming,
                posts: [...existing.posts, ...incoming.posts],
              };
            },
          },
          jobs: {
            keyArgs: false,
            merge(existing = { jobs: [] }, incoming) {
              return {
                ...incoming,
                jobs: [...existing.jobs, ...incoming.jobs],
              };
            },
          },
          events: {
            keyArgs: false,
            merge(existing = { events: [] }, incoming) {
              return {
                ...incoming,
                events: [...existing.events, ...incoming.events],
              };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;