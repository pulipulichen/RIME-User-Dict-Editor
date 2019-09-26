<script>
	import { count } from './stores.js';
	import Incrementer from './Incrementer.svelte';
	import Decrementer from './Decrementer.svelte';
	import Resetter from './Resetter.svelte';

	let count_value;

	const unsubscribe = count.subscribe(value => {
		count_value = value;
	});
  
  import './i18n.js'

  
// locale is en
import { _ } from 'svelte-i18n'
</script>

<h1>The count is {count_value}</h1>

<Incrementer/>
<Decrementer/>
<Resetter/>

<div>
  {$_('greeting.message', { name: 'John' })}
  <!-- Hello John, how are you? -->

  {$_('photos', { n: 0 })}
  <!-- You have no photos. -->

  {$_('photos', { n: 12 })}
  <!-- You have 12 photos. -->
</div>