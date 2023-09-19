import { env } from '@/env.mjs';
import { prisma } from '@/server/db';
import  NodeGeocoder from 'node-geocoder'

import React from 'react'

async function Page() {
const options = {
  provider: "openstreetmap",
} as const;

const geocoder = NodeGeocoder(options);

const locations = await prisma.location.findMany({
    where: {
        latitude: null,
        longitude: null,
    }
});

const location = locations[1]

if(!location) return;

const {address, city, state, zip} = location

if(!address || ! city || !state || !zip ) return;

const locationRequest = `${address}, ${city}, ${state} ${zip}`
/*
for (const loc of locations) {
    const {address, city, state, zip} = loc

    if(!address || ! city || !state || !zip ) return;

    const locationRequest = `${address}, ${city}, ${state} ${zip}`

    const res = await geocoder.geocode(locationRequest)

    console.log(res)

    // wait 1 second between each request
    await new Promise(resolve => setTimeout(resolve, 1000)).then(async () => {
        console.log('waiting')

        if(!res[0]) return;
        const upate = await prisma.location.update({
            where:  {
                id: loc.id
            },
            data: {

                latitude: res[0].latitude,
                longitude: res[0].longitude,
            }

        })
        });





}*/
// const res = await geocoder.geocode(locationRequest)

// console.log(res)



console.log(locations)



  return (
    <div>Page</div>
  )
}

export default Page