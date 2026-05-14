import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'wsjmcvrh',
  dataset: 'production',
  apiVersion: '2024-06-01',
  useCdn: true,
  token: "sk5ItVOH996bphBP7wVNb88YI1dzl8toahjsYrdi6xqtFxDcG6leELpJxpvT2OLZ1D4jO9FeRP6A0CCC0cfmN6nxC2bHDycEaZ5e3eilckUQH8KgBOzJEqgdYfb6bKp3KTqpznb9gu5cL4Y8RP2NPohttDdR74jV94qxWLv68vg5YaEnbyNk"
})

export default client