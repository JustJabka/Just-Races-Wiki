import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "pages",
  
  base: '/justraces/',

  title: "Just Races",
  description: "Lightweight, data-driven Minecraft races framework.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/docs/' },
      { text: 'Configuration', link: '/config/'},
      { text: 'Wiki', link: '/wiki/'}
    ],

    sidebar: {
      '/docs/': [
        {
          text: 'Getting Started',
          items: []
        },
        {
          text: 'Races',
          items: [
            { text: 'Creating Your First Race', link: '/docs/races/first-race'},
            { text: 'Advanced Race', link: '/docs/races/advanced-race'}
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    
    footer: {
      "message": "NOT AN OFFICIAL MINECRAFT WEBSITE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT."
    }
  },

  cleanUrls: true
})
