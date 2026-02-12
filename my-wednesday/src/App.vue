<script setup>
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div class="app">
    <AppHeader />
    <main class="main">
      <RouterView v-slot="{ Component, route }">
        <Transition :name="route.meta.transition || 'fade'" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
:root {
  --bg: #0f0f11;
  --card-bg: #161618;
  --text: #f4f4f5;
  --text-muted: #a1a1aa;
  --accent: #c9a227;
  --accent-hover: #d4b030;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg);
  background-image: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201, 162, 39, 0.12), transparent);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}

@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.app {
  min-height: 100vh;
}

.main {
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.35s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
