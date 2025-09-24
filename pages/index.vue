<template>
  <div>
    <UContainer class="py-8">
      <div class="space-y-8">
        <!-- Header -->
        <div>
          <h1
            class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Dashboard
          </h1>
          <p class="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Willkommen, Herr Müller!
          </p>
        </div>

        <!-- Admin Dashboard -->
        <div v-if="authStore.isAdmin" class="space-y-6">
          <UAlert
            icon="i-heroicons-shield-check"
            color="blue"
            variant="soft"
            title="Administrator-Bereich"
            description="Sie haben erweiterte Berechtigungen für die Verwaltung."
          />

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-clock"
                    class="text-2xl text-blue-500"
                  />
                  <h3 class="text-lg font-semibold">Arbeitszeiten verwalten</h3>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Übersicht und Verwaltung aller Mitarbeiter-Arbeitszeiten
              </p>
              <UButton to="/admin/arbeitszeiten" block>
                Zu den Arbeitszeiten
              </UButton>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-calendar-days"
                    class="text-2xl text-green-500"
                  />
                  <h3 class="text-lg font-semibold">Urlaub verwalten</h3>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Urlaubsanträge bearbeiten und genehmigen
              </p>
              <UButton to="/admin/urlaub" color="green" block>
                Zu den Urlaubsanträgen
              </UButton>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-users"
                    class="text-2xl text-purple-500"
                  />
                  <h3 class="text-lg font-semibold">Mitarbeiter</h3>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Mitarbeiterverwaltung und Benutzerprofile
              </p>
              <UButton color="purple" block disabled> Bald verfügbar </UButton>
            </UCard>
          </div>
        </div>

        <!-- Employee Dashboard -->
        <div v-else class="space-y-6">
          <UAlert
            icon="i-heroicons-information-circle"
            color="primary"
            variant="soft"
            title="Willkommen im Mitarbeiterportal"
            description="Verwalten Sie Ihre Arbeitszeiten, Urlaub und mehr."
          />

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-clock"
                    class="text-2xl text-blue-500"
                  />
                  <h3 class="text-lg font-semibold">Arbeitszeiten</h3>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Erfassen und verwalten Sie Ihre Arbeitszeiten
              </p>
              <UButton to="/arbeitszeiten" color="blue" block>
                Zeiten erfassen
              </UButton>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-calendar-days"
                    class="text-2xl text-green-500"
                  />
                  <h3 class="text-lg font-semibold">Urlaub</h3>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Urlaubsanträge stellen und verwalten
              </p>
              <UButton to="/urlaub" color="green" block>
                Urlaub beantragen
              </UButton>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-truck"
                    class="text-2xl text-orange-500"
                  />
                  <h3 class="text-lg font-semibold">Car-Sharing</h3>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Firmenfahrzeuge teilen und buchen
              </p>
              <UButton to="/car-sharing" color="orange" block>
                Fahrzeuge anzeigen
              </UButton>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-user"
                    class="text-2xl text-purple-500"
                  />
                  <h3 class="text-lg font-semibold">Profil</h3>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Persönliche Daten und Einstellungen
              </p>
              <UButton to="/profile" color="purple" block>
                Profil bearbeiten
              </UButton>
            </UCard>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// Import auth store for role checking
const authStore = useAuthStore();
</script>
