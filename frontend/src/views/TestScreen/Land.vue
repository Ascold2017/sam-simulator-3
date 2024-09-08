<template>
    <primitive :object="data.scene" :position="[-4000, -700, 4000]" />
</template>

<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'
const data = await useGLTF('/models/mars/scene.gltf')

</script>