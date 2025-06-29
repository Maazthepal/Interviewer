import { db } from '@/firebase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: 'Missing UID' }, { status: 400 });
    }

    // Get IP address from headers
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() ?? 'Unknown';

    // Fetch geo data silently via IP
    const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
    const geoData = await geoRes.json();

    const location = `${geoData.city ?? 'Unknown'}, ${geoData.regionName ?? ''}, ${geoData.country ?? ''}`;
    const isp = geoData.isp ?? 'Unknown';

    // Log to Firestore under user document
    await db.collection('users').doc(uid).set(
      {
        lastLoginIP: ip,
        lastLoginLocation: location,
        lastLoginISP: isp,
        lastLoginAt: new Date(),
      },
      { merge: true }
    );

    console.log('✅ IP & Location stored:', { uid, ip, location, isp });

    return NextResponse.json({ message: 'IP and location stored', ip, location, isp });
  } catch (error) {
    console.error('❌ Error logging IP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
