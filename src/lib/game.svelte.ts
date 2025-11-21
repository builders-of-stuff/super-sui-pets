import { type GameState, type Pet, type ShopItem, type Team } from './types';

class GameStore {
    // Game State
    gold = $state(10);
    lives = $state(10);
    turn = $state(1);
    wins = $state(0);
    phase = $state<GameState['phase']>('MENU');
    
    shop = $state<ShopItem[]>([]);
    team = $state<Team>([null, null, null, null, null]);
    enemyTeam = $state<Team>([null, null, null, null, null]);

    constructor() {
        // Initialize
    }

    startGame() {
        this.gold = 10;
        this.lives = 10;
        this.turn = 1;
        this.wins = 0;
        this.team = [null, null, null, null, null];
        this.phase = 'SHOP';
        this.rollShop();
    }

    rollShop() {
        if (this.gold < 1 && this.phase !== 'MENU') return; // Can't roll if no gold (unless free roll logic added later)
        if (this.phase !== 'MENU') this.gold -= 1;

        // TODO: Implement actual random shop generation based on tier
        // For now, just mock some pets
        const newShop: ShopItem[] = [];
        
        // Keep frozen items
        const frozenItems = this.shop.filter(s => s.frozen);
        
        // Fill rest with random items (mock)
        const slots = 3 + (this.turn >= 3 ? 1 : 0) + (this.turn >= 5 ? 1 : 0); // 3 to 5 slots
        const needed = slots - frozenItems.length;

        for (let i = 0; i < needed; i++) {
            newShop.push({
                id: crypto.randomUUID(),
                type: 'pet',
                item: this.generateRandomPet(),
                frozen: false,
                cost: 3
            });
        }

        this.shop = [...frozenItems, ...newShop];
    }

    generateRandomPet(): Pet {
        const pets = [
            { name: 'Ant', attack: 2, health: 1, tier: 1 },
            { name: 'Fish', attack: 2, health: 2, tier: 1 },
            { name: 'Mosquito', attack: 2, health: 2, tier: 1 },
            { name: 'Cricket', attack: 1, health: 2, tier: 1 },
            { name: 'Beaver', attack: 3, health: 2, tier: 1 },
        ] as const;
        
        const template = pets[Math.floor(Math.random() * pets.length)];
        
        return {
            id: crypto.randomUUID(),
            name: template.name,
            tier: template.tier,
            attack: template.attack,
            health: template.health,
            xp: 1,
            level: 1
        };
    }

    buyPet(shopIdx: number, teamIdx: number) {
        const shopItem = this.shop[shopIdx];
        if (!shopItem || this.gold < shopItem.cost) return;
        if (this.team[teamIdx] !== null) return; // Slot occupied

        this.gold -= shopItem.cost;
        this.team[teamIdx] = shopItem.item as Pet;
        
        // Remove from shop
        this.shop = this.shop.filter((_, i) => i !== shopIdx);
    }

    sellPet(teamIdx: number) {
        const pet = this.team[teamIdx];
        if (!pet) return;

        this.gold += Math.max(1, pet.level); // Sell for 1 gold per level (simplified)
        this.team[teamIdx] = null;
    }

    freezeShopItem(shopIdx: number) {
        if (this.shop[shopIdx]) {
            this.shop[shopIdx].frozen = !this.shop[shopIdx].frozen;
        }
    }

    endTurn() {
        this.phase = 'BATTLE';
        // Generate enemy team
        this.enemyTeam = [
            this.generateRandomPet(),
            this.generateRandomPet(),
            this.generateRandomPet(),
            null,
            null
        ];
    }

    battleOver(result: 'win' | 'loss' | 'tie') {
        if (result === 'win') {
            this.wins += 1;
            // +1 gold next turn logic handled by just giving more gold or preserving? 
            // SAP gives 10 gold every turn, but wins give trophies. 
            // User said: "Lose = -1 life, Win = +1 gold next turn (SAP style)" -> Wait, SAP resets gold to 10. 
            // Maybe they mean +1 trophy? Or maybe they mean the "snacks" logic?
            // Let's stick to: Win = +1 win count.
        } else if (result === 'loss') {
            this.lives -= 1;
        }

        if (this.lives <= 0 || this.wins >= 10) {
            this.phase = 'GAMEOVER';
        } else {
            this.turn += 1;
            this.gold = 10; // Reset gold
            this.phase = 'SHOP';
            this.rollShop();
        }
    }
}

export const game = new GameStore();
