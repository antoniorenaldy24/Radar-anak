import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Meta Cloud API Webhook Verification Token
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "radar_anak_kkn34_manggarai";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WhatsApp Webhook verified successfully.");
    return new Response(challenge, { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if webhook event contains Meta WhatsApp message
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (message) {
        const from = message.from; // Phone number of reporter
        const msgText = message.text?.body || "";
        const phoneNumberId = value?.metadata?.phone_number_id || process.env.WHATSAPP_PHONE_NUMBER_ID;

        console.log(`[WHATSAPP BOT] Message received from ${from}: "${msgText}"`);

        // Send Auto-Reply back to user's phone via Meta Graph API
        // Meta Test Numbers (+1 555) require template 'hello_world' or text payload for international +62 numbers
        const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        if (accessToken && phoneNumberId) {
          try {
            // Send Meta Approved 'hello_world' Template to bypass Error 130497 on +62 Indonesian numbers
            const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                to: from,
                type: "template",
                template: {
                  name: "hello_world",
                  language: {
                    code: "en_US",
                  },
                },
              }),
            });
            const resData = await res.json();
            console.log(`[WHATSAPP BOT] Meta response for ${from}:`, resData);
          } catch (replyErr) {
            console.error("Failed to send WhatsApp auto-reply:", replyErr);
          }
        }
      }
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" });
  } catch (e: any) {
    console.error("WhatsApp webhook error:", e);
    return NextResponse.json({ status: "ERROR", error: e.message }, { status: 500 });
  }
}
