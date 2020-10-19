import Vue from 'vue'
import Vuex from 'vuex'
import Meta from 'vue-meta'
import ClientOnly from 'vue-client-only'
import NoSsr from 'vue-no-ssr'
import { createRouter } from './router.js'
import NuxtChild from './components/nuxt-child.js'
import NuxtError from './components/nuxt-error.vue'
import Nuxt from './components/nuxt.js'
import App from './App.js'
import { setContext, getLocation, getRouteData, normalizeError } from './utils'
import { createStore } from './store.js'

/* Plugins */

import nuxt_plugin_pluginrouting_1c99a07b from 'nuxt_plugin_pluginrouting_1c99a07b' // Source: .\\nuxt-i18n\\plugin.routing.js (mode: 'all')
import nuxt_plugin_pluginmain_6f1094d4 from 'nuxt_plugin_pluginmain_6f1094d4' // Source: .\\nuxt-i18n\\plugin.main.js (mode: 'all')
import nuxt_plugin_apollomodule_71f4d8ca from 'nuxt_plugin_apollomodule_71f4d8ca' // Source: .\\apollo-module.js (mode: 'all')
import nuxt_plugin_nuxtsvgsprite_3b4ebec8 from 'nuxt_plugin_nuxtsvgsprite_3b4ebec8' // Source: .\\nuxt-svg-sprite.js (mode: 'all')
import nuxt_plugin_cookieuniversalnuxt_49c5cea6 from 'nuxt_plugin_cookieuniversalnuxt_49c5cea6' // Source: .\\cookie-universal-nuxt.js (mode: 'all')
import nuxt_plugin_nuxttypedvuex_c93a9356 from 'nuxt_plugin_nuxttypedvuex_c93a9356' // Source: .\\nuxt-typed-vuex.js (mode: 'all')
import nuxt_plugin_router_0db40071 from 'nuxt_plugin_router_0db40071' // Source: .\\router.js (mode: 'all')
import nuxt_plugin_nuxtclientinitclient_a74159dc from 'nuxt_plugin_nuxtclientinitclient_a74159dc' // Source: ..\\plugins\\nuxt-client-init.client.ts (mode: 'client')
import nuxt_plugin_polyfills_473a241f from 'nuxt_plugin_polyfills_473a241f' // Source: ..\\plugins\\polyfills.ts (mode: 'client')

// Component: <ClientOnly>
Vue.component(ClientOnly.name, ClientOnly)

// TODO: Remove in Nuxt 3: <NoSsr>
Vue.component(NoSsr.name, {
  ...NoSsr,
  render (h, ctx) {
    if (process.client && !NoSsr._warned) {
      NoSsr._warned = true

      console.warn('<no-ssr> has been deprecated and will be removed in Nuxt 3, please use <client-only> instead')
    }
    return NoSsr.render(h, ctx)
  }
})

// Component: <NuxtChild>
Vue.component(NuxtChild.name, NuxtChild)
Vue.component('NChild', NuxtChild)

// Component NuxtLink is imported in server.js or client.js

// Component: <Nuxt>
Vue.component(Nuxt.name, Nuxt)

Object.defineProperty(Vue.prototype, '$nuxt', {
  get() {
    return this.$root.$options.$nuxt
  },
  configurable: true
})

Vue.use(Meta, {"keyName":"head","attribute":"data-n-head","ssrAttribute":"data-n-head-ssr","tagIDKeyName":"hid"})

const defaultTransition = {"name":"page","mode":"out-in","appear":false,"appearClass":"appear","appearActiveClass":"appear-active","appearToClass":"appear-to"}

const originalRegisterModule = Vuex.Store.prototype.registerModule
const baseStoreOptions = { preserveState: process.client }

function registerModule (path, rawModule, options = {}) {
  return originalRegisterModule.call(this, path, rawModule, { ...baseStoreOptions, ...options })
}

async function createApp(ssrContext, config = {}) {
  const router = await createRouter(ssrContext)

  const store = createStore(ssrContext)
  // Add this.$router into store actions/mutations
  store.$router = router

  // Fix SSR caveat https://github.com/nuxt/nuxt.js/issues/3757#issuecomment-414689141
  store.registerModule = registerModule

  // Create Root instance

  // here we inject the router and store to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = {
    head: {"title":"@everhoof\u002Feverhoof","meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"hid":"description","name":"description","content":"Website fo internet radio"}],"link":[{"rel":"icon","type":"image\u002Fpng","href":"\u002Ffavicon.png"},{"rel":"stylesheet","href":"https:\u002F\u002Ffonts.googleapis.com\u002Fcss2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap"}],"script":[{"src":"\u002Fjs\u002Fset.min.js"},{"src":"\u002Fjs\u002Fie11vars.min.js"},{"src":"\u002Fjs\u002Fsvgxuse.min.js"}],"htmlAttrs":{"class":["page page_theme_dark page_theme_red"]},"bodyAttrs":{"class":["page__body grid grid_type_default"]},"style":[]},

    store,
    router,
    nuxt: {
      defaultTransition,
      transitions: [defaultTransition],
      setTransitions (transitions) {
        if (!Array.isArray(transitions)) {
          transitions = [transitions]
        }
        transitions = transitions.map((transition) => {
          if (!transition) {
            transition = defaultTransition
          } else if (typeof transition === 'string') {
            transition = Object.assign({}, defaultTransition, { name: transition })
          } else {
            transition = Object.assign({}, defaultTransition, transition)
          }
          return transition
        })
        this.$options.nuxt.transitions = transitions
        return transitions
      },

      err: null,
      dateErr: null,
      error (err) {
        err = err || null
        app.context._errored = Boolean(err)
        err = err ? normalizeError(err) : null
        let nuxt = app.nuxt // to work with @vue/composition-api, see https://github.com/nuxt/nuxt.js/issues/6517#issuecomment-573280207
        if (this) {
          nuxt = this.nuxt || this.$options.nuxt
        }
        nuxt.dateErr = Date.now()
        nuxt.err = err
        // Used in src/server.js
        if (ssrContext) {
          ssrContext.nuxt.error = err
        }
        return err
      }
    },
    ...App
  }

  // Make app available into store via this.app
  store.app = app

  const next = ssrContext ? ssrContext.next : location => app.router.push(location)
  // Resolve route
  let route
  if (ssrContext) {
    route = router.resolve(ssrContext.url).route
  } else {
    const path = getLocation(router.options.base, router.options.mode)
    route = router.resolve(path).route
  }

  // Set context to app.context
  await setContext(app, {
    store,
    route,
    next,
    error: app.nuxt.error.bind(app),
    payload: ssrContext ? ssrContext.payload : undefined,
    req: ssrContext ? ssrContext.req : undefined,
    res: ssrContext ? ssrContext.res : undefined,
    beforeRenderFns: ssrContext ? ssrContext.beforeRenderFns : undefined,
    ssrContext
  })

  function inject(key, value) {
    if (!key) {
      throw new Error('inject(key, value) has no key provided')
    }
    if (value === undefined) {
      throw new Error(`inject('${key}', value) has no value provided`)
    }

    key = '$' + key
    // Add into app
    app[key] = value
    // Add into context
    if (!app.context[key]) {
      app.context[key] = value
    }

    // Add into store
    store[key] = app[key]

    // Check if plugin not already installed
    const installKey = '__nuxt_' + key + '_installed__'
    if (Vue[installKey]) {
      return
    }
    Vue[installKey] = true
    // Call Vue.use() to install the plugin into vm
    Vue.use(() => {
      if (!Object.prototype.hasOwnProperty.call(Vue.prototype, key)) {
        Object.defineProperty(Vue.prototype, key, {
          get () {
            return this.$root.$options[key]
          }
        })
      }
    })
  }

  // Inject runtime config as $config
  inject('config', config)

  if (process.client) {
    // Replace store state before plugins execution
    if (window.__NUXT__ && window.__NUXT__.state) {
      store.replaceState(window.__NUXT__.state)
    }
  }

  // Add enablePreview(previewData = {}) in context for plugins
  if (process.static && process.client) {
    app.context.enablePreview = function (previewData = {}) {
      app.previewData = Object.assign({}, previewData)
      inject('preview', previewData)
    }
  }
  // Plugin execution

  if (typeof nuxt_plugin_pluginrouting_1c99a07b === 'function') {
    await nuxt_plugin_pluginrouting_1c99a07b(app.context, inject)
  }

  if (typeof nuxt_plugin_pluginmain_6f1094d4 === 'function') {
    await nuxt_plugin_pluginmain_6f1094d4(app.context, inject)
  }

  if (typeof nuxt_plugin_apollomodule_71f4d8ca === 'function') {
    await nuxt_plugin_apollomodule_71f4d8ca(app.context, inject)
  }

  if (typeof nuxt_plugin_nuxtsvgsprite_3b4ebec8 === 'function') {
    await nuxt_plugin_nuxtsvgsprite_3b4ebec8(app.context, inject)
  }

  if (typeof nuxt_plugin_cookieuniversalnuxt_49c5cea6 === 'function') {
    await nuxt_plugin_cookieuniversalnuxt_49c5cea6(app.context, inject)
  }

  if (typeof nuxt_plugin_nuxttypedvuex_c93a9356 === 'function') {
    await nuxt_plugin_nuxttypedvuex_c93a9356(app.context, inject)
  }

  if (typeof nuxt_plugin_router_0db40071 === 'function') {
    await nuxt_plugin_router_0db40071(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_nuxtclientinitclient_a74159dc === 'function') {
    await nuxt_plugin_nuxtclientinitclient_a74159dc(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_polyfills_473a241f === 'function') {
    await nuxt_plugin_polyfills_473a241f(app.context, inject)
  }

  // Lock enablePreview in context
  if (process.static && process.client) {
    app.context.enablePreview = function () {
      console.warn('You cannot call enablePreview() outside a plugin.')
    }
  }

  // If server-side, wait for async component to be resolved first
  if (process.server && ssrContext && ssrContext.url) {
    await new Promise((resolve, reject) => {
      router.push(ssrContext.url, resolve, (err) => {
        // https://github.com/vuejs/vue-router/blob/v3.4.3/src/util/errors.js
        if (!err._isRouter) return reject(err)
        if (err.type !== 2 /* NavigationFailureType.redirected */) return resolve()

        // navigated to a different route in router guard
        const unregister = router.afterEach(async (to, from) => {
          ssrContext.url = to.fullPath
          app.context.route = await getRouteData(to)
          app.context.params = to.params || {}
          app.context.query = to.query || {}
          unregister()
          resolve()
        })
      })
    })
  }

  return {
    store,
    app,
    router
  }
}

export { createApp, NuxtError }
