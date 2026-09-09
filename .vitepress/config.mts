import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "pages",
  
  base: '/Just-Races-Wiki/',
  appearance: true,

  head: [
    [
      'link', { rel: 'icon', href: '/Just-Races-Wiki/favicon.png' }
    ]
  ],

  title: "Just Races",
  description: "Lightweight, data-driven Minecraft races framework",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/logo.png",

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
          collapsed: true,
          items: []
        },
        {
          text: 'Races',
          collapsed: true,
          items: [
            { text: 'Race Definition', link: '/docs/races/race-definition'},
            { text: 'Creating Your First Race', link: '/docs/races/first-race'},
            { text: 'Advanced Race', link: '/docs/races/advanced-race'},
          ]
        },
        {
          text: 'Abilities',
          collapsed: true,
          items: [
            { text: 'Creating Your First Ability', link: '/docs/abilities/first-ability'},
            { text: 'Advanced Ability', link: '/docs/abilities/advanced-ability'},
          ]
        },
        {
          text: 'Traits',
          collapsed: true,
          items: [
            { text: 'Creating Your First Trait', link: '/docs/traits/first-trait'},
          ]
        },
        {
          text: 'Item Modifiers',
          collapsed: true,
          items: [
            { text: 'Creating Your First Item Modifier', link: '/docs/item-modifiers/first-item-modifier'},
            { text: 'Advanced Item Modifier', link: '/docs/item-modifiers/advanced-item-modifier'},
          ]
        },
        {
          text: 'Miscellaneous',
          collapsed: true,
          items: [
            { text: 'Persistent Holder', link: '/docs/misc/persistent-holder'},
          ]
        }
      ]
    },

    outline: {
      level: [2, 4]
    },

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/JustJabka/Just-Races-Wiki' }
    ],
    
    footer: {
      "message": "NOT AN OFFICIAL MINECRAFT WEBSITE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT."
    }
  },

  cleanUrls: true
})
