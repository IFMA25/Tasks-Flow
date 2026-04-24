<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Сторінку не знайдено</p>
    <router-link to="/">
      Повернутися на головну
    </router-link>
  </div>
</template>

<script setup lang="ts">
// NotFound Page
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
}

.not-found h1 {
  font-size: 6rem;
  font-weight: bold;
  margin: 0;
}

.not-found p {
  font-size: 1.5rem;
  margin: 1rem 0;
}

.not-found a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}
</style>

