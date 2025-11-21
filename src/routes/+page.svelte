<script lang="ts">
	import { game } from '$lib/game.svelte';
	import MainMenu from '$lib/components/MainMenu.svelte';
	import Shop from '$lib/components/Shop.svelte';
	import Battle from '$lib/components/Battle.svelte';
</script>

<div class="container">
	{#if game.phase === 'MENU'}
		<MainMenu />
	{:else if game.phase === 'SHOP'}
		<Shop />
	{:else if game.phase === 'BATTLE'}
		<Battle />
	{:else if game.phase === 'GAMEOVER'}
		<div class="gameover">
			<h1>Game Over</h1>
			<p>{game.lives <= 0 ? 'You Lost!' : 'You Won!'}</p>
			<button onclick={() => (game.phase = 'MENU')}>Back to Menu</button>
		</div>
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background-color: #87ceeb; /* Sky blue */
		font-family: 'Courier New', Courier, monospace;
		background-image: url('/bg.png');
		background-size: cover;
		background-position: center;
	}

	.gameover {
		text-align: center;
		background: rgba(255, 255, 255, 0.9);
		padding: 2rem;
		border-radius: 1rem;
	}
</style>
