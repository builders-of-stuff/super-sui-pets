<script lang="ts">
	import { game } from '$lib/game.svelte';

	function onPlay() {
		game.startGame();
	}

	function onQuit() {
		// Just reload or something for now
		location.reload();
	}
</script>

<div class="menu">
	<h1>Super Sui Pets</h1>
	<div class="buttons">
		<button onclick={onPlay}>Play</button>
		<button disabled>Shop Preview (Coming Soon)</button>
		<button onclick={onQuit}>Quit</button>
	</div>
</div>

<style>
	.menu {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}

	h1 {
		font-size: 3rem;
		color: #333;
		text-shadow: 2px 2px #fff;
	}

	.buttons {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	button {
		padding: 1rem 2rem;
		font-size: 1.5rem;
		cursor: pointer;
		background: #fff;
		border: 4px solid #333;
		border-radius: 8px;
		font-family: inherit;
		transition: transform 0.1s;
	}

	button:hover:not(:disabled) {
		transform: scale(1.05);
		background: #f0f0f0;
	}

	button:active:not(:disabled) {
		transform: scale(0.95);
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
