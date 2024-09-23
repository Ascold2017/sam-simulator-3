export interface AA {
    id: number;
    name: string;
    type:  'guided-missile'
    ammoCount: number;
    ammoMinRange: number;
    ammoMaxRange: number;
    ammoVelocity: number;
    ammoKillRadius: number;
    ammoMaxOverload: number;
    captureAngle: number;
    reloadTime: number;
}

export type AAListResponse = AA[]