import prisma from "../../../shared/prisma";
import { searchFilter } from "../../../shared/searchFilter";

const bookConsultationIntoDB = async (payload: any) => {
  const result = await prisma.bookConsultation.create({
    data: payload,
  });

  return result;
};

const getAllBookingConsultationFromDB = async (req: any) => {
  const { page = 1, limit = 10, search } = req.query;

  const skip = (page - 1) * limit;

  const searchFilters = searchFilter(search);
  const result = await prisma.bookConsultation.findMany({
    orderBy: { updatedAt: "desc" },
    where: searchFilters as any,
    skip: skip,
    take: parseInt(limit),
  });

  const totalCount = await prisma.employeeFitnessCertificate.count({
    where: searchFilters as any,
  });

  return {
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: parseInt(page),
    result,
  };
};

const getBookingConsultationFromDB = async (id: string) => {
  const result = await prisma.bookConsultation.findUnique({
    where: {
      id: id,
    },
  });

  return result;
};

export const bookConsultationServices = {
  bookConsultationIntoDB,
  getAllBookingConsultationFromDB,
  getBookingConsultationFromDB,
};
