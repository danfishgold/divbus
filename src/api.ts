export type IncomingBus = {
  stopId: string
  line: string
  vehicleNumber: string
  dateUpdated: Date
  eta: Date
}

export type StopName = { HE: string; AR: string; EN: string }

export type CurlbusResponse = {
  stops_info: Record<string, { name: StopName }>
  visits: Record<
    string,
    { timestamp: string; eta: string; vehicle_ref: string; line_name: string }[]
  >
}

export type VehicleType = 'electric' | 'notElectric' | 'unknown'

export async function fetchStopInfo(stopId: string): Promise<StopName> {
  const response = await fetch(`https://curlbus.app/${stopId}`)
  const { stops_info } = (await response.json()) as CurlbusResponse
  return stops_info[stopId].name
}

export async function fetchBuses(
  stopIds: string[],
  lines: string[],
): Promise<{ buses: IncomingBus[]; stopNames: Record<string, StopName> }> {
  const response = await fetch(
    `/.netlify/functions/curlbus-proxy?stops=${stopIds.join('+')}`,
  )
  console.log({ response })
  console.log({ text: await response.text() })
  const { visits, stops_info } = (await response.json()) as CurlbusResponse
  const buses = Object.entries(visits).flatMap(([stopId, visitArray]) => {
    return visitArray
      .filter((visit) => lines.includes(visit.line_name))
      .map((visit) => ({
        stopId,
        line: visit.line_name,
        vehicleNumber: visit.vehicle_ref,
        dateUpdated: new Date(visit.timestamp),
        eta: new Date(visit.eta),
      }))
  })
  const stopNames = Object.fromEntries(
    Object.entries(stops_info).map(
      ([stopId, { name }]) => [stopId, name] as [string, StopName],
    ),
  )

  return { buses, stopNames }
}

export async function fetchBusInfo(
  buses: string[],
): Promise<Record<string, VehicleType>> {
  const response = await fetch(
    'https://data.gov.il/api/3/action/datastore_search',
    {
      method: 'POST',
      body: JSON.stringify({
        resource_id: 'cd3acc5c-03c3-4c89-9c54-d40f93c0d790',
        filters: { mispar_rechev: buses },
      }),
    },
  )
  const {
    result: { records },
  } = await response.json()
  return Object.fromEntries(
    records.map((record) => [record.mispar_rechev, 'unknown']),
  )
}
