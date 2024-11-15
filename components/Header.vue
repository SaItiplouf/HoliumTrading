<template>
  <nav class="bg-gray-800 px-4 py-3">
    <div class="container mx-auto flex justify-between items-center">
      <!-- Logo ou Nom de l'Application -->
      <div class="text-white text-lg font-semibold">
        Holium Trading
      </div>

      <!-- Liens de Navigation (optionnels) -->
      <div class="hidden md:flex space-x-4">
        <a href="#" class="text-gray-300 hover:text-white">Tableau de Bord</a>
        <a href="#" class="text-gray-300 hover:text-white">Portefeuille</a>
        <a href="#" class="text-gray-300 hover:text-white">Paramètres</a>
      </div>

      <!-- Bouton Menu pour Mobile -->
      <div class="md:hidden">
        <button class="text-gray-300 hover:text-white focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>