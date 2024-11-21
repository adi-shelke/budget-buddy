import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  //getting the param type from the url
  const { searchParams } = new URL(request.url);
  const paramType = searchParams.get("type");

  //validating the param type
  const validator = z.enum(["income", "expense"]).nullable(); // either accepts income or expense or null
  const queryParams = validator.safeParse(paramType);

  if (!queryParams.success) {
    return Response.json(queryParams.error, { status: 400 });
  }

  //getting the categories of the user
  const type = queryParams.data;
  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }), // if type is not null, then add the type to the where clause to filter based on type
    },
    orderBy: {
      name: "asc",
    },
  });
  return Response.json(categories);
}
