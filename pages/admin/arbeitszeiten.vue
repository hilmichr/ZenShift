<template>
  <div>
    <UContainer class="py-8">
      <div class="space-y-8">
        <!-- Header -->
        <div>
          <h1
            class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Arbeitszeiten Verwaltung
          </h1>
          <p class="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Verwaltung und Übersicht aller Mitarbeiter-Arbeitszeiten.
          </p>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <UCard>
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-users" class="text-2xl text-blue-500" />
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Aktive Mitarbeiter
                </p>
                <p class="text-2xl font-semibold">
                  {{ statistics.activeEmployees }}
                </p>
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-clock" class="text-2xl text-green-500" />
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Heute eingetragen
                </p>
                <p class="text-2xl font-semibold">
                  {{ statistics.todayEntries }}
                </p>
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-exclamation-triangle"
                class="text-2xl text-orange-500"
              />
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Ausstehende Genehmigungen
                </p>
                <p class="text-2xl font-semibold">
                  {{ statistics.pendingApprovals }}
                </p>
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
                  Ø Stunden/Tag
                </p>
                <p class="text-2xl font-semibold">
                  {{ statistics.avgHoursPerDay }}h
                </p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Filters and Controls -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">Filter & Aktionen</h2>
              <div class="flex gap-2">
                <UButton
                  icon="i-heroicons-arrow-down-tray"
                  variant="outline"
                  @click="exportData"
                >
                  Export
                </UButton>
                <UButton
                  icon="i-heroicons-funnel"
                  variant="outline"
                  @click="showFilters = !showFilters"
                >
                  Filter
                </UButton>
              </div>
            </div>
          </template>

          <div v-show="showFilters" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <UFormGroup label="Mitarbeiter">
                <USelectMenu
                  v-model="filters.employee"
                  :options="employeeOptions"
                  placeholder="Alle Mitarbeiter"
                  searchable
                  :model-value="filters.employee"
                />
              </UFormGroup>

              <UFormGroup label="Von Datum">
                <UInput
                  v-model="filters.dateFrom"
                  type="date"
                  icon="i-heroicons-calendar"
                />
              </UFormGroup>

              <UFormGroup label="Bis Datum">
                <UInput
                  v-model="filters.dateTo"
                  type="date"
                  icon="i-heroicons-calendar"
                />
              </UFormGroup>

              <UFormGroup label="Status">
                <USelectMenu
                  v-model="filters.status"
                  :options="statusOptions"
                  placeholder="Alle Status"
                  :model-value="filters.status"
                />
              </UFormGroup>
            </div>

            <div class="flex justify-end gap-2">
              <UButton variant="outline" @click="resetFilters">
                Zurücksetzen
              </UButton>
              <UButton @click="applyFilters"> Filter anwenden </UButton>
            </div>
          </div>
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
                {{ filteredEntries.length }} Einträge
              </UBadge>
            </div>
          </template>

          <div v-if="filteredEntries.length === 0" class="text-center py-12">
            <UIcon
              name="i-heroicons-document-magnifying-glass"
              class="text-6xl text-gray-300 mx-auto mb-4"
            />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Keine Arbeitszeiten gefunden
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              Passen Sie die Filter an oder warten Sie auf neue Einträge.
            </p>
          </div>

          <UTable
            v-else
            :columns="adminColumns"
            :rows="paginatedEntries"
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

            <template #status-data="{ row }">
              <UBadge :color="getStatusColor(row.status)" variant="soft">
                {{ getStatusLabel(row.status) }}
              </UBadge>
            </template>

            <template #actions-data="{ row }">
              <UDropdown
                :items="[
                  [
                    {
                      label: 'Genehmigen',
                      icon: 'i-heroicons-check',
                      click: () => approveEntry(row.id),
                      disabled: row.status === 'approved',
                    },
                    {
                      label: 'Ablehnen',
                      icon: 'i-heroicons-x-mark',
                      click: () => rejectEntry(row.id),
                      disabled: row.status === 'rejected',
                    },
                  ],
                  [
                    {
                      label: 'Bearbeiten',
                      icon: 'i-heroicons-pencil',
                      click: () => editEntry(row),
                    },
                    {
                      label: 'Details',
                      icon: 'i-heroicons-eye',
                      click: () => viewDetails(row),
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

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center mt-6">
            <UPagination
              v-model="currentPage"
              :page-count="pageSize"
              :total="filteredEntries.length"
            />
          </div>
        </UCard>

        <!-- Bulk Actions -->
        <UCard v-if="selectedEntries.length > 0">
          <template #header>
            <h3 class="text-lg font-semibold">
              Massenaktionen ({{ selectedEntries.length }} ausgewählt)
            </h3>
          </template>

          <div class="flex gap-2">
            <UButton
              color="green"
              icon="i-heroicons-check"
              @click="bulkApprove"
            >
              Alle genehmigen
            </UButton>
            <UButton color="red" icon="i-heroicons-x-mark" @click="bulkReject">
              Alle ablehnen
            </UButton>
            <UButton variant="outline" @click="selectedEntries = []">
              Auswahl aufheben
            </UButton>
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
const showFilters = ref(false);
const currentPage = ref(1);
const pageSize = 10;
const selectedEntries = ref<string[]>([]);

// Filters
const filters = reactive({
  employee: null as string | null,
  dateFrom: "",
  dateTo: "",
  status: null as string | null,
});

// Data
const entries = ref<any[]>([]);
const employees = ref<any[]>([]);

// Statistics
const statistics = computed(() => {
  return {
    activeEmployees: employees.value.length,
    todayEntries: entries.value.filter(
      (e) => new Date(e.date).toDateString() === new Date().toDateString()
    ).length,
    pendingApprovals: entries.value.filter((e) => e.status === "pending")
      .length,
    avgHoursPerDay: (
      entries.value.reduce((sum, e) => sum + e.durationMinutes / 60, 0) /
      Math.max(entries.value.length, 1)
    ).toFixed(1),
  };
});

// Options for selects
const employeeOptions = computed(() =>
  employees.value.map((emp) => ({
    label: emp.fullName,
    value: emp.id,
  }))
);

const statusOptions = [
  { label: "Ausstehend", value: "pending" },
  { label: "Genehmigt", value: "approved" },
  { label: "Abgelehnt", value: "rejected" },
];

// Table columns
const adminColumns = [
  { key: "select", label: "" },
  { key: "employee", label: "Mitarbeiter" },
  { key: "date", label: "Datum" },
  { key: "startTime", label: "Start" },
  { key: "endTime", label: "Ende" },
  { key: "breakMinutes", label: "Pause" },
  { key: "durationMinutes", label: "Dauer" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Aktionen" },
];

// Computed properties
const filteredEntries = computed(() => {
  let result = entries.value;

  if (filters.employee) {
    result = result.filter((e) => e.employeeId === filters.employee);
  }

  if (filters.dateFrom) {
    result = result.filter((e) => e.date >= filters.dateFrom);
  }

  if (filters.dateTo) {
    result = result.filter((e) => e.date <= filters.dateTo);
  }

  if (filters.status) {
    result = result.filter((e) => e.status === filters.status);
  }

  return result;
});

const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredEntries.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(filteredEntries.value.length / pageSize)
);

// Methods
async function loadData() {
  loading.value = true;
  try {
    // Load work entries with employee information
    const [entriesResp, employeesResp] = await Promise.all([
      $api.get("/api/admin/work-entries"),
      $api.get("/api/admin/employees"),
    ]);

    entries.value = entriesResp.data;
    employees.value = employeesResp.data;
  } catch (error: any) {
    toast.add({
      title: "Fehler beim Laden",
      description: "Daten konnten nicht geladen werden.",
      color: "red",
    });
  } finally {
    loading.value = false;
  }
}

async function approveEntry(entryId: string) {
  try {
    await $api.patch(`/api/admin/work-entries/${entryId}/approve`);

    const entry = entries.value.find((e) => e.id === entryId);
    if (entry) {
      entry.status = "approved";
    }

    toast.add({
      title: "Genehmigt",
      description: "Arbeitszeit wurde genehmigt.",
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

async function rejectEntry(entryId: string) {
  try {
    await $api.patch(`/api/admin/work-entries/${entryId}/reject`);

    const entry = entries.value.find((e) => e.id === entryId);
    if (entry) {
      entry.status = "rejected";
    }

    toast.add({
      title: "Abgelehnt",
      description: "Arbeitszeit wurde abgelehnt.",
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

function editEntry(entry: any) {
  // TODO: Implement edit modal
  console.log("Edit entry:", entry);
}

function viewDetails(entry: any) {
  // TODO: Implement details modal
  console.log("View details:", entry);
}

async function bulkApprove() {
  try {
    await $api.patch("/api/admin/work-entries/bulk-approve", {
      entryIds: selectedEntries.value,
    });

    selectedEntries.value.forEach((id) => {
      const entry = entries.value.find((e) => e.id === id);
      if (entry) entry.status = "approved";
    });

    selectedEntries.value = [];

    toast.add({
      title: "Massengenehmigung",
      description: "Alle ausgewählten Einträge wurden genehmigt.",
      color: "green",
    });
  } catch (error: any) {
    toast.add({
      title: "Fehler",
      description: "Massengenehmigung fehlgeschlagen.",
      color: "red",
    });
  }
}

async function bulkReject() {
  try {
    await $api.patch("/api/admin/work-entries/bulk-reject", {
      entryIds: selectedEntries.value,
    });

    selectedEntries.value.forEach((id) => {
      const entry = entries.value.find((e) => e.id === id);
      if (entry) entry.status = "rejected";
    });

    selectedEntries.value = [];

    toast.add({
      title: "Massenablehnung",
      description: "Alle ausgewählten Einträge wurden abgelehnt.",
      color: "orange",
    });
  } catch (error: any) {
    toast.add({
      title: "Fehler",
      description: "Massenablehnung fehlgeschlagen.",
      color: "red",
    });
  }
}

function applyFilters() {
  currentPage.value = 1;
  toast.add({
    title: "Filter angewendet",
    description: `${filteredEntries.value.length} Einträge gefunden.`,
    color: "blue",
  });
}

function resetFilters() {
  filters.employee = null;
  filters.dateFrom = "";
  filters.dateTo = "";
  filters.status = null;
  currentPage.value = 1;
}

async function exportData() {
  try {
    const response = await $api.get("/api/admin/work-entries/export", {
      params: filters,
      responseType: "blob",
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `arbeitszeiten-export-${new Date().toISOString().split("T")[0]}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.add({
      title: "Export erfolgreich",
      description: "Daten wurden heruntergeladen.",
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
onMounted(loadData);
</script>
