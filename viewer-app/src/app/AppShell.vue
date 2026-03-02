<template>
  <v-app>
    <v-navigation-drawer
      v-model="mainDrawer"
      :mobile-breakpoint="960"
      temporary
      location="start"
    >
      <v-list density="compact" nav>
        <v-list-subheader>Navigation</v-list-subheader>
        <v-list-item to="/" title="Steps" prepend-icon="mdi-format-list-bulleted" />
        <v-list-item to="/about" title="About" prepend-icon="mdi-information-outline" />
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
      v-if="isStepView"
      v-model="docsDrawer"
      location="end"
      width="320"
      :temporary="display.mobile"
      class="d-flex flex-column"
    >
      <DocsPanel
        v-if="normalizedStepId"
        :step-id="normalizedStepId"
        notes-fallback="No notes available for this step."
        prompt-fallback="No prompt available for this step."
        class="flex-grow-1 flex-shrink-0 min-height-0"
      />
    </v-navigation-drawer>
    <v-app-bar color="primary" density="compact">
      <v-app-bar-nav-icon class="d-md-none" @click="mainDrawer = !mainDrawer" />
      <v-app-bar-title>
        <router-link to="/" class="text-inherit text-decoration-none font-weight-medium">
          {{ siteTitle }}
        </router-link>
      </v-app-bar-title>
      <v-spacer />
      <v-btn
        v-if="isStepView"
        prepend-icon="mdi-text-box-multiple-outline"
        variant="text"
        color="inherit"
        :aria-label="docsDrawer ? 'Close agent notes' : 'Open agent notes'"
        @click="docsDrawer = !docsDrawer"
      >
        Agent notes
      </v-btn>
      <v-btn to="/" variant="text" color="inherit" class="d-none d-md-inline-flex">Steps</v-btn>
      <v-btn to="/about" variant="text" color="inherit" class="d-none d-md-inline-flex">About</v-btn>
    </v-app-bar>
    <v-main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
    <v-footer class="app-footer" height="auto">
      <div class="app-footer-inner">
        <a href="https://moriel.tech" target="_blank" rel="noopener" class="app-footer-link">Made by Moriel Schottlender</a>
        <template v-if="config?.repoUrl">
          <span class="app-footer-sep" aria-hidden="true">·</span>
          <a :href="config.repoUrl" target="_blank" rel="noopener" class="app-footer-link">View on Github</a>
        </template>
        <template v-if="config?.otherExperimentUrl">
          <span class="app-footer-sep" aria-hidden="true">·</span>
          <a :href="config.otherExperimentUrl" target="_blank" rel="noopener" class="app-footer-link">Go to other experiment</a>
        </template>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import { state } from '@/lib/state'
import { normalizeStepId } from '@/lib/stepId'
import { fetchViewerConfig } from '@/lib/api'
import { DEFAULT_VIEWER_CONFIG } from '@/lib/fallbackData'
import { setViewerConfig } from '@/lib/state'
import DocsPanel from '@/components/DocsPanel.vue'

const route = useRoute()
const display = useDisplay()
const mainDrawer = ref(false)
const docsDrawer = ref(false)

const isStepView = computed(() => route.name === 'view-step')
const normalizedStepId = computed(() => {
  const param = route.params.step
  return param ? normalizeStepId(param) : null
})

const siteTitle = computed(() => state.viewerConfig?.siteTitle || 'Step Viewer')
const config = computed(() => state.viewerConfig)

onMounted(async () => {
  try {
    const data = await fetchViewerConfig()
    setViewerConfig(data)
  } catch {
    setViewerConfig(DEFAULT_VIEWER_CONFIG)
  }
})

watch(siteTitle, (title) => {
  document.title = title
}, { immediate: true })
</script>

<style scoped>
.app-main {
  flex: 1 1 auto;
  flex-grow: 100;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.app-main :deep(.v-main__scroller) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.app-main :deep(.v-main__scroller > *) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.app-footer {
  flex-shrink: 0;
  padding: 0.375rem 1rem;
  background: #e2e8f0 !important;
  border-top: 1px solid #cbd5e1;
  font-size: 0.8125rem;
}

.app-footer-inner {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.app-footer-link {
  color: #475569;
  text-decoration: none;
}

.app-footer-link:hover {
  color: #1e293b;
  text-decoration: underline;
}

.app-footer-sep {
  color: #94a3b8;
  user-select: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
