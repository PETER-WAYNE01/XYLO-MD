import { getConfig, persistDefault } from './lib/configdb.js'

const defaults = {
  PREFIX: '.',
  MODE: 'public',
  CREATOR: '2349133354644@s.whatsapp.net',
  OWNER_NUMBERS: ['2349133354644'],
  MONGODB_URI: '',
  BOT_NAME: 'Xylo-MD',
  FOOTER: '© Powered by DavidX',
  ANTIDELETE_MODE: 'off',
  AUTOVIEW_STATUS: false,
  AUTOLIKE_STATUS: false
}

let cache = {}

const SESSION_ID = process.env.SESSION_ID || 'DAVE-S*F=PP1B0RG6U8'
cache.SESSION_ID = SESSION_ID 

async function initConfig() {
  for (const [key, defValue] of Object.entries(defaults)) {
    let value = await getConfig(key.toLowerCase())
    if (value === undefined) {
      value = defValue
      await persistDefault(key, value)
      console.log(`[Config ✅] ${key} = ${value} (default → saved)`)
    } else {
      console.log(`[Config ✅] ${key} = ${value} (DB)`)
    }
    cache[key.toUpperCase()] = value
  }
}

export function updateCache(key, value) {
  cache[key.toUpperCase()] = value
}

const config = new Proxy({}, {
  get(_, prop) {
    return cache[prop.toUpperCase()]
  },
  set() {
    throw new Error('Use setConfig() to change values, not direct assignment')
  }
})

export default config

initConfig().catch(err => {
  console.error('🚫 Failed to initialize config:', err)
})
