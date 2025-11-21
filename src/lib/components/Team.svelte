<script lang="ts">
	import { game } from '$lib/game.svelte';
	import PetCard from './PetCard.svelte';

	interface Props {
		onSlotClick?: (index: number) => void;
	}

	let { onSlotClick }: Props = $props();
</script>

<div class="team">
	{#each game.team as pet, i}
		<div class="slot">
			{#if pet}
				<PetCard
					{pet}
					onclick={() => onSlotClick?.(i)}
					oncontextmenu={(e) => {
						e.preventDefault();
						game.sellPet(i);
					}}
				/>
			{:else}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="empty-slot" onclick={() => onSlotClick?.(i)}></div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.team {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.1);
		border-radius: 1rem;
	}

	.slot {
		width: 80px;
		height: 80px;
	}

	.empty-slot {
		width: 100%;
		height: 100%;
		border: 4px dashed rgba(255, 255, 255, 0.5);
		border-radius: 12px;
		cursor: pointer;
	}

	.empty-slot:hover {
		background: rgba(255, 255, 255, 0.2);
	}
</style>
