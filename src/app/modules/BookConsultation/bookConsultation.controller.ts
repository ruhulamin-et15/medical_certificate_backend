import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { bookConsultationServices } from "./bookConsultation.service";
import sendResponse from "../../../shared/sendResponse";

const bookConsultation = catchAsync(async (req: Request, res: Response) => {
  const result = await bookConsultationServices.bookConsultationIntoDB(
    req.body
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Consultation booking successful",
    data: result,
  });
});

const getAllBookingConsultations = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await bookConsultationServices.getAllBookingConsultationFromDB(req);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booking request retrieved successfully",
      data: result,
    });
  }
);

const getBookingConsultation = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await bookConsultationServices.getBookingConsultationFromDB(
      id
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booking request retrieved successfully",
      data: result,
    });
  }
);

export const bookConsultationController = {
  bookConsultation,
  getAllBookingConsultations,
  getBookingConsultation,
};
