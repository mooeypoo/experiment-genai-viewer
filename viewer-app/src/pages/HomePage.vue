<template>
  <div class="home-page">
    <div class="home-content viewer-prose">
      <h1 class="page-title">
        GenAI Incremental Localization Experiment ({{ assistantName }})
      </h1>

      <h2>What This Is</h2>
      <p>
        This site documents an incremental software development experiment conducted using an AI coding assistant.
      </p>
      <p>
        The premise is simple:
      </p>
      <p>
        Start with a small, straightforward application.<br>
        Then, step by step, introduce increasingly realistic localization constraints — new languages, right-to-left scripts, character limits, culturally sensitive phrasing, locale-aware sorting, and formatting rules.
      </p>
      <p>
        At each stage, we observe how the AI adapts.
      </p>
      <p>
        We record:
      </p>
      <ul>
        <li>The exact prompt given to the assistant</li>
        <li>The code it produced</li>
        <li>The architectural decisions it made</li>
        <li>The reasoning it documented</li>
      </ul>
      <p>
        This is not a benchmark and not a competition.
      </p>
      <p>
        It is a process study.
      </p>

      <h2>Why This Experiment Exists</h2>
      <p>
        Modern software is global by default.
      </p>
      <p>
        Yet many applications begin without serious consideration for:
      </p>
      <ul>
        <li>Multilingual users</li>
        <li>Right-to-left layouts</li>
        <li>Text expansion and contraction</li>
        <li>Locale-aware sorting</li>
        <li>Cultural phrasing differences</li>
        <li>Formatting conventions</li>
      </ul>
      <p>
        Localization is often treated as a late-stage polish rather than an architectural concern.
      </p>
      <p>
        This experiment asks:
      </p>
      <p>
        What happens when localization pressure is introduced incrementally into an evolving application?
      </p>
      <p>
        How does an AI coding assistant respond when constraints accumulate over time?
      </p>

      <h2>How to Use This Site</h2>
      <ol>
        <li>Choose a step from the selector.</li>
        <li>Explore the application at that stage.</li>
        <li>Open the sidebar to read:
          <ul>
            <li>The agent's notes (what it decided and why)</li>
            <li>The prompt that produced that stage.</li>
          </ul>
        </li>
        <li>Move forward step by step and observe what changes.</li>
      </ol>
      <p>
        You can jump between stages at any time.
      </p>

      <div class="step-list-wrapper">
        <StepList />
      </div>

      <h2>Multiple Assistants</h2>
      <p>
        This experiment was conducted using more than one AI coding assistant.
      </p>
      <p>
        You can explore both versions:
      </p>
      <p>
        Cursor / Sonnet version:<br>
        <a href="https://mooeypoo.github.io/experiment-genai-localization/" target="_blank" rel="noopener">https://mooeypoo.github.io/experiment-genai-localization/</a>
      </p>
      <p>
        GitHub Copilot version:<br>
        <a href="https://mooeypoo.github.io/experiment-genai-localization-copilot/" target="_blank" rel="noopener">https://mooeypoo.github.io/experiment-genai-localization-copilot/</a>
      </p>
      <p>
        The goal is not to declare a winner.
      </p>
      <p>
        The goal is to observe differences in architectural foresight, ambiguity handling, refactoring behavior, and documentation patterns under evolving localization constraints.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import StepList from '@/components/StepList.vue'
import { fetchSteps, fetchViewerConfig } from '@/lib/api'
import { MOCK_STEPS, DEFAULT_VIEWER_CONFIG } from '@/lib/fallbackData'
import { setSteps, setStepsError, setViewerConfig, state } from '@/lib/state'

const assistantName = computed(() => state.viewerConfig?.assistantName ?? '…')

onMounted(async () => {
  try {
    const data = await fetchSteps()
    setSteps(Array.isArray(data) ? data : (data.steps || []))
  } catch (e) {
    setSteps(MOCK_STEPS)
  }
  try {
    const config = await fetchViewerConfig()
    setViewerConfig(config)
  } catch {
    setViewerConfig(DEFAULT_VIEWER_CONFIG)
  }
})
</script>

<style scoped>
.home-page {
  flex: 1;
  padding-bottom: 1rem;
}

.home-content {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 2rem;
}

.page-title {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--viewer-text);
}

.step-list-wrapper {
  margin: 1.5rem 0;
}

.home-content :deep(a) {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.home-content :deep(a:hover) {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .home-content {
    padding: 1rem 1rem 1.5rem;
  }

  .page-title {
    font-size: 1.25rem;
  }
}
</style>
