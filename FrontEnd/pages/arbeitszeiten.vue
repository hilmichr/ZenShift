<template>
  <div>
    <UContainer class="py-8">
      <div class="space-y-8">
        <!-- Header -->
        <div>
          <h1
            class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Meine Arbeitszeiten
          </h1>
          <p class="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Erfassen Sie Ihre täglichen Arbeitszeiten zur Dokumentation.
          </p>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UCard>
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-clock" class="text-2xl text-blue-500" />
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Heute gearbeitet
                </p>
                <p class="text-2xl font-semibold">{{ todayWorkedHours }}h</p>
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-calendar-days"
                class="text-2xl text-green-500"
              />
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Diese Woche
                </p>
                <p class="text-2xl font-semibold">{{ weekWorkedHours }}h</p>
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-chart-bar"
                class="text-2xl text-purple-500"
              />
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Diesen Monat
                </p>
                <p class="text-2xl font-semibold">{{ monthWorkedHours }}h</p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Add Work Entry Form -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-plus-circle"
                class="text-2xl text-green-500"
              />
              <h2 class="text-xl font-semibold">Neue Arbeitszeit erfassen</h2>
            </div>
          </template>

          <UForm :state="form" @submit="create" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <UFormGroup label="Datum" name="date" required>
                <UInput
                  v-model="form.date"
                  type="date"
                  icon="i-heroicons-calendar"
                  size="lg"
                />
              </UFormGroup>

              <UFormGroup label="Startzeit" name="start" required>
                <UInput
                  v-model="form.start"
                  type="time"
                  icon="i-heroicons-clock"
                  size="lg"
                />
              </UFormGroup>

              <UFormGroup label="Endzeit" name="end" required>
                <UInput
                  v-model="form.end"
                  type="time"
                  icon="i-heroicons-clock"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormGroup label="Pause (Minuten)" name="breakMin">
                <UInput
                  v-model="form.breakMin"
                  type="number"
                  min="0"
                  placeholder="z.B. 30"
                  icon="i-heroicons-pause"
                  size="lg"
                />
              </UFormGroup>

              <UFormGroup label="Notizen" name="notes">
                <UInput
                  v-model="form.notes"
                  placeholder="Optional: Notizen zur Arbeitszeit"
                  icon="i-heroicons-pencil"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="flex justify-end">
              <UButton
                type="submit"
                size="lg"
                :loading="saving"
                icon="i-heroicons-plus"
                color="green"
              >
                Arbeitszeit hinzufügen
              </UButton>
            </div>
          </UForm>
        </UCard>

        <!-- Work Entries Table -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-table-cells"
                  class="text-2xl text-blue-500"
                />
                <h2 class="text-xl font-semibold">Arbeitszeiten Übersicht</h2>
              </div>
              <UBadge color="gray" variant="soft">
                {{ entries.length }} Einträge
              </UBadge>
            </div>
          </template>

          <div v-if="entries.length === 0" class="text-center py-12">
            <UIcon
              name="i-heroicons-clock"
              class="text-6xl text-gray-300 mx-auto mb-4"
            />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Noch keine Arbeitszeiten erfasst
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              Beginnen Sie mit der Erfassung Ihrer ersten Arbeitszeit.
            </p>
          </div>

          <UTable
            v-else
            :columns="columns"
            :rows="entries"
            :ui="{
              th: { base: 'text-left' },
              td: { base: 'whitespace-nowrap' },
            }"
          >
            <template #date-data="{ row }">
              <UBadge color="blue" variant="soft">
                {{ formatDate(row.date) }}
              </UBadge>
            </template>

            <template #startTime-data="{ row }">
              <span class="font-mono">{{ row.startTime }}</span>
            </template>

            <template #endTime-data="{ row }">
              <span class="font-mono">{{ row.endTime }}</span>
            </template>

            <template #breakMinutes-data="{ row }">
              <span class="text-gray-600">{{ row.breakMinutes }} min</span>
            </template>

            <template #durationMinutes-data="{ row }">
              <UBadge color="green" variant="soft">
                {{ formatDuration(row.durationMinutes) }}
              </UBadge>
            </template>

            <template #notes-data="{ row }">
              <span class="text-gray-600 italic">
                {{ row.notes || "-" }}
              </span>
            </template>

            <template #status-data="{ row }">
              <UBadge :color="getStatusColor(row.status)" variant="soft">
                {{ getStatusLabel(row.status) }}
              </UBadge>
            </template>

            <template #actions-data="{ row }">
              <UDropdown
                v-if="row.status === 'draft'"
                :items="[
                  [
                    {
                      label: 'Bearbeiten',
                      icon: 'i-heroicons-pencil',
                      click: () => editEntry(row),
                    },
                    {
                      label: 'Löschen',
                      icon: 'i-heroicons-trash',
                      click: () => deleteEntry(row.id),
                    },
                  ],
                ]"
              >
                <UButton
                  variant="ghost"
                  icon="i-heroicons-ellipsis-horizontal"
                />
              </UDropdown>
              <span v-else class="text-sm text-gray-500">Eingereicht</span>
            </template>
          </UTable>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp() as { $api: any };
const toast = useToast();
const entries = ref<any[]>([]);
const saving = ref(false);

// Computed statistics
const todayWorkedHours = computed(() => {
  const today = new Date().toISOString().split("T")[0];
  const todayEntries = entries.value.filter((e) => e.date === today);
  const totalMinutes = todayEntries.reduce(
    (sum, e) => sum + (e.durationMinutes || 0),
    0
  );
  return (totalMinutes / 60).toFixed(1);
});

const weekWorkedHours = computed(() => {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const weekEntries = entries.value.filter((e) => e.date >= weekStartStr);
  const totalMinutes = weekEntries.reduce(
    (sum, e) => sum + (e.durationMinutes || 0),
    0
  );
  return (totalMinutes / 60).toFixed(1);
});

const monthWorkedHours = computed(() => {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthStartStr = monthStart.toISOString().split("T")[0];

  const monthEntries = entries.value.filter((e) => e.date >= monthStartStr);
  const totalMinutes = monthEntries.reduce(
    (sum, e) => sum + (e.durationMinutes || 0),
    0
  );
  return (totalMinutes / 60).toFixed(1);
});

const form = reactive({
  date: new Date().toISOString().split("T")[0],
  start: "09:00",
  end: "17:00",
  breakMin: 30,
  notes: "",
});

const columns = [
  { key: "date", label: "Datum" },
  { key: "startTime", label: "Start" },
  { key: "endTime", label: "Ende" },
  { key: "breakMinutes", label: "Pause" },
  { key: "durationMinutes", label: "Dauer" },
  { key: "status", label: "Status" },
  { key: "notes", label: "Notizen" },
  { key: "actions", label: "Aktionen" },
];

onMounted(load);

async function load() {
  // try {
  //   const resp = await $api.get("/api/work-entries");
  //   entries.value = resp.data;
  // } catch (e: any) {
  //   toast.add({
  //     title: "Fehler beim Laden",
  //     description: "Arbeitszeiten konnten nicht geladen werden.",
  //     color: "red",
  //   });
  // }
}

function toTimeOnly(t: string) {
  return t; // server expects "HH:mm(:ss)" and binds to TimeOnly
}

async function create() {
  saving.value = true;
  try {
    const payload = {
      date: form.date,
      startTime: toTimeOnly(form.start),
      endTime: toTimeOnly(form.end),
      breakMinutes: form.breakMin,
      notes: form.notes,
    };
    // const resp = await $api.post("/api/work-entries", payload, {
    //   headers: { "Content-Type": "application/json" },
    // });
    // entries.value.unshift(resp.data);

    // Reset form
    form.date = new Date().toISOString().split("T")[0];
    form.start = "09:00";
    form.end = "17:00";
    form.breakMin = 30;
    form.notes = "";

    toast.add({
      title: "Arbeitszeit hinzugefügt",
      description: "Die Arbeitszeit wurde erfolgreich gespeichert.",
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-DE");
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function getStatusColor(status: string) {
  switch (status) {
    case "approved":
      return "green";
    case "rejected":
      return "red";
    case "pending":
      return "orange";
    case "draft":
      return "gray";
    default:
      return "gray";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "approved":
      return "Genehmigt";
    case "rejected":
      return "Abgelehnt";
    case "pending":
      return "Ausstehend";
    case "draft":
      return "Entwurf";
    default:
      return "Unbekannt";
  }
}

function editEntry(entry: any) {
  // Pre-fill form with entry data for editing
  form.date = entry.date;
  form.start = entry.startTime;
  form.end = entry.endTime;
  form.breakMin = entry.breakMinutes;
  form.notes = entry.notes;

  toast.add({
    title: "Bearbeitung",
    description: "Eintrag wurde zum Bearbeiten geladen.",
    color: "blue",
  });
}

async function deleteEntry(entryId: string) {
  if (!confirm("Möchten Sie diesen Eintrag wirklich löschen?")) {
    return;
  }

  try {
    // await $api.delete(`/api/work-entries/${entryId}`);

    // Remove from local array
    const index = entries.value.findIndex((e) => e.id === entryId);
    if (index > -1) {
      entries.value.splice(index, 1);
    }

    toast.add({
      title: "Gelöscht",
      description: "Arbeitszeit-Eintrag wurde gelöscht.",
      color: "orange",
    });
  } catch (error: any) {
    toast.add({
      title: "Fehler beim Löschen",
      description: "Der Eintrag konnte nicht gelöscht werden.",
      color: "red",
    });
  }
}
</script>
