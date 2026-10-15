import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment verification details." },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Server error: RAZORPAY_KEY_SECRET is missing." },
        { status: 500 }
      );
    }

    // Razorpay HMAC SHA256 Signature Verification
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isMatch = expectedSignature === razorpay_signature;

    if (isMatch) {
      return NextResponse.json({
        success: true,
        message: "Payment successfully verified.",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature verification failed." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during verification." },
      { status: 500 }
    );
  }
}
