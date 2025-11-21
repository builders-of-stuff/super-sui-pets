<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Phaser from 'phaser';

	interface Props {
		sceneConfig?: Phaser.Types.Core.GameConfig['scene'];
		gameConfig?: Partial<Phaser.Types.Core.GameConfig>;
		onGameReady?: (game: Phaser.Game) => void;
	}

	let { sceneConfig, gameConfig, onGameReady }: Props = $props();

	let game: Phaser.Game;
	let gameContainer: HTMLDivElement;

	onMount(() => {
		if (typeof window !== 'undefined') {
			const config: Phaser.Types.Core.GameConfig = {
				type: Phaser.AUTO,
				width: 800,
				height: 600,
				parent: gameContainer,
				physics: {
					default: 'arcade',
					arcade: {
						gravity: { x: 0, y: 0 },
						debug: false
					}
				},
				scene: sceneConfig,
				backgroundColor: '#2d2d2d',
				pixelArt: true,
				...gameConfig
			};

			game = new Phaser.Game(config);
			onGameReady?.(game);
		}
	});

	onDestroy(() => {
		if (game) {
			game.destroy(true);
		}
	});
</script>

<div bind:this={gameContainer} id="phaser-game"></div>

<style>
	#phaser-game {
		width: 800px;
		height: 600px;
		margin: 0 auto;
		border: 4px solid #000;
	}
</style>
