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
    reloadTime: number;
}

export type AAListResponse = AA[]