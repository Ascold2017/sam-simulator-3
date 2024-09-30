<template>
    <TresGroup>
        <TresSprite :scale="[100, 100, 100]">
            <TresSpriteMaterial transparent :map="explosionTexture" color="orange" :opacity="opacity" />
        </TresSprite>
        <TresPointLight :position="[0, 0, 0]" :intensity="10" color="yellow" :distance="3000" />

        <Sound url="/explosion.mp3" :volume="2" />
    </TresGroup>
</template>

<script setup lang="ts">
import { TextureLoader } from 'three';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import Sound from './Sound.vue';
import { useRenderLoop } from '@tresjs/core';

const lifeTime = 15;
const opacity = ref(1)
const explosionTexture = ref(new TextureLoader().load('/smoke2.png'));

const { onLoop } = useRenderLoop();
const offLoop = ref<Function | null>(null)


onMounted(() => {
    const startTime = Date.now()
    const { off } = onLoop(() => {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 1000; // Время жизни в секундах
        const remainingTime = lifeTime - elapsedTime;
        if (remainingTime > 0) {
            opacity.value = remainingTime / lifeTime; // Плавное исчезновение
        } else {
            off()
        }
    });
    offLoop.value = off
})

onBeforeUnmount(() => {
    offLoop.value && offLoop.value()
})
</script>