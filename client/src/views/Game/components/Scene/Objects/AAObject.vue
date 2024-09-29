<template>
    <TresGroup :position="aaObject.position">
        <TresMesh :position="[0, -7.5, 0]">
            <TresConeGeometry :args="[3, 12, 32, 32]" />
            <TresMeshBasicMaterial :color="0x00ff00" />
        </TresMesh>

        <!-- Спрайт с юзернеймом -->
        <TresSprite :position="[0, 10, 0]" :scale="[spriteScale, spriteScale, spriteScale]" v-if="aaObject.userId !== authStore.user?.id">
            <TresSpriteMaterial :map="usernameTexture" />
        </TresSprite>
    </TresGroup>
</template>

<script setup lang="ts">
import { CanvasTexture, Vector3 } from 'three';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { AAState } from '../../../../../models/sockets.model';
import { useRenderLoop } from '@tresjs/core';
import { useGameStore } from '../../../../../stores/game';
import { useAuthStore } from '../../../../../stores/auth';

const gameStore = useGameStore();
const authStore = useAuthStore()
const props = defineProps<{
    aaObject: AAState
}>()

const usernameTexture = ref(null);
const spriteScale = ref(1);

// Рендер-цикл для обновления масштаба спрайта в зависимости от расстояния
const { onLoop } = useRenderLoop();

const offLoop = ref<Function | null>(null);
onMounted(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;

    if (context) {

        context.font = 'bold 60px Arial';
        context.letterSpacing = '5px';
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.fillText(props.aaObject.username || 'Unknown', canvas.width / 2, canvas.height / 2);

        usernameTexture.value = new CanvasTexture(canvas);
    }

    const { off } = onLoop(() => {
        if (gameStore.cameraLink) {
            const aaPosition = new Vector3(...props.aaObject.position);
            const cameraPosition = gameStore.cameraLink.position;

            const distance = cameraPosition.distanceTo(aaPosition);
            spriteScale.value = distance / 10;
        }
    });

    offLoop.value = off;

});

onBeforeUnmount(() => {
    if (offLoop.value) {
        offLoop.value();
    }
})

</script>