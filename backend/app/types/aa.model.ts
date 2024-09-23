export interface AA {
    id: number;
    name: string;
    type:  'guided-missile'
    ammoMinRange: number;
    ammoMaxRange: number;
    ammoVelocity: number;
    ammoKillRadius: number;
    ammoMaxOverload: number;
    ammoCount: number;
    captureAngle: number;
    reloadTime: number;
}

export type AAListResponse = AA[]