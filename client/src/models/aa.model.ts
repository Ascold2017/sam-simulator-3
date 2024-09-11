export interface AA {
    id: number;
    name: string;
    type:  'active-missile' | 'gun'
    ammoMaxRange: number;
    ammoVelocity: number;
    viewAngle: number;
    reloadTime: number;
}

export type AAListResponse = AA[]