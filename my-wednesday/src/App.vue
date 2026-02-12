<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
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
    <AppFooter />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

:root {
  --bg: #1a1b26;
  --card-bg: rgba(36, 39, 58, 0.7);
  --text: #e8e8ed;
  --text-muted: #9ca3af;
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
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

.app {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.app::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  background: radial-gradient(ellipse 80% 50% at 50% 0%, #1e1b4b 0%, #0f0f1a 50%),
    radial-gradient(ellipse 60% 80% at 100% 50%, #312e81 0%, transparent 50%),
    radial-gradient(ellipse 60% 80% at 0% 80%, #1e3a5f 0%, transparent 50%),
    linear-gradient(180deg, #030712 0%, #0f172a 30%, #1e1b4b 60%, #0f0f1a 100%);
  background-size: 100% 100%;
  animation: cosmicShift 30s ease-in-out infinite;
  pointer-events: none;
}

.app::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  background: radial-gradient(
      2px 2px at 20px 30px,
      rgba(255, 255, 255, 0.9),
      transparent
    ),
    radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(2px 2px at 50px 160px, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(2px 2px at 90px 40px, rgba(255, 255, 255, 0.7), transparent),
    radial-gradient(2px 2px at 130px 80px, rgba(255, 255, 255, 0.4), transparent),
    radial-gradient(2px 2px at 200px 120px, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(ellipse 80% 50% at 50% 100%, rgba(201, 162, 39, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 80% 20%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse 50% 60% at 20% 60%, rgba(6, 182, 212, 0.08) 0%, transparent 50%);
  background-size: 250px 250px, 100% 100%, 100% 100%;
  animation: cosmicPulse 20s ease-in-out infinite, twinkle 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes cosmicShift {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.95;
  }
}

@keyframes cosmicPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}


.app > * {
  position: relative;
  z-index: 1;
}

.main {
  position: relative;
  flex: 1;
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
