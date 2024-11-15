<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Variables réactives pour stocker les données
const bitcoinData = ref(null);

// Fonction pour récupérer les données d'une action via l'API proxy
async function fetchStockPrice(symbol: string) {
  try {
    const data = await $fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}`, {
      params: {
        token: 'csrn2cpr01qj3u0oqks0csrn2cpr01qj3u0oqksg'
      }
    });
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour ${symbol}:`, error);
    throw error;
  }
}

// Fonction pour récupérer et mettre à jour les données
async function fetchData() {
  try {
    bitcoinData.value = await fetchStockPrice("BTC"); // Exemple pour Bitcoin
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
  }
}

// Récupération des données au montage du composant
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="text-gray-300 flex items-center justify-center p-4">
    <div class="bg-gray-800 shadow-2xl rounded-2xl p-6 w-full max-w-3xl">
      <div class="flex flex-col gap-6">
        <!-- Carte Bitcoin -->
        <NuxtLink
            :to="`/stocks/BTC`"
            class="bg-gray-700 p-4 rounded-xl shadow-lg flex-1 hover:bg-gray-600 transition"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-semibold text-white">Bitcoin (BTC)</h3>
            <span
                class="text-xl font-bold"
                :class="{
                'text-green-400': bitcoinData?.dp >= 0,
                'text-red-500': bitcoinData?.dp < 0,
              }"
            >
              {{ bitcoinData?.dp || '...' }}%
            </span>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <p class="text-gray-400">Prix Actuel :</p>
              <p class="text-xl font-semibold text-white">
                ${{ bitcoinData?.c || '...' }}
              </p>
            </div>
            <div class="flex justify-between">
              <p class="text-gray-400">Variation (Journée) :</p>
              <p class="text-xl font-semibold text-white">
                {{ bitcoinData?.d || '...' }}$
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
