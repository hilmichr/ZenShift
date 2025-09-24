<template>
  <div>

    <UContainer class="py-8">
      <div class="max-w-2xl mx-auto space-y-8">
        <!-- Header -->
        <div>
          <h1
            class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Profil bearbeiten
          </h1>
          <p class="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Verwalten Sie Ihre persönlichen Informationen und Einstellungen.
          </p>
        </div>

        <!-- Profile Form -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-user-circle"
                class="text-2xl text-primary"
              />
              <h2 class="text-xl font-semibold">Persönliche Daten</h2>
            </div>
          </template>

          <UForm :state="form" @submit="save" class="space-y-6">
            <UFormGroup label="Vollständiger Name" name="fullName" required>
              <UInput
                v-model="form.fullName"
                placeholder="Ihr vollständiger Name"
                icon="i-heroicons-user"
                size="lg"
              />
            </UFormGroup>

            <UFormGroup label="E-Mail Adresse" name="email">
              <UInput
                :value="auth.user?.email"
                disabled
                icon="i-heroicons-envelope"
                size="lg"
                :ui="{ base: 'disabled:opacity-75' }"
              />
              <template #hint>
                <span class="text-sm text-gray-500"
                  >E-Mail kann nicht geändert werden</span
                >
              </template>
            </UFormGroup>

            <UFormGroup label="Telefonnummer" name="phone">
              <UInput
                v-model="form.phone"
                placeholder="Optional: +49 123 456789"
                icon="i-heroicons-phone"
                size="lg"
              />
            </UFormGroup>

            <UFormGroup label="Adresse" name="homeAddress">
              <UTextarea
                v-model="form.homeAddress"
                placeholder="Optional: Ihre Adresse für Car-Sharing"
                :rows="3"
              />
            </UFormGroup>

            <div class="space-y-4">
              <UFormGroup name="hasCar">
                <UCheckbox
                  v-model="form.hasCar"
                  label="Ich besitze ein Auto"
                  help="Für Car-Sharing Funktionen relevant"
                />
              </UFormGroup>

              <UFormGroup name="showAddressPublic">
                <UCheckbox
                  v-model="form.showAddressPublic"
                  label="Meine Adresse öffentlich anzeigen"
                  help="Andere Mitarbeiter können Ihre ungefähre Position für Car-Sharing sehen"
                />
              </UFormGroup>
            </div>

            <div class="flex justify-end">
              <UButton
                type="submit"
                size="lg"
                :loading="saving"
                icon="i-heroicons-check"
              >
                Änderungen speichern
              </UButton>
            </div>
          </UForm>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// TODO: Uncomment when backend is ready
// const auth = useAuthStore();
// const { $api } = useNuxtApp();
const toast = useToast();
const saving = ref(false);

// Mock user data until backend is ready
const mockUser = {
  email: "max.mustermann@firma.de",
  fullName: "Max Mustermann",
  phone: "+49 123 456789",
  homeAddress: "Musterstraße 123\n12345 Berlin",
  latitude: 52.52,
  longitude: 13.405,
  hasCar: true,
  showAddressPublic: false,
};

// Mock auth object for template compatibility
const auth = {
  user: mockUser,
};

const form = reactive({
  fullName: mockUser.fullName || "",
  phone: mockUser.phone || "",
  homeAddress: mockUser.homeAddress || "",
  latitude: mockUser.latitude || (null as number | null),
  longitude: mockUser.longitude || (null as number | null),
  hasCar: mockUser.hasCar || false,
  showAddressPublic: mockUser.showAddressPublic || false,
});

async function save() {
  saving.value = true;
  try {
    // TODO: Replace with actual API call when backend is ready
    // await $api.put("/api/users/me", form);
    // await auth.fetchMe();

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update mock data with form values
    Object.assign(mockUser, form);

    toast.add({
      title: "Profil gespeichert",
      description: "Ihre Änderungen wurden erfolgreich gespeichert.",
      color: "green",
    });
  } catch (e: any) {
    toast.add({
      title: "Fehler beim Speichern",
      description:
        e?.response?.data?.detail ?? "Ein unbekannter Fehler ist aufgetreten.",
      color: "red",
    });
  } finally {
    saving.value = false;
  }
}
</script>
