import { RequestStatus } from "@prisma/client";

export const requestStatus = (search: RequestStatus) => {
  if (!search) {
    return undefined;
  }

  const searchConditions = [];
  if (search) {
    searchConditions.push({
      requestStatus: { contains: search, mode: "insensitive" },
    });
  }

  return {
    OR: searchConditions,
  };
};
