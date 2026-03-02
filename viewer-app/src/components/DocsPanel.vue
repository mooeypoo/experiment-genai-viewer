<template>
  <div class="docs-panel">
    <div class="docs-panel-header">Documentation</div>
    <div class="docs-panel-scroll">
      <v-tabs v-model="tab" density="compact" class="docs-tabs">
        <v-tab value="notes">Notes</v-tab>
        <v-tab value="prompt">Prompt</v-tab>
      </v-tabs>
      <div class="docs-content-scroll">
        <template v-if="tab === 'notes'">
          <div class="viewer-prose pa-3" v-html="notesHtml" />
          <p v-if="notesLoading" class="viewer-missing px-3">Loading…</p>
          <p v-else-if="notesError && !notesHtml" class="viewer-missing px-3">{{ notesFallback }}</p>
        </template>
        <template v-else>
          <div class="viewer-prose pa-3" v-html="promptHtml" />
          <p v-if="promptLoading" class="viewer-missing px-3">Loading…</p>
          <p v-else-if="promptError && !promptHtml" class="viewer-missing px-3">{{ promptFallback }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { fetchStepNotes, fetchStepPrompt } from '@/lib/api'

const props = defineProps({
  stepId: { type: String, required: true },
  notesFallback: { type: String, default: 'No notes available for this step.' },
  promptFallback: { type: String, default: 'No prompt available for this step.' },
})

const tab = ref('notes')
const notesHtml = ref('')
const promptHtml = ref('')
const notesLoading = ref(false)
const promptLoading = ref(false)
const notesError = ref(null)
const promptError = ref(null)

async function loadNotes() {
  notesLoading.value = true
  notesError.value = null
  notesHtml.value = ''
  try {
    notesHtml.value = await fetchStepNotes(props.stepId)
  } catch (e) {
    notesError.value = e
  } finally {
    notesLoading.value = false
  }
}

async function loadPrompt() {
  promptLoading.value = true
  promptError.value = null
  promptHtml.value = ''
  try {
    promptHtml.value = await fetchStepPrompt(props.stepId)
  } catch (e) {
    promptError.value = e
  } finally {
    promptLoading.value = false
  }
}

function load() {
  loadNotes()
  loadPrompt()
}

watch(() => props.stepId, load)
onMounted(load)
</script>

<style scoped>
.docs-panel {
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f1f5f9;
  color: #1e293b;
  border: 1px solid var(--viewer-border);
}

.docs-panel-header {
  flex-shrink: 0;
  padding: 0.75rem 1rem;
  font-weight: 600;
  font-size: 1rem;
  background: #f1f5f9;
  color: #1e293b;
  border-bottom: 1px solid var(--viewer-border);
}

.docs-panel-scroll {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #f1f5f9;
  color: #1e293b;
}

.docs-panel-scroll .docs-tabs {
  flex-shrink: 0;
  min-height: 40px;
}

/* Reduce tab bar padding so tab text isn't pushed right */
.docs-panel :deep(.v-tab) {
  padding-inline: 12px;
  min-width: 0;
  text-transform: none;
}

.docs-panel :deep(.v-tabs-slider-wrapper) {
  margin-inline: 0;
}

.docs-content-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.docs-panel :deep(.viewer-prose) {
  min-width: 0;
  width: 100%;
  max-width: 100%;
  background: #f1f5f9;
  color: #1e293b !important;
}

.docs-panel :deep(.viewer-prose *),
.docs-panel :deep(.viewer-missing) {
  color: inherit;
}

.docs-panel :deep(.viewer-prose h1),
.docs-panel :deep(.viewer-prose h2),
.docs-panel :deep(.viewer-prose h3),
.docs-panel :deep(.viewer-prose p),
.docs-panel :deep(.viewer-prose li),
.docs-panel :deep(.viewer-prose a) {
  color: #1e293b !important;
}

.docs-panel :deep(.viewer-prose a:hover) {
  color: #0f172a !important;
}
</style>
