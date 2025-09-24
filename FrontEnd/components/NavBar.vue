<template>
  <div
    class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20 shadow-md"
  >
    <UContainer>
      <div class="flex items-center justify-between py-4">
        <!-- Logo -->
        <div>
          <NuxtLink
            to="/"
            class="text-2xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent hover:from-purple-700 hover:via-blue-600 hover:to-cyan-500 transition-all duration-500 hover:scale-105 drop-shadow-sm"
          >
            💼 Firma Manager
          </NuxtLink>
        </div>

        <!-- Navigation and User Menu -->
        <div class="flex items-center gap-4">
          <nav class="hidden md:flex items-center gap-1">
            <NuxtLink
              to="/arbeitszeiten"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              title="Arbeitszeiten"
            >
              <UIcon name="i-heroicons-clock" class="w-7 h-7" />
            </NuxtLink>
            <NuxtLink
              to="/car-sharing"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              title="Car-Sharing"
            >
              <UIcon name="i-heroicons-truck" class="w-7 h-7" />
            </NuxtLink>
            <NuxtLink
              to="/urlaub"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              title="Urlaub"
            >
              <UIcon name="i-heroicons-calendar-days" class="w-7 h-7" />
            </NuxtLink>
            <NuxtLink
              v-if="auth.user?.roles.includes('admin')"
              to="/admin/arbeitszeiten"
              class="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors duration-200 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              title="Admin"
            >
              <UIcon name="i-heroicons-cog-6-tooth" class="w-7 h-7" />
            </NuxtLink>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center gap-3">
            <span
              class="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block"
            >
              {{ auth.user?.fullName }}
            </span>

            <UDropdown :items="userMenuItems">
              <UAvatar
                :alt="auth.user?.fullName"
                size="sm"
                :ui="{
                  background: 'bg-gradient-to-r from-purple-500 to-blue-500',
                }"
              />
            </UDropdown>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore();

const userMenuItems = [
  [
    {
      label: "Profil",
      icon: "i-heroicons-user",
      click: () => navigateTo("/profile"),
    },
  ],
  [
    {
      label: "Abmelden",
      icon: "i-heroicons-arrow-right-on-rectangle",
      click: () => auth.logout(),
    },
  ],
];
</script>
