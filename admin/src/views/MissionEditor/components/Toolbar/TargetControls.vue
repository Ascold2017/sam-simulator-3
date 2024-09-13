<template>
    <div class="mission-editor-toolbar-targets">
        <!-- Дропдаун с кнопкой Add new и списком целей -->
        <Dropdown buttonLabel="Select Target" class="mr-2">
            <template #body>
                <!-- Кнопка Add new -->
                <button @click="openAddTargetPopup" class="dropdown-content__add-btn">Add new</button>

                <!-- Список целей -->
                <ul>
                    <li v-for="option in targetsOptions" :key="option.value" @click="selectTarget(option.value)">
                        {{ option.label }}
                    </li>
                </ul>
            </template>
        </Dropdown>

        <!-- Кнопки для работы с точками маршрута -->
        <button @click="addWaypoint" :disabled="!selectedTargetId" class="mission-editor-toolbar-targets__action-btn">Add
            waypoint</button>

        <!-- Попап добавления новой цели -->
        <Popup v-if="isPopupVisible" @close="closePopup">
            <template #header>Add new target</template>
            <template #content>
                <BaseSelect id="target-object-select" v-model="newTargetObjectId" :options="targetObjectOptions"
                    label="Target Object" />
            </template>
            <template #footer>
                <button @click="addNewTarget" class="popup__add-btn">Add</button>
                <button @click="closePopup" class="popup__cancel-btn">Cancel</button>
            </template>
        </Popup>
    </div>
</template>


<script setup lang="ts">
import BaseSelect from '../../../../components/BaseSelect.vue';
import Popup from '../../../../components/Popup.vue';
import Dropdown from '../../../../components/Dropdown.vue';
import { computed, onMounted, ref } from 'vue';
import { useMaps } from '../../../../stores/maps';
import { storeToRefs } from 'pinia';
import { useMissionEditor } from '../../../../stores/missionEditor';

const mapsStore = useMaps();
const missionEditor = useMissionEditor()
const { targets } = storeToRefs(missionEditor)

// Опции для выбора цели
const selectedTargetId = ref<string | null>(null);
const targetsOptions = computed(() => targets.value.map(target => ({ label: target.id, value: target.id })));

const selectTarget = (targetId: string) => {
    selectedTargetId.value = targetId;
}
// Функции для добавления и удаления waypoints
const addWaypoint = () => {
    if (!selectedTargetId.value) return;
    missionEditor.addWaypoint(selectedTargetId.value)
};

// Логика для попапа добавления новой цели
const isPopupVisible = ref(false);
const newTargetObjectId = ref<number | null>(null);

// Замоканные объекты для выбора цели
const targetObjectOptions = ref([
    { label: 'Target Object 1', value: 1 },
    { label: 'Target Object 2', value: 2 },
]);

const openAddTargetPopup = () => {
    isPopupVisible.value = true;
};

const closePopup = () => {
    isPopupVisible.value = false;
};

const addNewTarget = () => {
    if (!newTargetObjectId.value) return;
    missionEditor.addTarget(newTargetObjectId.value);
    closePopup();
};


onMounted(() => {
    mapsStore.getMaps()
})

</script>

<style scoped>
.mission-editor-toolbar-targets {
    @apply flex items-center;
}

.mission-editor-toolbar-targets__select {
    @apply bg-gray-700 text-white px-4 py-2 rounded mr-4;
}

.add-target-btn {
    @apply ml-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600;
}

.mission-editor-toolbar-targets__action-btn {
    @apply bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2;
}

/* Стили для попапа */
.popup__add-btn {
    @apply bg-green-500 text-white px-4 py-2 rounded;
}

.popup__cancel-btn {
    @apply bg-red-500 text-white px-4 py-2 rounded;
}
</style>