import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Use the CLOUDINARY_URL from env if available
    if (process.env.CLOUDINARY_URL) {
      cloudinary.config({
        cloudinary_url: process.env.CLOUDINARY_URL
      });
    }

    const params = {
      timestamp: timestamp,
      folder: 'camera-web',
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      cloudinary.config().api_secret as string
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloud_name: cloudinary.config().cloud_name,
      api_key: cloudinary.config().api_key,
      folder: 'camera-web',
    });
  } catch (error) {
    console.error('Cloudinary signing error:', error);
    return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}
