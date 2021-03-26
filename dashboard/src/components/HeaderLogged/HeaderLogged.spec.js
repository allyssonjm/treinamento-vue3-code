import { shallowMount } from '@vue/test-utils'
import HeaderLogged from '.'
import { routes } from '../../router'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

const mockStore = {
  currentUser: {}
}

jest.mock('../../hooks/useStore', () => {
  return () => mockStore
})

describe('<HeaderLogged />', () => {
  it('shoul render header logged correctly', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = shallowMount(HeaderLogged, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('shoul render 3 dots when there\'s user logged', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = shallowMount(HeaderLogged, {
      global: {
        plugins: [router]
      }
    })
    const buttonLogout = wrapper.find('#logout-button')
    expect(buttonLogout.text()).toBe('...')
  })

  it('shoul render 3 dots when there\'s user logged', async () => {
    router.push('/')
    await router.isReady()
    mockStore.currentUser.name = 'Allysson'
    const wrapper = shallowMount(HeaderLogged, {
      global: {
        plugins: [router]
      }
    })
    const buttonLogout = wrapper.find('#logout-button')
    expect(buttonLogout.text()).toBe('Allysson (sair)')
  })
})
