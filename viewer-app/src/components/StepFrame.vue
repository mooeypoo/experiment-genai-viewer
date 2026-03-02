<template>
  <div class="step-frame-wrap">
    <iframe
      v-if="src"
      :key="stepId"
      ref="frameEl"
      :src="src"
      :title="`Step ${stepId}`"
      class="step-frame"
      referrerpolicy="no-referrer"
      @load="onIframeLoad"
      @error="onIframeError"
    />
    <div v-else class="step-frame-error">
      <v-alert type="warning" variant="tonal">
        This step is not available. The step artifact may be missing or not yet built.
      </v-alert>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { stepPageUrl } from '@/lib/stepPageUrl'

const props = defineProps({
  stepId: { type: String, required: true },
  stepExists: { type: Boolean, default: true },
})

const frameEl = ref(null)

const src = computed(() => {
  if (!props.stepId || !props.stepExists) return null
  return stepPageUrl(props.stepId)
})

function onIframeLoad(event) {
  const iframe = event.target
  let title = null
  let appChildren = null
  try {
    const doc = iframe.contentDocument
    title = doc?.title ?? null
    const appEl = doc?.getElementById('app')
    appChildren = appEl ? appEl.childElementCount : null
  } catch (e) {
    // ignore cross-origin issues
  }

  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/9f288287-f024-4eb3-aace-8008d47f7795', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: `log_${Date.now()}_StepFrame_load`,
      timestamp: Date.now(),
      location: 'StepFrame.vue:onIframeLoad',
      message: 'Iframe loaded',
      runId: 'pre-fix',
      hypothesisId: 'H3',
      data: {
        stepId: props.stepId,
        stepExists: props.stepExists,
        src: src.value,
        title,
        appChildren,
      },
    }),
  }).catch(() => {})
  // #endregion agent log
}

function onIframeError() {
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/9f288287-f024-4eb3-aace-8008d47f7795', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: `log_${Date.now()}_StepFrame_error`,
      timestamp: Date.now(),
      location: 'StepFrame.vue:onIframeError',
      message: 'Iframe error event',
      runId: 'pre-fix',
      hypothesisId: 'H2',
      data: {
        stepId: props.stepId,
        stepExists: props.stepExists,
        src: src.value,
      },
    }),
  }).catch(() => {})
  // #endregion agent log
}

onMounted(() => {
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/9f288287-f024-4eb3-aace-8008d47f7795', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: `log_${Date.now()}_StepFrame_src`,
      timestamp: Date.now(),
      location: 'StepFrame.vue:onMounted',
      message: 'StepFrame iframe src and state',
      runId: 'pre-fix',
      hypothesisId: 'H3',
      data: {
        stepId: props.stepId,
        stepExists: props.stepExists,
        src: src.value,
      },
    }),
  }).catch(() => {})
  // #endregion agent log
})
</script>

<style scoped>
.step-frame-wrap {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-surface));
  border: 2px solid #64748b;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.step-frame {
  flex: 1;
  width: 100%;
  min-height: 400px;
  border: none;
  display: block;
}

.step-frame-error {
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
}
</style>
