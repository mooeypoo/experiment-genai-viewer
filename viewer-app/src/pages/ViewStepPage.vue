<template>
  <div class="view-step-page">
    <template v-if="!normalizedId">
      <v-alert type="error" variant="tonal">Invalid step.</v-alert>
      <router-link to="/">Back to steps</router-link>
    </template>
    <template v-else>
      <div class="view-step-main">
        <div class="view-step-header">
          <v-select
            :model-value="normalizedId"
            :items="stepOptions"
            item-title="label"
            item-value="id"
            placeholder="Select step"
            density="compact"
            hide-details
            class="step-select flex-grow-0"
            style="min-width: 200px"
            @update:model-value="goToStepById"
          />
          <v-btn variant="text" prepend-icon="mdi-format-list-bulleted" @click="router.push('/')">
            Back to list
          </v-btn>
        </div>
        <StepFrame :step-id="normalizedId" :step-exists="stepExists" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StepFrame from '@/components/StepFrame.vue'
import { normalizeStepId } from '@/lib/stepId'
import { stepPageUrl } from '@/lib/stepPageUrl'
import { state } from '@/lib/state'
import { fetchSteps } from '@/lib/api'
import { setSteps } from '@/lib/state'
import { MOCK_STEPS } from '@/lib/fallbackData'

const route = useRoute()
const router = useRouter()

const stepExists = ref(true)

const normalizedId = computed(() => {
  const param = route.params.step
  return normalizeStepId(param)
})

const stepOptions = computed(() =>
  state.steps.map((s) => ({ id: s.id, label: s.label || s.title || s.id }))
)

function goToStepById(id) {
  if (id) router.replace({ name: 'view-step', params: { step: id } })
}

async function checkStepExists() {
  if (!normalizedId.value) return
  try {
    const res = await fetch(stepPageUrl(normalizedId.value))
    stepExists.value = res.ok
  } catch {
    stepExists.value = false
  }
}

watch(normalizedId, checkStepExists, { immediate: true })

onMounted(async () => {
  if (state.steps.length === 0) {
    try {
      const data = await fetchSteps()
      setSteps(Array.isArray(data) ? data : (data.steps || []))
    } catch (e) {
      setSteps(MOCK_STEPS)
    }
  }
})
</script>

<style scoped>
.view-step-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0.5rem;
  overflow: hidden;
}

.view-step-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.view-step-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  flex-shrink: 0;
}
</style>
