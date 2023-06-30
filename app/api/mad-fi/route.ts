import { NextRequest, NextResponse } from 'next/server';

const headers = {
  'x-api-key': process.env.MADFI_KEY || ''
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json()
    const { profileId } = body
    const uri = `https://api.madfinance.xyz/suggested_follows?profileId=${profileId}`
    const response = await fetch(uri, {
      headers
    })
    const json = await response.json()
    return NextResponse.json({ data: json.suggestedFollows });
  } catch (err) {
    console.log('error: ', err)
    return NextResponse.json({ error: err });
  }
}