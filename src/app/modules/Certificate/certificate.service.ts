import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { searchFilter } from "../../../shared/searchFilter";
import { IUpdateCertificate } from "./certificate.interface";
import emailSender from "../Auth/emailSender";
import { htmlInfo } from "../../../shared/htmlInfo";
import { Certificate } from "@prisma/client";
import { Request } from "express";

const generatedNumbers = new Set<string>(); // Store generated numbers
const generateReferenceNumber = (): string => {
  let referenceNumber: string;

  do {
    referenceNumber = `Ref-${Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(8, "0")}`;
  } while (generatedNumbers.has(referenceNumber));

  generatedNumbers.add(referenceNumber);

  return referenceNumber;
};

const certificateInfo = async (certificateId: string) => {
  const result = await prisma.certificate.findFirst({
    where: {
      certificateId,
    },
  });

  return result;
};

const certificateVerify = async (payload: Certificate) => {
  const result = await prisma.certificate.findUnique({
    where: {
      referenceNumber: payload.referenceNumber,
      lastName: payload.lastName,
      email: payload.email,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Certificate not found");
  }

  return result;
};

const uploadFile = async (req: Request) => {
  const file = req.file as Express.Multer.File;
  const fileUrl = `https://api.mediconline.uk/uploads/${file.filename}`;
  return fileUrl;
};

// dashboard
const dashboard = async () => {
  const requestTypes = {
    allergyCertificateRequest: prisma.allergyCertificateRequest,
    chickenpoxCertificateRequest: prisma.chickenpoxCertificateRequest,
    disablityCertificateRequest: prisma.disablityCertificateRequest,
    emergencyCancellationRequest: prisma.emergencyCancellationRequest,
    sickNoteRequest: prisma.sickNoteRequest,
    workAdjustmentAssessmentRequest: prisma.workAdjustmentAssessmentRequest,
    employeeFitnessCertificate: prisma.employeeFitnessCertificate,
    eventActivityCancellationRequest: prisma.eventActivityCancellationRequest,
    fitForFlightRequest: prisma.fitForFlightRequest,
    fitToCruiseRequest: prisma.fitToCruiseRequest,
    gymCancellationCertificateRequest: prisma.gymCancellationCertificateRequest,
    injuryAccidentConfirmationRequest: prisma.injuryAccidentConfirmationRequest,
    medicalLetterBlueBadgeRequest: prisma.medicalLetterBlueBadgeRequest,
    mitigationLetter: prisma.mitigationLetter,
    sportsConsultationFitnessRequest: prisma.sportsConsultationFitnessRequest,
    studentSickLeaveRequest: prisma.studentSickLeaveRequest,
    travelMedicationLetterRequest: prisma.travelMedicationLetterRequest,
    vaccineCertificateRequest: prisma.vaccineCertificateRequest,
    visaCertificate: prisma.visaCertificate,
    bookConsultation: prisma.bookConsultation,
  };

  // Use Promise.all to execute all queries concurrently
  const [approvedCounts, pendingCounts, rejectedCounts, refundedCounts] =
    await Promise.all([
      Promise.all(
        Object.values(requestTypes).map((model: any) =>
          model.count({ where: { requestStatus: "APPROVED" } })
        )
      ),
      Promise.all(
        Object.values(requestTypes).map((model: any) =>
          model.count({ where: { requestStatus: "PENDING" } })
        )
      ),
      Promise.all(
        Object.values(requestTypes).map((model: any) =>
          model.count({ where: { requestStatus: "REJECTED" } })
        )
      ),
      Promise.all(
        Object.values(requestTypes).map((model: any) =>
          model.count({ where: { requestStatus: "REFUNDED" } })
        )
      ),
    ]);

  return {
    approved: Object.keys(requestTypes).reduce(
      (acc, key, index) => ({ ...acc, [key]: approvedCounts[index] }),
      {}
    ),
    pending: Object.keys(requestTypes).reduce(
      (acc, key, index) => ({ ...acc, [key]: pendingCounts[index] }),
      {}
    ),
    rejected: Object.keys(requestTypes).reduce(
      (acc, key, index) => ({ ...acc, [key]: rejectedCounts[index] }),
      {}
    ),
    refunded: Object.keys(requestTypes).reduce(
      (acc, key, index) => ({ ...acc, [key]: refundedCounts[index] }),
      {}
    ),
    all: {
      approved: approvedCounts.reduce((acc, count) => acc + count, 0),
      pending: pendingCounts.reduce((acc, count) => acc + count, 0),
      rejected: rejectedCounts.reduce((acc, count) => acc + count, 0),
      refunded: refundedCounts.reduce((acc, count) => acc + count, 0),
    },
  };
};
// Sick note request
const createSickNote = async (payload: any) => {
  const result = await prisma.sickNoteRequest.create({
    data: payload,
  });

  return result;
};

const getAllSickNotesFromDB = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.sickNoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.sickNoteRequest.count({
    where: searchFilters,
  });

  const totalPending = await prisma.sickNoteRequest.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.sickNoteRequest.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.sickNoteRequest.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.sickNoteRequest.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getSickNoteById = async (id: string) => {
  const result = await prisma.sickNoteRequest.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new Error("Sick note not found");
  }

  return result;
};

const updateSickNoteFromDB = async (
  payload: IUpdateCertificate,
  id: string
) => {
  const result = await prisma.sickNoteRequest.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }

  const subject = `Sick Note Request Certificate Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);

  return result;
};

// Employee Fitness
const createEmployeeFitnes = async (payload: any) => {
  const result = await prisma.employeeFitnessCertificate.create({
    data: payload,
  });

  return result;
};

const getAllEmployeeFitnessFromDB = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.employeeFitnessCertificate.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.employeeFitnessCertificate.count({
    where: searchFilters,
  });
  const totalPending = await prisma.employeeFitnessCertificate.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.employeeFitnessCertificate.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.employeeFitnessCertificate.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.employeeFitnessCertificate.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getEmployeeFitnessById = async (id: string) => {
  const result = await prisma.employeeFitnessCertificate.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new Error("Employee Fitness not found");
  }

  return result;
};

const updateEmployeeFitnessFromDB = async (
  payload: IUpdateCertificate,
  id: string
) => {
  const result = await prisma.employeeFitnessCertificate.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }

  const subject = `Employe Fitness Certificate Request Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);
  return result;
};

// Mitigation Letter
const createMitigationLetter = async (payload: any) => {
  const result = await prisma.mitigationLetter.create({
    data: payload,
  });

  return result;
};

const getAllMitigationLetters = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.mitigationLetter.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.mitigationLetter.count({
    where: searchFilters,
  });
  const totalPending = await prisma.mitigationLetter.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.mitigationLetter.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.mitigationLetter.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.mitigationLetter.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getMitigationLetterById = async (id: string) => {
  const result = await prisma.mitigationLetter.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new Error("Mitigation Letter not found");
  }

  return result;
};

const updateMitigationLetterFromDB = async (
  payload: IUpdateCertificate,
  id: string
) => {
  const result = await prisma.mitigationLetter.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }

  const subject = `Mitigation Letter Request Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);
  return result;
};

// Student Sick Leave
const createStudentSickLeave = async (payload: any) => {
  const result = await prisma.studentSickLeaveRequest.create({
    data: payload,
  });

  return result;
};

const getAllStudentSickLeaves = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.studentSickLeaveRequest.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.studentSickLeaveRequest.count({
    where: searchFilters,
  });
  const totalPending = await prisma.studentSickLeaveRequest.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.studentSickLeaveRequest.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.studentSickLeaveRequest.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.studentSickLeaveRequest.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getStudentSickLeaveById = async (id: string) => {
  const result = await prisma.studentSickLeaveRequest.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new Error("Student Sick Leave not found");
  }

  return result;
};

const updateStudentSickLeaveFromDB = async (
  payload: IUpdateCertificate,
  id: string
) => {
  const result = await prisma.studentSickLeaveRequest.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }

  const subject = `Student Sick Leave Request Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);
  return result;
};

// Fit For Flight
const createFitForFlight = async (payload: any) => {
  const result = await prisma.fitForFlightRequest.create({
    data: payload,
  });

  return result;
};

const getAllFitForFlights = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.fitForFlightRequest.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.fitForFlightRequest.count({
    where: searchFilters,
  });
  const totalPending = await prisma.fitForFlightRequest.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.fitForFlightRequest.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.fitForFlightRequest.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.fitForFlightRequest.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getFitForFightById = async (id: string) => {
  const result = await prisma.fitForFlightRequest.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new Error("Fit For Flight not found");
  }

  return result;
};

const updateFitForFight = async (payload: IUpdateCertificate, id: string) => {
  const result = await prisma.fitForFlightRequest.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }
  if (!result) {
    throw new Error("Fit For Flight not found");
  }

  const subject = `Fit For Fight Request Certificate Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);

  return result;
};

// Chicken Pox
const createChickenPox = async (payload: any) => {
  const result = await prisma.chickenpoxCertificateRequest.create({
    data: payload,
  });

  return result;
};

const getAllChickenPox = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.chickenpoxCertificateRequest.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.chickenpoxCertificateRequest.count({
    where: searchFilters,
  });

  const totalPending = await prisma.chickenpoxCertificateRequest.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.chickenpoxCertificateRequest.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.chickenpoxCertificateRequest.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.chickenpoxCertificateRequest.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getChickenPoxById = async (id: string) => {
  const result = await prisma.chickenpoxCertificateRequest.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new Error("Chicken Pox not found");
  }

  return result;
};

const updateChickenPox = async (payload: IUpdateCertificate, id: string) => {
  const result = await prisma.chickenpoxCertificateRequest.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }
  if (!result) {
    throw new Error("Chicken Pox not found");
  }

  const subject = `Chickenpox Request Certificate Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);

  return result;
};

// Visa Certificate
const createVisaCertificate = async (payload: any) => {
  const result = await prisma.visaCertificate.create({
    data: payload,
  });

  return result;
};

const getAllVisaCertificates = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.visaCertificate.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.visaCertificate.count({
    where: searchFilters,
  });
  const totalPending = await prisma.visaCertificate.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.visaCertificate.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.visaCertificate.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.visaCertificate.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getVisaCertificateById = async (id: string) => {
  const result = await prisma.visaCertificate.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Visa Certificate not found");
  }

  return result;
};

const updateVisaCertificate = async (
  payload: IUpdateCertificate,
  id: string
) => {
  const result = await prisma.visaCertificate.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Visa Certificate not found");
  }

  const subject = `Visa Medical Request Certificate Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);

  return result;
};

// Disability Certificate
const createDisabilityCertificate = async (payload: any) => {
  const result = await prisma.disablityCertificateRequest.create({
    data: payload,
  });

  return result;
};

const getAllDisabilityCertificates = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.disablityCertificateRequest.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.disablityCertificateRequest.count({
    where: searchFilters,
  });
  const totalPending = await prisma.disablityCertificateRequest.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.disablityCertificateRequest.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.disablityCertificateRequest.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.disablityCertificateRequest.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getDisabilityCertificateById = async (id: string) => {
  const result = await prisma.disablityCertificateRequest.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Disability Certificate not found"
    );
  }

  return result;
};

const updateDisabilityCertificate = async (
  payload: IUpdateCertificate,
  id: string
) => {
  const result = await prisma.disablityCertificateRequest.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Disability Certificate not found"
    );
  }
  const subject = `Disablity Request Certificate Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);

  return result;
};

// Vaccine Certificate
const createVaccineCertificate = async (payload: any) => {
  const result = await prisma.vaccineCertificateRequest.create({
    data: payload,
  });

  return result;
};

const getAllVaccineCertificates = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.vaccineCertificateRequest.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.vaccineCertificateRequest.count({
    where: searchFilters,
  });
  const totalPending = await prisma.vaccineCertificateRequest.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.vaccineCertificateRequest.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.vaccineCertificateRequest.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.vaccineCertificateRequest.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getVaccineCertificateById = async (id: string) => {
  const result = await prisma.vaccineCertificateRequest.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vaccine Certificate not found");
  }

  return result;
};

const updateVaccineCertificate = async (
  payload: IUpdateCertificate,
  id: string
) => {
  const result = await prisma.vaccineCertificateRequest.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }

  const subject = `Vaccine Request Certificate Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);

  return result;
};

// Travel Medication Letter
const createTravelMedicationLetter = async (payload: any) => {
  const result = await prisma.travelMedicationLetterRequest.create({
    data: payload,
  });

  return result;
};

const getAllTravelMedicationLetters = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.travelMedicationLetterRequest.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.travelMedicationLetterRequest.count({
    where: searchFilters,
  });
  const totalPending = await prisma.travelMedicationLetterRequest.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.travelMedicationLetterRequest.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.travelMedicationLetterRequest.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.travelMedicationLetterRequest.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getTravelMedicationLetterById = async (id: string) => {
  const result = await prisma.travelMedicationLetterRequest.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Travel Medication Letter not found"
    );
  }

  return result;
};

const updateTravelMedicationLetter = async (
  payload: IUpdateCertificate,
  id: string
) => {
  const result = await prisma.travelMedicationLetterRequest.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Travel Medication Letter not found"
    );
  }

  const subject = `Travel Medication Letter Request Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);

  return result;
};

// GYM Cancelation
const createGymCancellation = async (payload: any) => {
  const result = await prisma.gymCancellationCertificateRequest.create({
    data: payload,
  });

  return result;
};

const getAllGymCancellations = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.gymCancellationCertificateRequest.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.gymCancellationCertificateRequest.count({
    where: searchFilters,
  });
  const totalPending = await prisma.gymCancellationCertificateRequest.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.gymCancellationCertificateRequest.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.gymCancellationCertificateRequest.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.gymCancellationCertificateRequest.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getGymCancellationById = async (id: string) => {
  const result = await prisma.gymCancellationCertificateRequest.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student Sick Leave not found");
  }

  return result;
};

const updateGymCancellation = async (
  payload: IUpdateCertificate,
  id: string
) => {
  const result = await prisma.gymCancellationCertificateRequest.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Gym Cancellation Certificate not found"
    );
  }

  const subject = `Gym Cancelation Request Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);

  return result;
};

// Event Activity Cancellation
const createEventActivity = async (payload: any) => {
  const result = await prisma.eventActivityCancellationRequest.create({
    data: payload,
  });

  return result;
};

const getAllEventActivities = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.eventActivityCancellationRequest.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.eventActivityCancellationRequest.count({
    where: searchFilters,
  });

  const totalPending = await prisma.eventActivityCancellationRequest.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.eventActivityCancellationRequest.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.eventActivityCancellationRequest.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.eventActivityCancellationRequest.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getEventActivityById = async (id: string) => {
  const result = await prisma.eventActivityCancellationRequest.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Event Activity Cancellation Certificate not found"
    );
  }

  return result;
};

const updateEventActivity = async (payload: IUpdateCertificate, id: string) => {
  const result = await prisma.eventActivityCancellationRequest.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Event Activity Cancellation Certificate not found"
    );
  }

  const subject = `Event Activity Cancellation Request Certificate Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);

  return result;
};

// Injury Accident Confirmation
const createInjuryAccident = async (payload: any) => {
  const result = await prisma.injuryAccidentConfirmationRequest.create({
    data: payload,
  });

  return result;
};

const getAllInjuryAccidents = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.injuryAccidentConfirmationRequest.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.injuryAccidentConfirmationRequest.count({
    where: searchFilters,
  });
  const totalPending = await prisma.injuryAccidentConfirmationRequest.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.injuryAccidentConfirmationRequest.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.injuryAccidentConfirmationRequest.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.injuryAccidentConfirmationRequest.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getInjuryAccidentById = async (id: string) => {
  const result = await prisma.injuryAccidentConfirmationRequest.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Injury Accident Confirmation Certificate not found"
    );
  }

  return result;
};

const updateInjuryAccident = async (
  payload: IUpdateCertificate,
  id: string
) => {
  const result = await prisma.injuryAccidentConfirmationRequest.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Injury Accident Confirmation Certificate not found"
    );
  }

  const subject = `Injury Accident Confirmation Certificate Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);

  return result;
};

// Fit Cruise
const createFitCruise = async (payload: any) => {
  const result = await prisma.fitToCruiseRequest.create({
    data: payload,
  });

  return result;
};

const getAllFitCruises = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.fitToCruiseRequest.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.fitToCruiseRequest.count({
    where: searchFilters,
  });
  const totalPending = await prisma.fitToCruiseRequest.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.fitToCruiseRequest.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.fitToCruiseRequest.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.fitToCruiseRequest.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getFitCruiseById = async (id: string) => {
  const result = await prisma.fitToCruiseRequest.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fit Cruise not found");
  }

  return result;
};

const updateFitCruise = async (payload: IUpdateCertificate, id: string) => {
  const result = await prisma.fitToCruiseRequest.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }

  const subject = `Fit Cruise Request Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);
  return result;
};

// Medical Letter Blue Badge
const createMedicalBlueBadge = async (payload: any) => {
  const result = await prisma.medicalLetterBlueBadgeRequest.create({
    data: payload,
  });

  return result;
};

const getAllMedicalBlueBadges = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.medicalLetterBlueBadgeRequest.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.medicalLetterBlueBadgeRequest.count({
    where: searchFilters,
  });
  const totalPending = await prisma.medicalLetterBlueBadgeRequest.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.medicalLetterBlueBadgeRequest.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.medicalLetterBlueBadgeRequest.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.medicalLetterBlueBadgeRequest.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getMedicalBlueBadgeById = async (id: string) => {
  const result = await prisma.medicalLetterBlueBadgeRequest.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Medical Letter Blue Badge not found"
    );
  }

  return result;
};

const updateMedicalBlueBadge = async (
  payload: IUpdateCertificate,
  id: string
) => {
  const result = await prisma.medicalLetterBlueBadgeRequest.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }

  const subject = `Medical Blue Badge Request Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);

  return result;
};

// Emergency Cancellation
const createEmergencyCancellation = async (payload: any) => {
  const result = await prisma.emergencyCancellationRequest.create({
    data: payload,
  });

  return result;
};

const getAllEmergencyCancellations = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.emergencyCancellationRequest.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.emergencyCancellationRequest.count({
    where: searchFilters,
  });
  const totalPending = await prisma.emergencyCancellationRequest.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.emergencyCancellationRequest.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.emergencyCancellationRequest.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.emergencyCancellationRequest.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getEmergencyCancellationById = async (id: string) => {
  const result = await prisma.emergencyCancellationRequest.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Emergency Cancellation Certificate not found"
    );
  }

  return result;
};

const updateEmergencyCancellation = async (
  payload: IUpdateCertificate,
  id: string
) => {
  const result = await prisma.emergencyCancellationRequest.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }

  const subject = `Emergency Cancelation Request Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);

  return result;
};

// Allergy Certificate
const createAllergyCertificate = async (payload: any) => {
  const result = await prisma.allergyCertificateRequest.create({
    data: payload,
  });

  return result;
};

const getAllAllergyCertificates = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.allergyCertificateRequest.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.allergyCertificateRequest.count({
    where: searchFilters,
  });

  const totalPending = await prisma.allergyCertificateRequest.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.allergyCertificateRequest.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.allergyCertificateRequest.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.allergyCertificateRequest.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getAllergyCertificateById = async (id: string) => {
  const result = await prisma.allergyCertificateRequest.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Allergy Certificate not found");
  }

  return result;
};

const updateAllergyCertificate = async (
  payload: IUpdateCertificate,
  id: string
) => {
  const result = await prisma.allergyCertificateRequest.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }

  const subject = `Allergy Request Certificate Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);

  return result;
};

// Sports Consultation
const createSport = async (payload: any) => {
  const result = await prisma.sportsConsultationFitnessRequest.create({
    data: payload,
  });

  return result;
};

const getAllSports = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.sportsConsultationFitnessRequest.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.sportsConsultationFitnessRequest.count({
    where: searchFilters,
  });

  const totalPending = await prisma.sportsConsultationFitnessRequest.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.sportsConsultationFitnessRequest.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.sportsConsultationFitnessRequest.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.sportsConsultationFitnessRequest.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getSportById = async (id: string) => {
  const result = await prisma.sportsConsultationFitnessRequest.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Sport not found");
  }

  return result;
};

const updateSport = async (payload: IUpdateCertificate, id: string) => {
  const result = await prisma.sportsConsultationFitnessRequest.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }

  const subject = `Sport Request Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);

  return result;
};

// Work Adjustment Assessment
const createWorkAdjustment = async (payload: any) => {
  const result = await prisma.workAdjustmentAssessmentRequest.create({
    data: payload,
  });

  return result;
};

const getAllWorkAdjustments = async (req: any) => {
  const { page, limit, search } = req.query;

  const searchFilters = search ? searchFilter(search) : {};

  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const result = await prisma.workAdjustmentAssessmentRequest.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.workAdjustmentAssessmentRequest.count({
    where: searchFilters,
  });
  const totalPending = await prisma.workAdjustmentAssessmentRequest.count({
    where: {
      requestStatus: "PENDING",
    },
  });

  const totalRejected = await prisma.workAdjustmentAssessmentRequest.count({
    where: {
      requestStatus: "REJECTED",
    },
  });
  const totalRefund = await prisma.workAdjustmentAssessmentRequest.count({
    where: {
      requestStatus: "REFUNDED",
    },
  });
  const totalApproved = await prisma.workAdjustmentAssessmentRequest.count({
    where: {
      requestStatus: "APPROVED",
    },
  });

  return {
    totalCount,
    totalPending,
    totalRejected,
    totalRefund,
    totalApproved,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const getWorkAdjustmentById = async (id: string) => {
  const result = await prisma.workAdjustmentAssessmentRequest.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Work Adjustment not found");
  }

  return result;
};

const updateWorkAdjustment = async (
  payload: IUpdateCertificate,
  id: string
) => {
  const result = await prisma.workAdjustmentAssessmentRequest.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.requestStatus,
    },
  });

  const referenceNumber = generateReferenceNumber();
  if (payload.requestStatus === "APPROVED") {
    await prisma.certificate.create({
      data: {
        certificateId: result.id,
        firstName: result.firstName,
        lastName: result?.lastName ? result.lastName : result.firstName,
        email: result.email,
        referenceNumber,
      },
    });
  }

  const subject = `Work Adjustment Request Status Update: ${payload.requestStatus}`;
  const html = htmlInfo(
    result.firstName,
    result.lastName ? result.lastName : result.firstName,
    payload.requestStatus,
    referenceNumber
  );
  emailSender(subject, result.email, html);

  return result;
};

export const CertificateServices = {
  dashboard,
  certificateInfo,
  certificateVerify,
  // Sick Note
  createSickNote,
  getAllSickNotesFromDB,
  getSickNoteById,
  updateSickNoteFromDB,

  // Employee Fitness
  createEmployeeFitnes,
  getAllEmployeeFitnessFromDB,
  getEmployeeFitnessById,
  updateEmployeeFitnessFromDB,

  // Mitigation Letter
  createMitigationLetter,
  getAllMitigationLetters,
  getMitigationLetterById,
  updateMitigationLetterFromDB,

  // Student Sick Leave
  createStudentSickLeave,
  getAllStudentSickLeaves,
  getStudentSickLeaveById,
  updateStudentSickLeaveFromDB,

  // Fit For Flight
  createFitForFlight,
  getAllFitForFlights,
  getFitForFightById,
  updateFitForFight,

  // Chicken Pox
  createChickenPox,
  getAllChickenPox,
  getChickenPoxById,
  updateChickenPox,

  // Visa Certificate
  createVisaCertificate,
  getAllVisaCertificates,
  getVisaCertificateById,
  updateVisaCertificate,

  // Disability Certificate
  createDisabilityCertificate,
  getAllDisabilityCertificates,
  getDisabilityCertificateById,
  updateDisabilityCertificate,

  // Vision Certificate
  createVaccineCertificate,
  getAllVaccineCertificates,
  getVaccineCertificateById,
  updateVaccineCertificate,

  // Travel Medication Letter
  createTravelMedicationLetter,
  getAllTravelMedicationLetters,
  getTravelMedicationLetterById,
  updateTravelMedicationLetter,

  // Gym Cancellation
  createGymCancellation,
  getAllGymCancellations,
  getGymCancellationById,
  updateGymCancellation,

  // Event Activity
  createEventActivity,
  getAllEventActivities,
  getEventActivityById,
  updateEventActivity,

  // Injury Accident
  createInjuryAccident,
  getAllInjuryAccidents,
  getInjuryAccidentById,
  updateInjuryAccident,

  // Fit Cruise
  createFitCruise,
  getAllFitCruises,
  getFitCruiseById,
  updateFitCruise,

  // Medical Blue Badge
  createMedicalBlueBadge,
  getAllMedicalBlueBadges,
  getMedicalBlueBadgeById,
  updateMedicalBlueBadge,

  // Emergency Cancellation
  createEmergencyCancellation,
  getAllEmergencyCancellations,
  getEmergencyCancellationById,
  updateEmergencyCancellation,

  // Allergy Certificate
  createAllergyCertificate,
  getAllAllergyCertificates,
  getAllergyCertificateById,
  updateAllergyCertificate,

  // Sports Consultation
  createSport,
  getAllSports,
  getSportById,
  updateSport,

  // Work Adjustment Assessment
  createWorkAdjustment,
  getAllWorkAdjustments,
  getWorkAdjustmentById,
  updateWorkAdjustment,
  uploadFile,
};
