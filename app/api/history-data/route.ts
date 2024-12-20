import prisma from "@/lib/prisma";
import { Period, Timeframe } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const getHistoryDataSchema = z.object({
  timeframe: z.enum(["month", "year"]),
  month: z.coerce.number().min(0).max(11).default(0),
  year: z.coerce.number().min(2000).max(3000).default(new Date().getFullYear()),
});

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const queryParams = getHistoryDataSchema.safeParse({
    timeframe,
    year,
    month,
  });
  if (!queryParams.success) {
    return Response.json(queryParams.error.message, { status: 400 });
  }
  const data = await getHistoryData(user.id, queryParams.data.timeframe, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  });
}

export type getHistoryDataResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;

async function getHistoryData(
  userId: string,
  timeframe: Timeframe,
  period: Period
) {
  switch (timeframe) {
    case "year":
      return await getYearHistoryData(userId, period.year);
    case "month":
      return await getMonthHistoryData(userId, period.month, period.year);
  }
}

type HistoryData = {
  month: number;
  year: number;
  income: number;
  expense: number;
  day?: number;
};

async function getYearHistoryData(userId: string, year: number) {
  const result = await prisma.yearHistory.groupBy({
    by: ["month"],
    where: {
      userId,
      Year: year,
    },
    _sum: {
      income: true,
      expense: true,
    },
    orderBy: [
      {
        month: "asc",
      },
    ],
  });

  if (!result || result.length === 0) {
    return [];
  }
}
