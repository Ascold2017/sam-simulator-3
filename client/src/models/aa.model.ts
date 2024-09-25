export interface AA {
    id: number;
    name: string;
    missileMinRange: number;
    missileMaxRange: number;
    missileVelocity: number;
    missileKillRadius: number;
    missileMaxOverload: number;
    missileCount: number;
    captureAngle: number;
    captureChannelCount: number;
    reloadTime: number;
}

export type AAListResponse = AA[]