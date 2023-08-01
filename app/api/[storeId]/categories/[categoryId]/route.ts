import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string; categoryId: string };
  }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }
    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(category);
  } catch (e) {
    console.log("[CATEGORY_GET]", e);
    throw new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string; categoryId: string };
  }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    const body = await req.json();
    const { name } = body;


    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
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

    const category = await prismadb.category.updateMany({
      where: {
        storeId: params.storeId,
        id: params.categoryId,
      },
      data: {
        name,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(category);
  } catch (e) {
    console.log("[CATEGORY_PATCH]", e);
    throw new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string; categoryId: string };
  }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
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

    const category = await prismadb.category.delete({
      where: {
        storeId: params.storeId,
        id: params.categoryId,
      },
    });
    return NextResponse.json(category);
  } catch (e) {
    console.log("[CATEGORY_DELETE]", e);
    throw new NextResponse("Internal error", { status: 500 });
  }
}
