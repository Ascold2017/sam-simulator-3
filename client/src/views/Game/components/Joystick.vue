<template>
    <div 
      class="joystick-container"
      @mousedown="startDrag" 
      @mouseup="stopDrag" 
      @mouseleave="stopDrag"
      @mousemove="onMove"
      @touchstart="startDrag"
      @touchend="stopDrag" 
      @touchmove="onMove"
    >
      <div class="joystick" :style="joystickStyle"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, defineEmits, watch, onBeforeUnmount } from 'vue';
  
  interface ChangePayload {
    azimuth: number;
    elevation: number;
  }
  
  const props = defineProps<{ 
    minElevation: number; 
    maxElevation: number; 
    lookSpeed: number; 
    direction: { azimuth: number; elevation: number };
  }>();
  
  const emit = defineEmits<{ change: [payload: ChangePayload] }>();
  
  const isDragging = ref(false);
  const joystickX = ref(50); // Позиция джойстика в процентах от контейнера
  const joystickY = ref(50);
  
  const azimuth = ref(props.direction.azimuth);
  const elevation = ref(props.direction.elevation);
  
  let animationFrameId: number | null = null;
  let movementDeltaX = 0;
  let movementDeltaY = 0;
  
  // Обновляем стиль джойстика
  const joystickStyle = computed(() => ({
    left: `${joystickX.value}%`,
    top: `${joystickY.value}%`,
  }));
  
  // Функция для начала перетаскивания
  const startDrag = () => {
    isDragging.value = true;
    if (!animationFrameId) {
      startAnimationLoop();
    }
  };
  
  // Функция для остановки перетаскивания
  const stopDrag = () => {
    isDragging.value = false;
    resetJoystick();
  };
  
  // Сбрасываем положение джойстика в центр
  const resetJoystick = () => {
    joystickX.value = 50;
    joystickY.value = 50;
    movementDeltaX = 0;
    movementDeltaY = 0;
  };
  
  // Основная функция для обработки движений мыши и касаний
  const onMove = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return;
  
    const { clientX, clientY } = getClientCoordinates(event);
    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
  
    const offsetX = ((clientX - rect.left) / rect.width) * 100;
    const offsetY = ((clientY - rect.top) / rect.height) * 100;
  
    // Ограничиваем движение джойстика
    joystickX.value = Math.max(0, Math.min(100, offsetX));
    joystickY.value = Math.max(0, Math.min(100, offsetY));
  
    movementDeltaX = (joystickX.value - 50) / 50; // Нормализуем в диапазон [-1, 1]
    movementDeltaY = (joystickY.value - 50) / 50; // Нормализуем в диапазон [-1, 1]
  };
  
  // Получаем координаты X и Y для мыши или касания
  const getClientCoordinates = (event: MouseEvent | TouchEvent) => {
    if (event instanceof MouseEvent) {
      return { clientX: event.clientX, clientY: event.clientY };
    }
    if (event instanceof TouchEvent && event.touches.length) {
      return { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY };
    }
    return { clientX: 0, clientY: 0 };
  };
  
  // Анимационный цикл для обновления азимута и угла возвышения
  const updateDirection = (deltaTime: number) => {
    if (!isDragging.value) return;
  
    const speedFactor = Math.min(1, props.lookSpeed * deltaTime * 0.001); // Ограничиваем скорость
  
    // Изменяем азимут и угол возвышения
    const newAzimuth = (azimuth.value - movementDeltaX * speedFactor) % (2 * Math.PI)
    azimuth.value = newAzimuth < 0 ? newAzimuth + 2 * Math.PI : newAzimuth;
    elevation.value = Math.min(
      props.maxElevation,
      Math.max(props.minElevation, elevation.value - movementDeltaY * speedFactor)
    );
  
    emit('change', { azimuth: azimuth.value, elevation: elevation.value });
  };
  
  // Анимационный цикл с частотой 40-60 fps
  const startAnimationLoop = () => {
    let lastTime = performance.now();
  
    const loop = (time: number) => {
      const deltaTime = time - lastTime;
      if (deltaTime >= 16) { // ~60 fps (16ms/frame)
        updateDirection(deltaTime);
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(loop);
    };
  
    animationFrameId = requestAnimationFrame(loop);
  };
  
  // Очищаем все, если компонент демонтируется
  onBeforeUnmount(() => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  });
  
  // Следим за изменением пропса direction, чтобы обновлять значения азимута и угла возвышения
  watch(() => props.direction, (newDirection) => {
    azimuth.value = newDirection.azimuth;
    elevation.value = newDirection.elevation;
  });
  </script>
  
  <style scoped>
  .joystick-container {
    width: 100px;
    height: 100px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    position: relative;
    user-select: none;
  }
  .joystick {
    width: 30px;
    height: 30px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
  }
  </style>
  