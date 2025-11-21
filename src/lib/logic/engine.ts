import type { Pet, Team } from '$lib/types';

export type BattleEvent = 
    | { type: 'start', teamA: Team, teamB: Team }
    | { type: 'attack', attacker: { team: 'A' | 'B', index: number }, target: { team: 'A' | 'B', index: number }, damage: number }
    | { type: 'faint', pet: { team: 'A' | 'B', index: number } }
    | { type: 'win', winner: 'A' | 'B' | 'draw' };

export interface BattleLog {
    events: BattleEvent[];
    result: 'win' | 'loss' | 'tie';
}

// Clone team to avoid mutating game state directly during simulation
function cloneTeam(team: Team): Team {
    return team.map(p => p ? { ...p } : null);
}

export function simulateBattle(playerTeam: Team, enemyTeam: Team): BattleLog {
    const events: BattleEvent[] = [];
    
    // Working copies
    const teamA = cloneTeam(playerTeam);
    const teamB = cloneTeam(enemyTeam);

    // Filter out nulls for the actual battle logic (pets move to front)
    // But we need to track their original indices or just track the "active" pet.
    // In SAP, empty slots are ignored and pets slide forward.
    // Let's simplify: create arrays of just the pets.
    
    const petsA = teamA.filter(p => p !== null) as Pet[];
    const petsB = teamB.filter(p => p !== null) as Pet[];

    events.push({ type: 'start', teamA: cloneTeam(teamA), teamB: cloneTeam(teamB) });

    let idxA = 0;
    let idxB = 0;

    while (idxA < petsA.length && idxB < petsB.length) {
        const petA = petsA[idxA];
        const petB = petsB[idxB];

        // Attack
        // In SAP, they attack simultaneously.
        
        // Event: A attacks B
        events.push({ 
            type: 'attack', 
            attacker: { team: 'A', index: idxA }, 
            target: { team: 'B', index: idxB }, 
            damage: petA.attack 
        });

        // Event: B attacks A
        events.push({ 
            type: 'attack', 
            attacker: { team: 'B', index: idxB }, 
            target: { team: 'A', index: idxA }, 
            damage: petB.attack 
        });

        // Apply damage
        petB.health -= petA.attack;
        petA.health -= petB.attack;

        // Check faints
        let faintedA = false;
        let faintedB = false;

        if (petA.health <= 0) {
            events.push({ type: 'faint', pet: { team: 'A', index: idxA } });
            faintedA = true;
        }

        if (petB.health <= 0) {
            events.push({ type: 'faint', pet: { team: 'B', index: idxB } });
            faintedB = true;
        }

        // Advance indices if fainted
        if (faintedA) idxA++;
        if (faintedB) idxB++;
    }

    let result: 'win' | 'loss' | 'tie';
    if (idxA >= petsA.length && idxB >= petsB.length) {
        result = 'tie';
    } else if (idxA >= petsA.length) {
        result = 'loss'; // Player ran out of pets
    } else {
        result = 'win'; // Enemy ran out of pets
    }

    events.push({ type: 'win', winner: result === 'tie' ? 'draw' : (result === 'win' ? 'A' : 'B') });

    return { events, result };
}
