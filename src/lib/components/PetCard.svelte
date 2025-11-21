<script lang="ts">
	import type { Pet, ShopItem } from '$lib/types';

	interface Props {
		pet: Pet;
		isShopItem?: boolean;
		frozen?: boolean;
		cost?: number;
		onclick?: () => void;
		oncontextmenu?: (e: MouseEvent) => void;
	}

	let {
		pet,
		isShopItem = false,
		frozen = false,
		cost = 3,
		onclick,
		oncontextmenu
	}: Props = $props();

	// Map pet names to sprite indices (assuming row 0 of pets.png)
	const petIndices: Record<string, number> = {
		Ant: 0,
		Fish: 1,
		Mosquito: 2,
		Cricket: 3,
		Beaver: 4
	};

	const spriteIndex = petIndices[pet.name] ?? 0;

	// Placeholder for new functions/variables if they were fully provided.
	// For now, we'll adapt the existing props to the new structure.
	const handleClick = onclick;
	const handleRightClick = oncontextmenu;
	const frameX = spriteIndex; // Assuming frameX is equivalent to spriteIndex for now.
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="pet-card"
	class:shop-item={isShopItem}
	class:frozen
	oncontextmenu={handleRightClick}
	onclick={handleClick}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
>
	<div class="name">{pet.name}</div>
	<div class="sprite" style="background-position: -{frameX * 64}px 0;"></div>
	<div class="stats health">{pet.health}</div>

	{#if isShopItem}
		<div class="cost">
			<span class="coin">🪙</span>
			{cost}
		</div>
	{/if}

	{#if frozen}
		<div class="frozen-overlay">❄️</div>
	{/if}
</div>

<style>
	.pet-card {
		width: 80px;
		height: 80px;
		background: #fff;
		border: 4px solid #ccc;
		border-radius: 12px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: transform 0.1s;
		box-shadow: 0 4px 0 #ccc;
	}

	.pet-card:hover {
		transform: translateY(-2px);
	}

	.pet-card:active {
		transform: translateY(2px);
		box-shadow: 0 0 0 #ccc;
	}

	.shop-item {
		background: #fdf6e3;
		border-color: #d3c6aa;
		box-shadow: 0 4px 0 #d3c6aa;
	}

	.frozen {
		border-color: #87ceeb;
		background: #e0f7fa;
		box-shadow: 0 4px 0 #87ceeb;
	}

	.sprite {
		width: 64px; /* Display size */
		height: 64px;
		background-image: url('/pets_fixed.png');
		background-size: auto 64px; /* Scale sprite sheet to 64px height */
		background-repeat: no-repeat;
		image-rendering: pixelated;
	}

	.stats {
		position: absolute;
		bottom: -10px;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		color: white;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		border: 2px solid rgba(0, 0, 0, 0.2);
		z-index: 2;
	}

	.attack {
		left: -5px;
		background: #e74c3c;
	}

	.health {
		right: -5px;
		background: #2ecc71;
	}

	.cost {
		position: absolute;
		top: -10px;
		right: -10px;
		background: #f1c40f;
		color: #333;
		padding: 2px 6px;
		border-radius: 10px;
		font-size: 12px;
		font-weight: bold;
		border: 2px solid #f39c12;
		z-index: 2;
	}

	.frozen-overlay {
		position: absolute;
		top: -10px;
		left: -10px;
		font-size: 20px;
		z-index: 2;
	}
</style>
