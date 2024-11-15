<template>
  <div class="text-gray-300 flex items-center justify-center p-4">
    <div class="bg-gray-800 shadow-2xl rounded-2xl p-6 w-full max-w-4xl">

      <!-- Loader pendant le chargement -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <span class="loading loading-spinner loading-lg text-blue-500"></span>
      </div>

      <!-- Affichage des données -->
      <div v-else-if="candleData && metaData" class="flex flex-col gap-6">
        <!-- Informations générales -->
        <div class="bg-gray-700 p-4 rounded-xl shadow-lg">
          <h3 class="text-2xl font-semibold text-white mb-2">
            {{ metaData['3. Digital Currency Name'] }} ({{ metaData['2. Digital Currency Code'] }})
          </h3>
          <p class="text-gray-400">Marché : {{ metaData['5. Market Name'] }} ({{ metaData['4. Market Code'] }})</p>
          <p class="text-gray-400">Dernière mise à jour : {{ metaData['6. Last Refreshed'] }} ({{ metaData['7. Time Zone'] }})</p>
          <p class="text-gray-400 mt-2">Dernier Prix : <span class="text-white font-bold">${{ lastPrice }}</span></p>
        </div>

        <!-- Graphique des bougies -->
        <div class="bg-gray-700 p-4 rounded-xl shadow-lg">
          <h3 class="text-2xl font-semibold text-white mb-4">Graphique des bougies</h3>
          <ApexCharts type="candlestick" :options="chartOptions" :series="chartSeries" :theme="theme" />
        </div>

        <!-- Bouton Retour -->
        <NuxtLink to="/" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center block">
          Retour
        </NuxtLink>
      </div>

      <!-- Squelettes si les données ne sont pas disponibles -->
      <div v-else class="flex flex-col gap-6">
        <div class="bg-gray-700 p-4 rounded-xl shadow-lg animate-pulse">
          <div class="h-8 bg-gray-600 rounded mb-4"></div>
          <div class="space-y-2">
            <div class="h-6 bg-gray-600 rounded"></div>
            <div class="h-6 bg-gray-600 rounded"></div>
          </div>
        </div>
        <NuxtLink to="/" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center block">
          Retour
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import ApexCharts from 'vue3-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useRuntimeConfig } from '#imports';

// Définition des types
type MetaData = Record<string, string>;
type CandleData = {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  t: string[];
};

// Types pour les séries de données du graphique en chandelier
type CandleChartData = {
  x: Date | string;
  y: [number, number, number, number];
}[];

type CandleSeries = {
  data: CandleChartData;
}[];

// États
const route = useRoute();
const symbol = ref<string>(route.params.symbol as string);
const market = ref<string>('EUR');
const metaData = ref<MetaData | null>(null);
const candleData = ref<CandleData | null>(null);
const lastPrice = ref<number | null>(null);
const loading = ref<boolean>(true);

// Configuration du graphique avec types ApexCharts
const chartOptions = ref<ApexOptions>({
  chart: {
    type: 'candlestick',
    height: 350,
  },
  xaxis: {
    type: 'datetime',
  },
});
const theme = ref<ApexTheme>({
  mode: 'dark',
  palette: 'palette1',
  monochrome: {
    enabled: false,
    color: '#255aee',
    shadeTo: 'light',
    shadeIntensity: 0.65
  },
});
const chartSeries = ref<CandleSeries>([]);

// Fonction pour récupérer les données depuis Alpha Vantage
const fetchDigitalCurrencyDaily = async (symbol: string, market: string): Promise<{ meta: MetaData; candles: CandleData }> => {
  const config = useRuntimeConfig();
  const response: Record<string, any> = await $fetch('https://www.alphavantage.co/query', {
    params: {
      function: 'DIGITAL_CURRENCY_DAILY',
      symbol,
      market,
      apikey: config.public.alphaVantageKey as string,
    },
  });

  const timeSeries = response['Time Series (Digital Currency Daily)'] as Record<string, any>;
  const meta = response['Meta Data'] as MetaData;
  if (!timeSeries || !meta) throw new Error('Aucune donnée disponible.');

  const sortedEntries = Object.entries(timeSeries).reverse();
  return {
    meta,
    candles: {
      t: sortedEntries.map(([timestamp]) => timestamp),
      o: sortedEntries.map(([_, values]) => parseFloat(values['1. open'])),
      h: sortedEntries.map(([_, values]) => parseFloat(values['2. high'])),
      l: sortedEntries.map(([_, values]) => parseFloat(values['3. low'])),
      c: sortedEntries.map(([_, values]) => parseFloat(values['4. close'])),
    },
  };
};

// Génération des options du graphique
const generateCandleChart = () => {
  if (!candleData.value) return;

  chartSeries.value = [{
    data: candleData.value.t.map((timestamp, index) => ({
      x: new Date(timestamp),
      y: [
        candleData.value!.o[index], // Open
        candleData.value!.h[index], // High
        candleData.value!.l[index], // Low
        candleData.value!.c[index], // Close
      ] as [number, number, number, number],
    })),
  }];
};

// Chargement des données
const fetchData = async () => {
  loading.value = true;
  try {
    const { meta, candles } = await fetchDigitalCurrencyDaily(symbol.value, market.value);
    metaData.value = meta;
    candleData.value = candles;
    lastPrice.value = candles.c[candles.c.length - 1];
    generateCandleChart();
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    metaData.value = null;
    candleData.value = null;
  } finally {
    loading.value = false;
  }
};

// Initialisation et surveillance des changements de route
onMounted(fetchData);
watch(() => route.params.symbol, (newSymbol) => {
  symbol.value = newSymbol as string;
  fetchData();
});
</script>

<style scoped>
/* Ajoutez des styles spécifiques si nécessaire */
</style>
