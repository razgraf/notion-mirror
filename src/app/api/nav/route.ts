import { NextResponse } from 'next/server'
import { parseIndexHtml } from '@/lib/parser/index-html'

export async function GET() {
  const workspace = parseIndexHtml()
  return NextResponse.json(workspace)
}
