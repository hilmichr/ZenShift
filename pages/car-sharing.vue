<template>
  <div class="p-6 space-y-4">
    <h1 class="text-xl font-semibold">Car-Sharing</h1>
    <div class="flex items-center gap-3">
      <label
        >Radius (km):
        <input
          v-model.number="radiusKm"
          type="number"
          min="1"
          class="border p-1 rounded w-24"
      /></label>
      <button @click="load" class="rounded bg-blue-600 text-white px-3 py-1">
        Aktualisieren
      </button>
    </div>
    <div id="map" class="h-[480px] rounded-lg border"></div>
  </div>
</template>

<script setup lang="ts">
import L from "leaflet";
// const auth = useAuthStore()
const { $api } = useNuxtApp();
const radiusKm = ref(10);
let map: L.Map | undefined;

onMounted(async () => {
  map = L.map("map").setView([52.2689, 10.5268], 12); // Braunschweig default
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);
  await load();
});

async function load() {
  // const me = auth.user
  // const resp = await $api.get('/api/carsharing/participants')
  // const list = resp.data as Array<{ fullName:string, email:string, approxLat:number, approxLng:number, city:string }>
  // // clear markers
  // (map as any)._layers && Object.values((map as any)._layers).forEach((l:any) => { if (l instanceof L.Marker) map?.removeLayer(l) })
  // const myLat = me?.latitude ?? null
  // const myLng = me?.longitude ?? null
  // for (const u of list) {
  //   if (myLat && myLng) {
  //     const d = haversine(myLat, myLng, u.approxLat, u.approxLng)
  //     if (d > radiusKm.value) continue
  //   }
  //   L.marker([u.approxLat, u.approxLng]).addTo(map!)
  //     .bindPopup(`<b>${u.fullName}</b><br/>${u.city || 'Stadt unbekannt'}<br/><a href="mailto:${u.email}">Kontakt</a>`)
  // }
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
</script>
