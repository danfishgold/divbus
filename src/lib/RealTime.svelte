<script lang="ts">
  import {
    fetchBuses,
    fetchBusInfo,
    type IncomingBus,
    type StopName,
  } from '../api'
  import { lines, stopIds, vehicleTypes } from '../store'

  let realTimeBuses: IncomingBus[] | null = null
  $: busGroups = realTimeBuses ? groupBuses(realTimeBuses) : null
  let stopNames: Record<string, StopName> = {}

  async function updateBuses() {
    try {
      realTimeBuses = null
      const liveData = await fetchBuses($stopIds, $lines)
      realTimeBuses = liveData.buses
      stopNames = liveData.stopNames

      const newVehicleNumbers = realTimeBuses
        .map((bus) => bus.vehicleNumber)
        .filter((vehicleNumber) => !(vehicleNumber in $vehicleTypes))
      const newVehicleTypes = await fetchBusInfo(newVehicleNumbers)
      $vehicleTypes = {
        ...$vehicleTypes,
        ...newVehicleTypes,
      }
    } catch (error) {
      console.error(error)
    }
  }

  function groupBuses(
    buses: IncomingBus[],
  ): Record<string, Record<string, IncomingBus[]>> {
    const oneLevelGroups = groupBy(buses, (bus) => bus.stopId)
    return Object.fromEntries(
      Object.entries(oneLevelGroups).map(([stopId, buses]) => [
        stopId,
        groupBy(buses, (bus) => bus.line),
      ]),
    )
  }

  function groupBy<T>(
    array: T[],
    key: (item: T) => string,
  ): Record<string, T[]> {
    const groups: Record<string, T[]> = {}
    for (const item of array) {
      const k = key(item)
      if (!groups[k]) {
        groups[k] = []
      }
      groups[k].push(item)
    }
    return groups
  }
</script>

<h2>אוטובוסים בקרוב</h2>

<button on:click={updateBuses}>יאללה</button>

{#if realTimeBuses}
  {#each Object.keys(busGroups) as stopId}
    <div>{stopId}</div>
  {/each}
{:else}
  טוען ו/או צריך ללחוץ על הכפתור
{/if}
