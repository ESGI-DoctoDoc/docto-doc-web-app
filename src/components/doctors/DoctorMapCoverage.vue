<script setup>
import {onMounted} from 'vue'
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css';
import {doctorsApi} from "~/services/doctors/doctors.api.js";

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
})

const {fetchDoctors} = doctorsApi()
const {handleError} = useNotify()

const isLoading = ref(true)

async function getAllDoctors() {
  isLoading.value = true
  try {
    const map = initializeMap()

    const doctorLocations = []
    let page = 0
    let keepFetching = true

    while (keepFetching) {
      const doctors = await fetchDoctors({
        size: 10,
        page: page,
      })

      if (doctors.length === 0) {
        keepFetching = false
        break
      }

      doctors
          .filter((doctor) => doctor.address?.latitude && doctor.address?.longitude)
          .forEach((doctor) => {
            if (
                !doctorLocations.some(
                    (loc) =>
                        loc.lat === doctor.address.latitude &&
                        loc.lng === doctor.address.longitude
                )
            ) {
              doctorLocations.push({
                lat: doctor.address.latitude,
                lng: doctor.address.longitude,
              })
            }
          })

      page++
    }

    doctorLocations.forEach(({lat, lng}) => {
      L.marker([lat, lng]).addTo(map)
    })
  } catch (error) {
    handleError('Erreur lors de la récupération des médecins', error)
  } finally {
    isLoading.value = false
  }
}

function initializeMap() {
  const map = L.map('map').setView([46.5, 2.5], 6)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)
  return map
}

onMounted(() => {
  getAllDoctors()
})
</script>

<template>
  <div class="map-container">
    <div id="map" class="map"/>
  </div>
</template>


<style scoped>
.map-container {
  height: 100%;
  width: 100%;
  margin-bottom: 1rem;
}

.map {
  height: 100%;
  width: 100%;
  border-radius: 12px;
}
</style>