<template>
  <div class="step-frame-wrap">
    <iframe
      v-if="src"
      :key="stepId"
      :src="src"
      :title="`Step ${stepId}`"
      class="step-frame"
      referrerpolicy="no-referrer"
    />
    <div v-else class="step-frame-error">
      <v-alert type="warning" variant="tonal">
        This step is not available. The step artifact may be missing or not yet built.
      </v-alert>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stepId: { type: String, required: true },
  stepExists: { type: Boolean, default: true },
})

const src = computed(() => {
  if (!props.stepId || !props.stepExists) return null
  return `./${props.stepId}/index.html`
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
