<script setup lang="ts">
import Button from "@/components/button/button.vue";

function handleClick() {
  console.log(document.querySelector(":root")?.classList.add("dark"));
}
</script>

<template>
  <Button type="primary" @click="handleClick">toggle</Button>
</template>

<style>
button {
  outline: inherit !important;
}

button:hover {
  border-color: inherit;
}
</style>
