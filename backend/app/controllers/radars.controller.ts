import { coreInstance } from "../config/coreInstance"

export const radarController = (io, socket) => {
    socket.on('subscribe_radar', ({ radarId }: { radarId: string }) => {
        coreInstance.radarManager.subscribeToRadarUpdates(radarId, (radar) => {
            socket.emit('radar_update', radar)
        })
    });

    socket.on('toggle_radar', ({ radarId, enabled }: { radarId: string; enabled: boolean }) => {
        coreInstance.radarManager.toggleRadarById(radarId, enabled)
    })

    socket.on('move_sector_radar', ({ radarId, azimuth, elevation }: { radarId: string; azimuth: number; elevation: number }) => {
        coreInstance.radarManager.setAngleSectorRadarById(radarId, azimuth, elevation)
    })
}
