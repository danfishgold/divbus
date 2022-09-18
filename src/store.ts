import { writable } from 'svelte/store'
import type { VehicleType } from './api'

type Locale = 'hebrew'

export const stopIds = writable<string[]>([])
export const lines = writable<string[]>([])

export const vehicleTypes = writable<Record<string, VehicleType>>({})

export const locale = writable<Locale>('hebrew')
