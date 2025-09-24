// Pinia client-side initialization plugin
export default defineNuxtPlugin(() => {
  // This plugin ensures Pinia is properly initialized on the client side
  // The @pinia/nuxt module should handle most of the setup automatically

  // Initialize auth store on client load
  if (process.client) {
    const authStore = useAuthStore();

    // Initialize authentication from stored token
    authStore.initializeAuth();
  }
});
