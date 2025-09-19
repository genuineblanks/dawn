// Google Apps Script proxy for Vercel Edge Runtime
export const config = {
  runtime: 'edge',
};

// Your Google Apps Script deployment URL with CORS headers
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzoz9utEA21JTwZJAQMcpW9igviplamBuwaCINx820e-KCibJHoR6-grr5PegMJI5MkNw/exec';

export default async function handler(request) {
  console.log(`📨 ${request.method} request to /api/techpack-proxy`);

  // CORS headers - allow all headers that Shopify sends
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Signature, X-Timestamp, X-Form-Version, Authorization',
  };

  // Handle OPTIONS for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Handle GET requests quickly
  if (request.method === 'GET') {
    return new Response(
      JSON.stringify({
        error: 'Method not allowed',
        message: 'This endpoint only accepts POST requests with techpack data',
        allowedMethods: ['POST'],
        receivedMethod: request.method
      }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  // Handle POST requests
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    console.log('📨 Processing techpack submission...');

    // Parse the request body
    const submissionData = await request.json();

    console.log('📋 Submission data received:', {
      submissionId: submissionData.submission_id,
      requestType: submissionData.request_type,
      filesCount: submissionData.files?.length || 0,
      hasClientData: !!submissionData.client_data
    });

    console.log('🚀 Forwarding to Google Apps Script...');

    // Forward to Google Apps Script
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData)
    });

    console.log(`📡 Google Apps Script response: ${response.status}`);

    if (!response.ok) {
      console.error('❌ Google Apps Script failed:', response.status);
      throw new Error(`Google Apps Script failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Successfully processed by Google Apps Script');

    // Return the Google Apps Script response
    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Techpack proxy error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to process techpack submission',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}