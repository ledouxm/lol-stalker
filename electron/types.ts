export interface MapPosition {
    id: number;
    posX: number;
    posY: number;
    outdoor: boolean;
    capabilities: number;
    nameId: number;
    showNameOnFingerpost: boolean;
    playlists: any[];
    subAreaId: number;
    worldMap: number;
    hasPriorityOnWorldmap: boolean;
    allowPrism: boolean;
    isTransition: boolean;
    mapHasTemplate: boolean;
    tacticalModeTemplateId: number;
    hasPublicPaddock: boolean;
}

export type MessageReceiver = Record<string, string>;
export type ProtocolTypeManager = Record<string, string>;
