import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apolloClient from '../../../lib/apollo-client';
import { REGISTER_MUTATION, LOGIN_MUTATION } from '../../../graphql/auth.mutations';
import { ME_QUERY } from '../../../graphql/auth.queries';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data } = await apolloClient.mutate({
            mutation: LOGIN_MUTATION,
            variables: {
              input: { email, password }
            }
          });

          const { user, token } = data.login;
          
          const userData = {
            id: user.id,
            name: user.profile?.fullName || 'User',
            email: user.email,
            role: user.role.toLowerCase(),
            status: user.status,
            batch: user.profile?.batch || null,
            major: user.profile?.major || null,
            nim: user.profile?.nim || null,
            graduationYear: user.profile?.graduationYear || null,
            avatar: user.profile?.avatar || null,
          };
          
          set({
            user: userData,
            token: token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          return { success: true, user: userData };
        } catch (error) {
          const errorMessage = error.message || 'Login failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          return { success: false, error: errorMessage };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data } = await apolloClient.mutate({
            mutation: REGISTER_MUTATION,
            variables: {
              input: {
                email: userData.email,
                password: userData.password,
                fullName: userData.fullName,
                nim: userData.nim || null,
                batch: userData.batch || null,
                major: userData.major || 'Sistem Informasi',
                graduationYear: userData.graduationYear ? parseInt(userData.graduationYear) : null,
              }
            }
          });

          const { user, token } = data.register;
          
          const newUser = {
            id: user.id,
            name: user.profile?.fullName || 'User',
            email: user.email,
            role: user.role.toLowerCase(),
            status: user.status,
            batch: user.profile?.batch || null,
            major: user.profile?.major || null,
            nim: user.profile?.nim || null,
            graduationYear: user.profile?.graduationYear || null,
            avatar: user.profile?.avatar || null,
          };
          
          set({
            user: newUser,
            token: token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          return { success: true, user: newUser };
        } catch (error) {
          const errorMessage = error.message || 'Registration failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          return { success: false, error: errorMessage };
        }
      },

      fetchUser: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const { data } = await apolloClient.query({
            query: ME_QUERY,
            fetchPolicy: 'network-only',
          });

          const user = data.me;
          
          const userData = {
            id: user.id,
            name: user.profile?.fullName || 'User',
            email: user.email,
            role: user.role.toLowerCase(),
            status: user.status,
            batch: user.profile?.batch || null,
            major: user.profile?.major || null,
            nim: user.profile?.nim || null,
            graduationYear: user.profile?.graduationYear || null,
            avatar: user.profile?.avatar || null,
          };
          
          set({ user: userData });
          return userData;
        } catch (error) {
          console.error('Failed to fetch user:', error);
          get().logout();
        }
      },

      logout: () => {
        apolloClient.clearStore();
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;