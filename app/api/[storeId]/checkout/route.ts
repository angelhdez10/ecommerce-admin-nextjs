import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  console.log("options");
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { productsIds } = await req.json();
    console.log(productsIds);
    if (!productsIds || productsIds?.length === 0) {
      return new NextResponse("Products ids are required", { status: 400 });
    }
    const products = await prismadb.product?.findMany({
      where: {
        id: {
          in: productsIds,
        },
      },
    });
    console.log(products, "producs");

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((product) => {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price.toNumber() * 100,
        },
      });
    });
    console.log(line_items);

    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        orderItems: {
          create: [
            ...productsIds.map((productId: string) => ({
              product: {
                connect: {
                  id: productId,
                },
              },
            })),
          ],
        },
      },
    });
    console.log(order, "order");

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      metadata: {
        orderId: order.id,
      },
    });
    console.log(session);
    return NextResponse.json({ url: session.url }, { headers: corsHeaders });
  } catch (e) {
    console.log("[POST_CHECKOUT]", e);
    throw new NextResponse("Internal error", { status: 500 });
  }
}
