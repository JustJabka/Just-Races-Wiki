<script setup>
import DefaultTheme from 'vitepress/theme'
import { withBase } from 'vitepress'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #not-found>
      <div class="NotFound">
        <p class="code">404</p>
        <h1 class="title">PAGE NOT FOUND</h1>
        <div class="divider" />
        
        <div class="gif-wrapper">
          <img :src="withBase('/assets/404.gif')" alt="Cats working hard" class="not-found-gif" />
          <blockquote class="quote">
            Cats are working very hard on this page!
          </blockquote>
        </div>

        <div class="action">
          <a class="link" :href="withBase('/')" aria-label="go to home">
            Take me home
          </a>
        </div>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.NotFound {
  padding: 64px 24px 96px;
  text-align: center;
}

@media (min-width: 768px) {
  .NotFound {
    padding: 96px 32px 128px;
  }
}

.code {
  line-height: 64px;
  font-size: 64px;
  font-weight: 600;
}

.title {
  padding-top: 12px;
  letter-spacing: 2px;
  line-height: 20px;
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.divider {
  margin: 24px auto 36px;
  width: 64px;
  height: 1px;
  background-color: var(--vp-c-divider);
}

.gif-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 36px;
}

.not-found-gif {
  max-width: 280px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.quote {
  font-style: italic;
  color: var(--vp-c-text-2);
  margin: 0;
}

.action {
  padding-top: 12px;
}

.link {
  display: inline-block;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 16px;
  padding: 4px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  transition: border-color 0.25s, color 0.25s;
}

.link:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-2);
}
</style>