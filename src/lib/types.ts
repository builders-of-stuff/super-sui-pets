export type Tier = 1 | 2 | 3 | 4 | 5 | 6;

export interface Pet {
    id: string; // Unique instance ID
    name: string; // e.g., "Ant"
    tier: Tier;
    attack: number;
    health: number;
    xp: number; // For leveling up (1->2->3)
    level: 1 | 2 | 3;
    ability?: string; // Description or ID of ability
}

export interface Food {
    id: string;
    name: string;
    tier: Tier;
    cost: number;
    description: string;
}

export interface ShopItem {
    id: string; // Unique slot ID
    type: 'pet' | 'food';
    item: Pet | Food;
    frozen: boolean;
    cost: number;
}

export type Team = (Pet | null)[]; // Fixed 5 slots

export type GamePhase = 'MENU' | 'SHOP' | 'BATTLE' | 'GAMEOVER';

export interface GameState {
    gold: number;
    lives: number;
    turn: number;
    wins: number;
    phase: GamePhase;
    shop: ShopItem[];
    team: Team;
    enemyTeam: Team; // For the battle phase
}
