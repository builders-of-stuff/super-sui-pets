import * as Phaser from 'phaser';
import type { BattleLog, BattleEvent } from '$lib/logic/engine';
import type { Pet, Team } from '$lib/types';
import { sounds } from '$lib/sounds';

export class BattleScene extends Phaser.Scene {
    battleLog: BattleLog | null = null;
    petsA: Phaser.GameObjects.Sprite[] = [];
    petsB: Phaser.GameObjects.Sprite[] = [];
    textsA: Phaser.GameObjects.Text[] = [];
    textsB: Phaser.GameObjects.Text[] = [];
    namesA: Phaser.GameObjects.Text[] = [];
    namesB: Phaser.GameObjects.Text[] = [];
    
    onComplete: (() => void) | null = null;

    constructor() {
        super({ key: 'BattleScene' });
    }

    init(data: { battleLog: BattleLog, onComplete: () => void }) {
        this.battleLog = data.battleLog;
        this.onComplete = data.onComplete;
    }

    preload() {
        this.load.spritesheet('pets', '/pets_fixed.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('food', '/food_fixed.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('bg', '/bg.png');
    }

    create() {
        this.add.image(400, 300, 'bg').setScale(4);
        
        if (this.battleLog) {
            this.playBattle(this.battleLog);
        }
    }

    async playBattle(log: BattleLog) {
        const startEvent = log.events.find(e => e.type === 'start');
        if (!startEvent || startEvent.type !== 'start') return;

        // Setup initial state
        this.createTeam(startEvent.teamA, 'A');
        this.createTeam(startEvent.teamB, 'B');

        // Wait a bit
        await this.wait(1000);

        // Process events
        for (const event of log.events) {
            if (event.type === 'attack') {
                await this.animateAttack(event);
            } else if (event.type === 'faint') {
                await this.animateFaint(event);
            } else if (event.type === 'win') {
                await this.animateWin(event);
            }
        }

        // Wait and then callback
        await this.wait(2000);
        if (this.onComplete) this.onComplete();
    }

    createTeam(team: Team, side: 'A' | 'B') {
        const pets = team.filter(p => p !== null) as Pet[];
        const startX = side === 'A' ? 300 : 500;
        const direction = side === 'A' ? -1 : 1;
        const spacing = 80;

        pets.forEach((pet, i) => {
            const actualX = side === 'A' ? (350 - i * spacing) : (450 + i * spacing);
            const y = 300;

            // Map pet name to frame
            const petIndices: Record<string, number> = { 'Ant': 0, 'Fish': 1, 'Mosquito': 2, 'Cricket': 3, 'Beaver': 4 };
            const frame = petIndices[pet.name] ?? 0;

            const sprite = this.add.sprite(actualX, y, 'pets', frame).setScale(3);
            if (side === 'B') sprite.setFlipX(true); // Enemy faces left

            const text = this.add.text(actualX - 20, y + 50, `${pet.attack}/${pet.health}`, { 
                fontSize: '20px', 
                color: '#fff', 
                stroke: '#000', 
                strokeThickness: 4 
            });

            const nameText = this.add.text(actualX, y - 60, pet.name, {
                fontSize: '16px',
                color: '#fff',
                stroke: '#000',
                strokeThickness: 3
            }).setOrigin(0.5);

            if (side === 'A') {
                this.petsA.push(sprite);
                this.textsA.push(text);
                this.namesA.push(nameText);
            } else {
                this.petsB.push(sprite);
                this.textsB.push(text);
                this.namesB.push(nameText);
            }
        });
    }

    async animateAttack(event: { attacker: { team: 'A'|'B', index: number }, target: { team: 'A'|'B', index: number }, damage: number }) {
        const attackerSprite = event.attacker.team === 'A' ? this.petsA[event.attacker.index] : this.petsB[event.attacker.index];
        const targetSprite = event.target.team === 'A' ? this.petsA[event.target.index] : this.petsB[event.target.index];
        const targetText = event.target.team === 'A' ? this.textsA[event.target.index] : this.textsB[event.target.index];

        if (!attackerSprite || !targetSprite) return;

        // Lunge forward
        const originalX = attackerSprite.x;
        const forwardX = originalX + (event.attacker.team === 'A' ? 50 : -50);

        this.tweens.add({
            targets: attackerSprite,
            x: forwardX,
            duration: 100,
            yoyo: true,
            ease: 'Power1'
        });

        await this.wait(100); // Wait for impact
        
        sounds.play('attack');
        
        // Shake target
        this.tweens.add({
            targets: targetSprite,
            x: targetSprite.x + (Math.random() * 10 - 5),
            y: targetSprite.y + (Math.random() * 10 - 5),
            duration: 50,
            yoyo: true,
            repeat: 2
        });

        // Update text (hacky parsing)
        const currentText = targetText.text;
        const [atk, hp] = currentText.split('/').map(Number);
        const newHp = Math.max(0, hp - event.damage);
        targetText.setText(`${atk}/${newHp}`);

        await this.wait(400);
    }

    async animateFaint(event: { pet: { team: 'A'|'B', index: number } }) {
        const sprite = event.pet.team === 'A' ? this.petsA[event.pet.index] : this.petsB[event.pet.index];
        const text = event.pet.team === 'A' ? this.textsA[event.pet.index] : this.textsB[event.pet.index];
        const nameText = event.pet.team === 'A' ? this.namesA[event.pet.index] : this.namesB[event.pet.index];

        if (!sprite) return;

        sounds.play('faint');

        this.tweens.add({
            targets: [sprite, text, nameText],
            alpha: 0,
            y: sprite.y + 50,
            duration: 500
        });

        await this.wait(500);
    }

    async animateWin(event: { winner: 'A'|'B'|'draw' }) {
        const msg = event.winner === 'A' ? 'Victory!' : (event.winner === 'B' ? 'Defeat!' : 'Draw!');
        const color = event.winner === 'A' ? '#2ecc71' : (event.winner === 'B' ? '#e74c3c' : '#f1c40f');
        
        this.add.text(400, 150, msg, { 
            fontSize: '64px', 
            color: color, 
            stroke: '#000', 
            strokeThickness: 6 
        }).setOrigin(0.5);

        await this.wait(1000);
    }

    wait(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
