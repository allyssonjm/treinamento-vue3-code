<template>
  <svg
    :width="size"
    :height="size" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M 1.9975,10 8.5,3.81916 15.0025,10 17,8.09717 8.5,0 0,8.09717 Z"
      :fill="color"
    />
  </svg>
</template>

<script>
export default {
  props: {
    size: { type: [String, Number], default: 22 },
    color: { type: String, default: 'white' }
  }
}
</script>
