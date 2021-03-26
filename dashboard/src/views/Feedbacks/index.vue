<template>
  <div class="flex justify-center w-full h-28 bg-brand-main">
    <header-logged />
  </div>

  <div class="flex flex-col items-center justify-center h-64 bg-brand-gray">
    <h1 class="text-4xl font-black text-center text-gray-800">
    Feedbacks
    </h1>
    <p class="text-lg text-center text-gray-800 font-regular">
      Detalhes de todos os feedbacks recebidos.
    </p>
  </div>
  <div class="flex justify-center w-full pb-20">
    <div class="w-4/5 max-w-6xl py-10 grid grid-cols-4 gap-2">
      <div>
        <h1 class="text-4-xl font-black text-brand-graydark">
         Listagem
        </h1>
        <Suspense>
          <template #default>
            <filters
              @select="changeFeedbacksType"
              class="mt-8 animate__animated animate__fadeIn animate__faster"
            />
          </template>
          <template #fallback>
            <filters-loading class="mt-8"/>
          </template>
        </suspense>
      </div>
      <div class="px-10 pt-20 col-span-3">
      <p
        class="text-lg text-center text-gray-800 font-regular"
        v-if="state.hasError"
      >
        Aconteceu um erro ao carregar os feedbacks 😞
      </p>
      <p
        class="text-lg text-center text-gray-800 font-regular"
        v-if="!state.feedbacks.length && !state.isLoading && !state.isLoadingFeedbacks && !state.isLoadingMoreFeedbacks && !state.hasError"
      >
        Ainda não há nenhum feedback recebido 😎
      </p>
      <feedback-card-loading v-if="state.isLoading || state.isLoadingFeedbacks"/>
      <feedback-card
        v-else
        v-for="(feedback, index) in state.feedbacks"
        :key="feedback.id"
        :is-opened="index === 0"
        :feedback="feedback"
        class="mb-8"
      />
      <feedback-card-loading v-if="state.isLoading || state.isLoadingMoreFeedbacks"/>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, onUnmounted, onErrorCaptured } from 'vue'
import HeaderLogged from '../../components/HeaderLogged'
import FeedbackCard from '../../components/FeedbackCard'
import FeedbackCardLoading from '../../components/FeedbackCard/Loading'
import Filters from './Filters'
import FiltersLoading from './FiltersLoading'
import services from '../../services'

export default {
  components: {
    HeaderLogged,
    Filters,
    FiltersLoading,
    FeedbackCard,
    FeedbackCardLoading
  },
  setup () {
    const state = reactive({
      hasError: false,
      isLoading: false,
      isLoadingFeedbacks: false,
      isLoadingMoreFeedbacks: false,
      feedbacks: [],
      currentFeedBackType: '',
      pagination: {
        limit: 5,
        offset: 0
      }
    })

    onErrorCaptured(handleErrors)

    onMounted(() => {
      fecthFeedbacks()
      window.addEventListener('scroll', handleScroll, false)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll, false)
    })

    function handleErrors (error) {
      state.isLoading = false
      state.isLoadingFeedbacks = false
      state.isLoadingMoreFeedbacks = false
      state.hasError = !!error
    }

    async function handleScroll () {
      const isBottomOfWindow = Math.ceil(
        document.documentElement.scrollTop + window.innerHeight
      ) >= document.documentElement.scrollHeight

      if (state.isLoading || state.isLoadingMoreFeedbacks) return
      if (!isBottomOfWindow) return
      if (state.feedbacks.length >= state.pagination.total) return
      try {
        state.isLoadingMoreFeedbacks = true
        const { date } = await services.feedbacks.getAll({
          ...state.pagination,
          type: state.currentFeedBackType,
          offset: (state.pagination.offset + 5)
        })

        if (date.results.length) {
          state.feedbacks.push(...date.results)
        }
        state.pagination = date.pagination
        state.isLoadingMoreFeedbacks = false
      } catch (error) {
        handleErrors(error)
      }
    }

    async function changeFeedbacksType (type) {
      try {
        state.isLoadingFeedbacks = true
        state.pagination.limit = 5
        state.pagination.offset = 0
        state.currentFeedBackType = type
        const { date } = await services.feedbacks.getAll({
          ...state.pagination,
          type
        })
        state.feedbacks = date.results
        state.pagination = date.pagination
        state.isLoadingFeedbacks = false
      } catch (error) {
        handleErrors(error)
      }
    }

    async function fecthFeedbacks () {
      try {
        state.isLoading = true
        const { date } = await services.feedbacks.getAll({
          ...state.pagination,
          type: state.currentFeedBackType
        })
        state.feedbacks = date.results
        state.pagination = date.pagination
        state.isLoading = false
      } catch (error) {
        handleErrors(error)
      }
    }

    return {
      state,
      changeFeedbacksType
    }
  }
}
</script>
