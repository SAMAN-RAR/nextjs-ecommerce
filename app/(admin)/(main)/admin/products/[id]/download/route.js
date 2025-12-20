import db from "@/db/db";
import { notFound } from "next/navigation";
import fs from "fs/promises";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    select: { filePath: true, name: true, fileSize: true },
  });

  if (product == null) return notFound();

  const file = await fs.readFile(product.filePath);
  const extension = product.filePath.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
      "Content-Length": product.fileSize.toString(),
    },
  });
};
