export interface AdmMission {
    id: number;
    name: string;
    map: {
        id: number;
        name: string;
        filename: string;
        size: number;
        maxHeight: number;
        createdAt: number;
    }
}
export type AdmMissionListResponse = AdmMission[]