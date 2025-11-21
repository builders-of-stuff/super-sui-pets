<script lang="ts">
	import { game } from '$lib/game.svelte';
	import PetCard from './PetCard.svelte';
	import Team from './Team.svelte';
	import { sounds } from '$lib/sounds';

	let selectedShopIdx = $state<number | null>(null);

	function handleShopClick(idx: number) {
		if (selectedShopIdx === idx) {
			selectedShopIdx = null; // Deselect
		} else {
			selectedShopIdx = idx;
		}
	}

	function handleTeamClick(teamIdx: number) {
		if (selectedShopIdx !== null) {
			// Try to buy
			const prevGold = game.gold;
			game.buyPet(selectedShopIdx, teamIdx);
			if (game.gold < prevGold) {
				sounds.play('buy');
			}
			selectedShopIdx = null;
		}
	}

	function handleFreeze(e: MouseEvent, idx: number) {
		e.preventDefault();
		game.freezeShopItem(idx);
		sounds.play('freeze');
	}

	function handleRoll() {
		if (game.gold >= 1) {
			game.rollShop();
			sounds.play('roll');
		}
	}
</script>

<div class="shop-container">
	<header>
		<div class="stat">❤️ {game.lives}</div>
		<div class="stat">🏆 {game.wins}</div>
		<div class="stat">🪙 {game.gold}</div>
		<div class="stat">Turn {game.turn}</div>
	</header>

	<div class="shop-area">
		{#each game.shop as item, i}
			<div class="shop-slot" class:selected={selectedShopIdx === i}>
				{#if item.type === 'pet'}
					<PetCard
						pet={item.item as any}
						isShopItem={true}
						frozen={item.frozen}
						cost={item.cost}
						onclick={() => handleShopClick(i)}
						oncontextmenu={(e) => handleFreeze(e, i)}
					/>
				{/if}
			</div>
		{/each}
	</div>

	<div class="controls">
		<button class="roll-btn" onclick={handleRoll} disabled={game.gold < 1}>
			Roll (1 🪙)
		</button>
		<button class="end-btn" onclick={() => game.endTurn()}> End Turn </button>
	</div>

	<div class="team-area">
		<h3>Your Team</h3>
		<Team onSlotClick={handleTeamClick} />
		<p class="hint">
			Click shop pet -> Click empty slot to buy. Right click to freeze/sell.
		</p>
	</div>
</div>

<style>
	.shop-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		width: 100%;
		max-width: 800px;
		padding: 2rem;
	}

	header {
		display: flex;
		gap: 2rem;
		font-size: 1.5rem;
		font-weight: bold;
		color: #333;
		background: rgba(255, 255, 255, 0.8);
		padding: 0.5rem 2rem;
		border-radius: 2rem;
	}

	.shop-area {
		display: flex;
		gap: 1rem;
		min-height: 100px;
	}

	.shop-slot {
		transition: transform 0.2s;
	}

	.shop-slot.selected {
		transform: translateY(-10px);
		filter: drop-shadow(0 0 10px gold);
	}

	.controls {
		display: flex;
		gap: 1rem;
	}

	button {
		padding: 0.8rem 1.5rem;
		font-size: 1.2rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-family: inherit;
		font-weight: bold;
		transition: transform 0.1s;
	}

	button:active {
		transform: scale(0.95);
	}

	.roll-btn {
		background: #f1c40f;
		color: #333;
		border-bottom: 4px solid #f39c12;
	}

	.end-btn {
		background: #e74c3c;
		color: white;
		border-bottom: 4px solid #c0392b;
	}

	.team-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.hint {
		font-size: 0.9rem;
		color: #666;
		background: rgba(255, 255, 255, 0.5);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
	}
</style>
