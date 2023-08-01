import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string; sizeId: string };
  }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }
    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(size);
  } catch (e) {
    console.log("[SIZE_GET]", e);
    throw new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string; sizeId: string };
  }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    const body = await req.json();
    const { name, value } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }
    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findUnique({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
        storeId: params.storeId,
      },
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });
    console.log(size, "Sizes");
    return NextResponse.json(size);
  } catch (e) {
    console.log("[SIZE_PATCH]", e);
    throw new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string; sizeId: string };
  }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findUnique({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    console.log(params, "here");
    const size = await prismadb.size.delete({
      where: {
        storeId: params.storeId,
        id: params.sizeId,
      },
    });
    return NextResponse.json(size);
  } catch (e) {
    console.log("[SIZE_DELETE]", e);
    throw new NextResponse("Internal error", { status: 500 });
  }
}
