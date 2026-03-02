<template>
  <div class="about-page">
    <div v-if="loading" class="about-loading">
      <v-progress-circular indeterminate size="40" width="2" />
    </div>
    <div v-else class="about-content viewer-prose">
      <h1>About This Experiment</h1>
      <p>
        The GenAI Incremental Localization Experiment is a structured exploration of how AI coding assistants behave when software requirements evolve incrementally.
      </p>
      <p>
        Rather than asking an assistant to build a fully internationalized system from the start, we follow a more realistic development path:
      </p>
      <ul>
        <li>Begin with a small monolingual application.</li>
        <li>Add features normally.</li>
        <li>Introduce translation requirements later.</li>
        <li>Add right-to-left languages.</li>
        <li>Introduce character constraints.</li>
        <li>Add locale-aware sorting and formatting.</li>
        <li>Refine natural language phrasing.</li>
      </ul>
      <p>
        At each stage, we observe:
      </p>
      <ul>
        <li>What architectural decisions were made?</li>
        <li>Did the assistant anticipate future complexity?</li>
        <li>What had to be refactored?</li>
        <li>How were ambiguities resolved?</li>
        <li>What assumptions became visible only under pressure?</li>
      </ul>

      <h2>Why Localization?</h2>
      <p>
        Localization is one of the most underestimated forces in software architecture.
      </p>
      <p>
        It affects:
      </p>
      <ul>
        <li>Layout and direction</li>
        <li>Validation rules</li>
        <li>Data modeling</li>
        <li>Sorting logic</li>
        <li>Formatting APIs</li>
        <li>UX microcopy</li>
        <li>Accessibility</li>
      </ul>
      <p>
        It is rarely treated as foundational at the start of a project.
      </p>
      <p>
        That makes it an ideal pressure test for incremental AI development.
      </p>

      <h2>Why Incremental?</h2>
      <p>
        Real software projects do not begin with perfect foresight.
      </p>
      <p>
        They evolve.
      </p>
      <p>
        This experiment mirrors that reality.
      </p>
      <p>
        We intentionally do not warn the assistant in advance that complex localization constraints are coming.
      </p>
      <p>
        The goal is not to trick the AI.
      </p>
      <p>
        The goal is to observe how it reasons and adapts under evolving constraints.
      </p>

      <h2>Multiple Assistants, Same Structure</h2>
      <p>
        This experiment was conducted multiple times using different AI coding assistants.
      </p>
      <p>
        Each run follows the same incremental structure and staged prompts.
      </p>
      <p>
        The only variable changed was the assistant.
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
        This is not about ranking assistants.
      </p>
      <p>
        It is about observing reasoning patterns.
      </p>

      <h2>How the Site Works</h2>
      <p>
        Each stage corresponds to a git tag.
      </p>
      <p>
        For every stage, you can view:
      </p>
      <ul>
        <li>The running application at that point in history.</li>
        <li>The agent's reasoning notes.</li>
        <li>The exact prompt that produced that stage.</li>
      </ul>
      <p>
        The global shell provides navigation and context.<br>
        Each step is a historical snapshot.
      </p>

      <h2>Limitations</h2>
      <p>
        This experiment does not claim:
      </p>
      <ul>
        <li>That the resulting applications are production-ready.</li>
        <li>That localization coverage is complete.</li>
        <li>That these outcomes represent all possible AI development paths.</li>
      </ul>
      <p>
        It is a structured exploration, not a benchmark.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchViewerConfig } from '@/lib/api'
import { DEFAULT_VIEWER_CONFIG } from '@/lib/fallbackData'
import { setViewerConfig } from '@/lib/state'

const loading = ref(true)

onMounted(async () => {
  try {
    const config = await fetchViewerConfig()
    setViewerConfig(config)
  } catch {
    setViewerConfig(DEFAULT_VIEWER_CONFIG)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.about-page {
  flex: 1;
  padding: 1.5rem 1.25rem 2rem;
  max-width: 720px;
  margin: 0 auto;
}

.about-loading {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.about-content h1 {
  margin-top: 0;
  font-size: 1.5rem;
}

.about-content :deep(a) {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.about-content :deep(a:hover) {
  text-decoration: underline;
}
</style>
