<template>
  <div>
    <UButton
      disabled
      :loading="loading"
      color="jade"
      label="Button Label"
      class="rounded-lg"
      :ui="{
        strategy: 'override',
        base: 'focus:outline-dashed',
        rounded: 'rounded-full',
      }"
    />
  </div>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900">Anmelden</h1>
        </div>
      </template>

      <UForm :state="state" @submit="onSubmit" class="space-y-4">
        <UFormGroup label="E-Mail" name="email">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="E-Mail eingeben"
            icon="i-heroicons-envelope"
            size="lg"
          />
        </UFormGroup>

        <UFormGroup label="Passwort" name="password">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="Passwort eingeben"
            icon="i-heroicons-lock-closed"
            size="lg"
          />
        </UFormGroup>

        <UButton type="submit" size="lg" block :loading="loading">
          Anmelden
        </UButton>
      </UForm>

      <template #footer>
        <UAlert
          icon="i-heroicons-information-circle"
          color="blue"
          variant="soft"
          title="Demo Zugang"
          description="Admin: admin@example.com / Passw0rd!"
        />
      </template>
    </UCard>
  </div>
</template>

<script setup>
const loading = ref(true);
const state = reactive({
  email: "",
  password: "",
});

const onSubmit = (data) => {
  console.log(data);
};
</script>

<style lang="scss" scoped></style>
