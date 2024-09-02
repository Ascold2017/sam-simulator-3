import { coreInstance } from "../config/coreInstance";
export const gameController = async (io, socket) => {

    socket.on('capture_target', async(payload) => {
        const { aaId, azimuth, elevation } = payload

        const isCaptured = coreInstance.captureTargetOnDirection(aaId, azimuth, elevation)

        socket.emit('target_captured', {
            success: isCaptured
        })
    })

    socket.on('fire_target', async(payload) => {
        const { aaId, azimuth, elevation } = payload

        const isFired = coreInstance.fire(aaId, azimuth, elevation)

        socket.emit('target_fired', {
            success: isFired
        })
    })
}