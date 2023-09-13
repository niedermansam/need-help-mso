import { prisma } from '@/server/db'
import  { type NextRequest, NextResponse } from 'next/server'
 
export async function GET(request: NextRequest) {


    // const cat = request.nextUrl.searchParams.get('cat')

    const orgs = await prisma.organization.findMany()

    return NextResponse.json(orgs)
}