<template>
    <!-- PositionalAudio для позиционирования звука в пространстве -->
    <TresPositionalAudio :args="[listener]" ref="audio" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useTres } from '@tresjs/core';
import { AudioListener, AudioLoader, PositionalAudio } from 'three';

interface SoundProps {
    url: string;
    loop?: boolean;
}

// Получаем камеру из контекста TresJS
const { camera } = useTres();
const props = defineProps<SoundProps>();

// Создаем аудио слушатель
const listener = new AudioListener();
const audio = ref<PositionalAudio | null>(null);

// Добавляем слушатель к камере
camera.value.add(listener);

// Загружаем аудиофайл и добавляем его к PositionalAudio
onMounted(() => {
    const audioLoader = new AudioLoader();

    audioLoader.load(props.url, (buffer) => {
        if (!audio.value) return;

        // Присваиваем буфер звуку
        audio.value.setBuffer(buffer);
        audio.value.setLoop(props.loop || false);
        audio.value.setVolume(20);
        audio.value.play(); // Запускаем воспроизведение звука
    });
});

onBeforeUnmount(() => {
    if (audio.value) {
        audio.value.stop(); // Останавливаем звук
        audio.value.disconnect(); // Отключаем от аудио-слушателя
    }

    // Удаляем слушатель из камеры
    camera.value.remove(listener);
})
</script>