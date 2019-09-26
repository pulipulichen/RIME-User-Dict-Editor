<script>
	import { count } from './stores.js';

	function reset() {
		count.set(0);
	}
  
  import { _ } from 'svelte-i18n'
</script>

<button on:click={reset}>
	reset
</button>