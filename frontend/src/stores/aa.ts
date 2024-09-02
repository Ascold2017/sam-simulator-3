import { defineStore } from "pinia";
import { useCameraStore } from "./camera";
import { useMissionStore } from "./mission";
import { socketClient } from "../adapters/socketClient";

export const useAAStore = defineStore('aa', () => {
    const missionStore = useMissionStore();
    const cameraStore = useCameraStore();;

    function captureTarget() {
        if (!missionStore.currentAA) return;
        socketClient.send('capture_target', {
            aaId: missionStore.currentAA.id,
            azimuth: cameraStore.azimuth,
            elevation: cameraStore.elevation
        })
    }

    function fireTarget() {
        if (!missionStore.currentAA) return;
        socketClient.send('fire_target', {
            aaId: missionStore.currentAA.id,
            azimuth: cameraStore.azimuth,
            elevation: cameraStore.elevation
        })
    }

    socketClient.listenToEvent('target_captured', (e) => {
        console.log(e)
    })

    return {
        captureTarget,
        fireTarget
    }
})