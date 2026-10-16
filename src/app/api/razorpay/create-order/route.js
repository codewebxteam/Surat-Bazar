import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, receipt, notes } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: "Invalid amount provided" }, { status: 400 });
    }

    const key_id = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith("rzp_live") 
      ? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID 
      : "rzp_live_ToZUxsu1jlHKm6");
    const key_secret = (process.env.RAZORPAY_KEY_SECRET && process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith("rzp_live")
      ? process.env.RAZORPAY_KEY_SECRET 
      : "KKps9eAYoR1G6Z0cIeUS2fBu");

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: "Razorpay credentials are not configured on server." },
        { status: 500 }
      );
    }

    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    // Amount must be in Indian paise (multiply by 100)
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    };

    const order = await instance.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: key_id,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
