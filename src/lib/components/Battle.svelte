<script lang="ts">
	import { game } from '$lib/game.svelte';
	import PhaserGame from './PhaserGame.svelte';
	import { BattleScene } from '$lib/phaser/BattleScene';
	import { simulateBattle } from '$lib/logic/engine';
	import type Phaser from 'phaser';

	let phaserGame: Phaser.Game | undefined;

	function onGameReady(g: Phaser.Game) {
		phaserGame = g;
		startBattle();
	}

	function startBattle() {
		if (!phaserGame) return;

		// Simulate battle
		const log = simulateBattle(game.team, game.enemyTeam);

		// Start scene with data
		// We need to make sure the scene is added or started.
		// If we passed BattleScene to PhaserGame, it should be there.
		// But PhaserGame initializes with the scene class, so it starts automatically?
		// If it starts automatically, we might miss the 'create' if we don't pass data immediately.
		// Better to start it manually or restart it.

		const scene = phaserGame.scene.getScene('BattleScene') as BattleScene;
		if (scene) {
			scene.scene.restart({
				battleLog: log,
				onComplete: () => game.battleOver(log.result)
			});
		} else {
			// If not running, start it
			phaserGame.scene.start('BattleScene', {
				battleLog: log,
				onComplete: () => game.battleOver(log.result)
			});
		}
	}
</script>

<div class="battle">
	<h2>Battle Phase</h2>
	<div class="game-wrapper">
		<PhaserGame sceneConfig={BattleScene} {onGameReady} />
	</div>
	<div class="controls">
		<button onclick={() => game.battleOver('win')}>Force Win (Debug)</button>
		<button onclick={() => game.battleOver('loss')}>Force Loss (Debug)</button>
	</div>
</div>

<style>
	.battle {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.game-wrapper {
		border: 4px solid #333;
		border-radius: 8px;
		overflow: hidden;
	}
</style>
