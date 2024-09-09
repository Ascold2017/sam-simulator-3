<template>
    <primitive :object="data.scene"/>
</template>

<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'
const data = await useGLTF('/models/mars/scene.gltf')
</script>