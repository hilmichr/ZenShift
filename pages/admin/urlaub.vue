<template>
  <div>
    <UContainer class="py-8">
      <div class="space-y-8">
        <!-- Header -->
        <div>
          <h1
            class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Urlaub Verwaltung
          </h1>
          <p class="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Verwaltung und Genehmigung aller Urlaubsanträge.
          </p>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <UCard>
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-clock"
                class="text-2xl text-orange-500"
              />
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Offene Anträge
                </p>
                <p class="text-2xl font-semibold">
                  {{ statistics.pendingRequests }}
                </p>
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-check-circle"
                class="text-2xl text-green-500"
              />
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Heute genehmigt
                </p>
                <p class="text-2xl font-semibold">
                  {{ statistics.approvedToday }}
                </p>
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-calendar-days"
                class="text-2xl text-blue-500"
              />
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Aktuell im Urlaub
                </p>
                <p class="text-2xl font-semibold">
                  {{ statistics.currentlyOnVacation }}
                </p>
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-exclamation-triangle"
                class="text-2xl text-red-500"
              />
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Konflikte
                </p>
                <p class="text-2xl font-semibold">{{ statistics.conflicts }}</p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Vacation Requests Table -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-calendar-days"
                  class="text-2xl text-green-500"
                />
                <h2 class="text-xl font-semibold">Urlaubsanträge</h2>
              </div>
              <div class="flex gap-2">
                <UButton
                  icon="i-heroicons-arrow-down-tray"
                  variant="outline"
                  @click="exportVacationData"
                >
                  Export
                </UButton>
                <UBadge color="gray" variant="soft">
                  {{ vacationRequests.length }} Anträge
                </UBadge>
              </div>
            </div>
          </template>

          <div v-if="vacationRequests.length === 0" class="text-center py-12">
            <UIcon
              name="i-heroicons-calendar-days"
              class="text-6xl text-gray-300 mx-auto mb-4"
            />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Keine Urlaubsanträge vorhanden
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              Noch keine Urlaubsanträge eingereicht.
            </p>
          </div>

          <UTable
            v-else
            :columns="vacationColumns"
            :rows="vacationRequests"
            :loading="loading"
            :ui="{
              th: { base: 'text-left' },
              td: { base: 'whitespace-nowrap' },
            }"
          >
            <template #employee-data="{ row }">
              <div class="flex items-center gap-3">
                <UAvatar :alt="row.employeeName" size="sm" />
                <div>
                  <p class="font-medium">{{ row.employeeName }}</p>
                  <p class="text-sm text-gray-500">{{ row.employeeEmail }}</p>
                </div>
              </div>
            </template>

            <template #type-data="{ row }">
              <UBadge :color="getVacationTypeColor(row.type)" variant="soft">
                {{ getVacationTypeLabel(row.type) }}
              </UBadge>
            </template>

            <template #dateRange-data="{ row }">
              <div>
                <p class="font-medium">{{ formatDate(row.startDate) }}</p>
                <p class="text-sm text-gray-500">
                  bis {{ formatDate(row.endDate) }}
                </p>
              </div>
            </template>

            <template #days-data="{ row }">
              <UBadge color="blue" variant="soft">
                {{ row.dayCount }} Tage
              </UBadge>
            </template>

            <template #status-data="{ row }">
              <UBadge :color="getStatusColor(row.status)" variant="soft">
                {{ getStatusLabel(row.status) }}
              </UBadge>
            </template>

            <template #requestDate-data="{ row }">
              <span class="text-sm text-gray-500">
                {{ formatDate(row.requestDate) }}
              </span>
            </template>

            <template #actions-data="{ row }">
              <UDropdown
                :items="[
                  [
                    {
                      label: 'Genehmigen',
                      icon: 'i-heroicons-check',
                      click: () => approveVacation(row.id),
                      disabled: row.status !== 'pending',
                    },
                    {
                      label: 'Ablehnen',
                      icon: 'i-heroicons-x-mark',
                      click: () => rejectVacation(row.id),
                      disabled: row.status !== 'pending',
                    },
                  ],
                  [
                    {
                      label: 'Details anzeigen',
                      icon: 'i-heroicons-eye',
                      click: () => viewVacationDetails(row),
                    },
                    {
                      label: 'Konflikte prüfen',
                      icon: 'i-heroicons-exclamation-triangle',
                      click: () => checkConflicts(row),
                    },
                  ],
                ]"
              >
                <UButton
                  variant="ghost"
                  icon="i-heroicons-ellipsis-horizontal"
                />
              </UDropdown>
            </template>
          </UTable>
        </UCard>

        <!-- Vacation Calendar -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-calendar"
                  class="text-2xl text-purple-500"
                />
                <h2 class="text-xl font-semibold">Urlaubskalender</h2>
              </div>
              <div class="flex gap-2">
                <UButton
                  variant="outline"
                  @click="previousMonth"
                  icon="i-heroicons-chevron-left"
                >
                  Vorheriger Monat
                </UButton>
                <UButton
                  variant="outline"
                  @click="nextMonth"
                  icon="i-heroicons-chevron-right"
                >
                  Nächster Monat
                </UButton>
              </div>
            </div>
          </template>

          <div class="p-4">
            <div class="text-center mb-4">
              <h3 class="text-lg font-semibold">
                {{ currentMonthName }} {{ currentYear }}
              </h3>
            </div>

            <!-- Calendar Grid -->
            <div class="grid grid-cols-7 gap-1 mb-2">
              <div
                v-for="day in weekDays"
                :key="day"
                class="text-center text-sm font-medium text-gray-500 p-2"
              >
                {{ day }}
              </div>
            </div>

            <div class="grid grid-cols-7 gap-1">
              <div
                v-for="date in calendarDates"
                :key="date.key"
                class="aspect-square border rounded p-1 text-sm"
                :class="{
                  'bg-gray-50 text-gray-400': !date.isCurrentMonth,
                  'bg-blue-50 border-blue-200': date.hasVacation,
                  'bg-red-50 border-red-200': date.hasConflict,
                }"
              >
                <div class="font-medium">{{ date.day }}</div>
                <div v-if="date.vacations.length > 0" class="text-xs mt-1">
                  <div
                    v-for="vacation in date.vacations.slice(0, 2)"
                    :key="vacation.id"
                    class="truncate text-blue-600"
                  >
                    {{ vacation.employeeName }}
                  </div>
                  <div v-if="date.vacations.length > 2" class="text-gray-500">
                    +{{ date.vacations.length - 2 }} mehr
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// Apply admin middleware for route protection
definePageMeta({
  middleware: "admin",
});

const { $api } = useNuxtApp() as { $api: any };
const toast = useToast();

// Reactive data
const loading = ref(false);
const vacationRequests = ref<any[]>([]);
const currentDate = ref(new Date());

// Calendar computed properties
const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth());
const currentMonthName = computed(() =>
  currentDate.value.toLocaleDateString("de-DE", { month: "long" })
);

const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

// Statistics
const statistics = computed(() => {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  return {
    pendingRequests: vacationRequests.value.filter(
      (r) => r.status === "pending"
    ).length,
    approvedToday: vacationRequests.value.filter(
      (r) =>
        r.status === "approved" && r.approvedDate?.split("T")[0] === todayStr
    ).length,
    currentlyOnVacation: vacationRequests.value.filter((r) => {
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      return r.status === "approved" && start <= today && end >= today;
    }).length,
    conflicts: vacationRequests.value.filter((r) => r.hasConflict).length,
  };
});

// Table columns
const vacationColumns = [
  { key: "employee", label: "Mitarbeiter" },
  { key: "type", label: "Art" },
  { key: "dateRange", label: "Zeitraum" },
  { key: "days", label: "Tage" },
  { key: "status", label: "Status" },
  { key: "requestDate", label: "Antragsdatum" },
  { key: "actions", label: "Aktionen" },
];

// Calendar dates computation
const calendarDates = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);

  // Start from Monday of the first week
  const dayOfWeek = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
  startDate.setDate(firstDay.getDate() - dayOfWeek);

  const dates = [];
  const current = new Date(startDate);

  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const isCurrentMonth = current.getMonth() === month;
    const dateStr = current.toISOString().split("T")[0];

    // Find vacations for this date
    const vacationsForDate = vacationRequests.value.filter((v) => {
      const start = new Date(v.startDate);
      const end = new Date(v.endDate);
      return v.status === "approved" && start <= current && end >= current;
    });

    dates.push({
      key: `${current.getFullYear()}-${current.getMonth()}-${current.getDate()}`,
      day: current.getDate(),
      date: new Date(current),
      isCurrentMonth,
      hasVacation: vacationsForDate.length > 0,
      hasConflict: vacationsForDate.length > 1,
      vacations: vacationsForDate,
    });

    current.setDate(current.getDate() + 1);
  }

  return dates;
});

// Methods
async function loadVacationRequests() {
  loading.value = true;
  try {
    const response = await $api.get("/api/admin/vacation-requests");
    vacationRequests.value = response.data;
  } catch (error: any) {
    toast.add({
      title: "Fehler beim Laden",
      description: "Urlaubsanträge konnten nicht geladen werden.",
      color: "red",
    });
  } finally {
    loading.value = false;
  }
}

async function approveVacation(requestId: string) {
  try {
    await $api.patch(`/api/admin/vacation-requests/${requestId}/approve`);

    const request = vacationRequests.value.find((r) => r.id === requestId);
    if (request) {
      request.status = "approved";
      request.approvedDate = new Date().toISOString();
    }

    toast.add({
      title: "Genehmigt",
      description: "Urlaubsantrag wurde genehmigt.",
      color: "green",
    });
  } catch (error: any) {
    toast.add({
      title: "Fehler",
      description: "Genehmigung fehlgeschlagen.",
      color: "red",
    });
  }
}

async function rejectVacation(requestId: string) {
  try {
    await $api.patch(`/api/admin/vacation-requests/${requestId}/reject`);

    const request = vacationRequests.value.find((r) => r.id === requestId);
    if (request) {
      request.status = "rejected";
    }

    toast.add({
      title: "Abgelehnt",
      description: "Urlaubsantrag wurde abgelehnt.",
      color: "orange",
    });
  } catch (error: any) {
    toast.add({
      title: "Fehler",
      description: "Ablehnung fehlgeschlagen.",
      color: "red",
    });
  }
}

function viewVacationDetails(request: any) {
  // TODO: Implement details modal
  console.log("View vacation details:", request);
}

function checkConflicts(request: any) {
  const conflicts = vacationRequests.value.filter(
    (other) =>
      other.id !== request.id &&
      other.status === "approved" &&
      new Date(other.startDate) <= new Date(request.endDate) &&
      new Date(other.endDate) >= new Date(request.startDate)
  );

  if (conflicts.length > 0) {
    toast.add({
      title: "Konflikte gefunden",
      description: `${conflicts.length} überschneidende Urlaubsanträge gefunden.`,
      color: "orange",
    });
  } else {
    toast.add({
      title: "Keine Konflikte",
      description: "Keine überschneidenden Urlaubsanträge gefunden.",
      color: "green",
    });
  }
}

async function exportVacationData() {
  try {
    const response = await $api.get("/api/admin/vacation-requests/export", {
      responseType: "blob",
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `urlaub-export-${new Date().toISOString().split("T")[0]}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.add({
      title: "Export erfolgreich",
      description: "Urlaubsdaten wurden heruntergeladen.",
      color: "green",
    });
  } catch (error: any) {
    toast.add({
      title: "Export fehlgeschlagen",
      description: "Daten konnten nicht exportiert werden.",
      color: "red",
    });
  }
}

function previousMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
}

function nextMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-DE");
}

function getVacationTypeColor(type: string) {
  switch (type) {
    case "annual":
      return "green";
    case "sick":
      return "red";
    case "personal":
      return "blue";
    case "training":
      return "purple";
    default:
      return "gray";
  }
}

function getVacationTypeLabel(type: string) {
  switch (type) {
    case "annual":
      return "Jahresurlaub";
    case "sick":
      return "Krankheit";
    case "personal":
      return "Persönlich";
    case "training":
      return "Fortbildung";
    default:
      return "Sonstige";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "approved":
      return "green";
    case "rejected":
      return "red";
    case "pending":
      return "orange";
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
    default:
      return "Unbekannt";
  }
}

// Load data on mount
onMounted(loadVacationRequests);
</script>
