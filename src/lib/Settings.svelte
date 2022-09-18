<script lang="ts">
  import { lines, stopIds } from '../store'

  let stopIdsString = '26130'
  let linesString = '60 63'

  function submit() {
    $stopIds = Array.from(stopIdsString.matchAll(/\d+/g)).map(
      (match) => match[0],
    )
    $lines = Array.from(linesString.matchAll(/d+/g)).map((match) => match[0])
  }
</script>

<div>
  <input bind:value={stopIdsString} />
  <input bind:value={linesString} />
  <button on:click={submit}>save</button>
</div>
