import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CertificateServices } from "./certificate.service";
import { Request, Response } from "express";

const dashboard = catchAsync(async (req: Request, res: Response) => {
  const result = await CertificateServices.dashboard();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All sick notes retrieved successfully",
    data: result,
  });
});

const getCertificateInfo = catchAsync(async (req, res) => {
  const { certificateId } = req.params;
  const result = await CertificateServices.certificateInfo(certificateId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Certificate information retrieved successfully",
    data: result,
  });
});

const verifyCertificate = catchAsync(async (req, res) => {
  const result = await CertificateServices.certificateVerify(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Certificate verified successfully",
    data: result,
  });
});

const uploadFile = catchAsync(async (req, res) => {
  const result = await CertificateServices.uploadFile(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "File uploaded successfully",
    data: result,
  });
});

// Sick Note
const createSickNote = catchAsync(async (req: Request, res: Response) => {
  const result = await CertificateServices.createSickNote(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sick note created successfully",
    data: result,
  });
});

const getAllSickNotes = catchAsync(async (req: Request, res: Response) => {
  const result = await CertificateServices.getAllSickNotesFromDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All sick notes retrieved successfully",
    data: result,
  });
});

const getSickNoteById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CertificateServices.getSickNoteById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sick note get successful",
    data: result,
  });
});

const updateSickNote = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CertificateServices.updateSickNoteFromDB(req.body, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sick note updated successfully",
    data: result,
  });
});

// Employee Fitness
const createEmployeeFitness = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CertificateServices.createEmployeeFitnes(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Employee Fitness created successfully",
      data: result,
    });
  }
);

const getAllEmployeeFitness = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllEmployeeFitnessFromDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All employe fitness request retrieved successfully",
    data: result,
  });
});

const getEmployeeFitnessById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await CertificateServices.getEmployeeFitnessById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: " Employee Fitness get successful",
      data: result,
    });
  }
);

const updateEmployeeFitness = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.updateEmployeeFitnessFromDB(
      req.body,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Employee Fitness updated successfully",
      data: result,
    });
  }
);

// Mitigation Letter
const createMitigationLetter = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CertificateServices.createMitigationLetter(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Mitigation Letter created successfully",
      data: result,
    });
  }
);

const getAllMitigationLetters = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllMitigationLetters(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Mitigation Letters retrieved successfully",
    data: result,
  });
});

const getMitigationLetterById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await CertificateServices.getMitigationLetterById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Mitigation Letter get successful",
      data: result,
    });
  }
);

const updateMitigationLetter = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.updateMitigationLetterFromDB(
      req.body,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Mitigation Letter update successful",
      data: result,
    });
  }
);

// Student Sick Leave
const createStudentSickLeave = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CertificateServices.createStudentSickLeave(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Student Sick Leave created successfully",
      data: result,
    });
  }
);

const getAllStudentSickLeaves = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllStudentSickLeaves(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Student Sick Leaves retrieved successfully",
    data: result,
  });
});

const getStudentSickLeaveById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await CertificateServices.getStudentSickLeaveById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Student Sick Leave get successful",
      data: result,
    });
  }
);

const updateStudentSickLeave = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.updateStudentSickLeaveFromDB(
      req.body,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Student Sick Leave updated successfully",
      data: result,
    });
  }
);

// Fit For Flight
const createFitForFlight = catchAsync(async (req: Request, res: Response) => {
  const result = await CertificateServices.createFitForFlight(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fit For Flight created successfully",
    data: result,
  });
});

const getAllFitForFlights = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllFitForFlights(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Fit For Flights retrieved successfully",
    data: result,
  });
});

const getFitForFightById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CertificateServices.getFitForFightById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fit For Flight get successful",
    data: result,
  });
});

const updateFitForFight = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CertificateServices.updateFitForFight(req.body, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fit For Flight updated successfully",
    data: result,
  });
});

// Chicken Pox
const createChickenPox = catchAsync(async (req: Request, res: Response) => {
  const result = await CertificateServices.createChickenPox(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Chicken Pox created successfully",
    data: result,
  });
});

const getAllChickenPox = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllChickenPox(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Chicken Pox retrieved successfully",
    data: result,
  });
});

const getChickenPoxById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CertificateServices.getChickenPoxById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Chicken Pox get successful",
    data: result,
  });
});

const updateChickenPox = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CertificateServices.updateChickenPox(req.body, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Chicken Pox updated successfully",
    data: result,
  });
});

// Visa Certificate
const createVisaCertificate = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CertificateServices.createVisaCertificate(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Visa Certificate created successfully",
      data: result,
    });
  }
);

const getAllVisaCertificates = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllVisaCertificates(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Visa Certificates retrieved successfully",
    data: result,
  });
});

const getVisaCertificateById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.getVisaCertificateById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Visa Certificate get successful",
      data: result,
    });
  }
);

const updateVisaCertificate = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await CertificateServices.updateVisaCertificate(
      req.body,
      id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Visa Certificate updated successfully",
      data: result,
    });
  }
);

// Disability Certificate
const createDisabilityCertificate = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CertificateServices.createDisabilityCertificate(
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Disability Certificate created successfully",
      data: result,
    });
  }
);

const getAllDisabilityCertificates = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllDisabilityCertificates(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Disability Certificates retrieved successfully",
    data: result,
  });
});

const getDisabilityCertificateById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.getDisabilityCertificateById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Disability Certificate get successful",
      data: result,
    });
  }
);

const updateDisabilityCertificate = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.updateDisabilityCertificate(
      req.body,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Disability Certificate updated successfully",
      data: result,
    });
  }
);

// Vaccine Certificate
const createVaccineCertificate = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CertificateServices.createVaccineCertificate(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Vaccine Certificate created successfully",
      data: result,
    });
  }
);

const getAllVaccineCertificates = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllVaccineCertificates(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Vaccine Certificates retrieved successfully",
    data: result,
  });
});

const getVaccineCertificateById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.getVaccineCertificateById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Vaccine Certificate get successful",
      data: result,
    });
  }
);

const updateVaccineCertificate = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.updateVaccineCertificate(
      req.body,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Vaccine Certificate updated successfully",
      data: result,
    });
  }
);

// Travel Medication Letter
const createTravelMedicationLetter = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CertificateServices.createTravelMedicationLetter(
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Travel Medication Letter created successfully",
      data: result,
    });
  }
);

const getAllTravelMedicationLetters = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllTravelMedicationLetters(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Travel Medication Letters retrieved successfully",
    data: result,
  });
});

const getTravelMedicationLetterById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.getTravelMedicationLetterById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Travel Medication Letter get successful",
      data: result,
    });
  }
);

const updateTravelMedicationLetter = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.updateTravelMedicationLetter(
      req.body,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Travel Medication Letter updated successfully",
      data: result,
    });
  }
);

// Gym Cancellation
const createGymCancellation = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CertificateServices.createGymCancellation(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Gym Cancellation created successfully",
      data: result,
    });
  }
);

const getAllGymCancellations = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllGymCancellations(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Gym Cancellations retrieved successfully",
    data: result,
  });
});

const getGymCancellationById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.getGymCancellationById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Gym Cancellation get successful",
      data: result,
    });
  }
);

const updateGymCancellation = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.updateGymCancellation(
      req.body,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Gym Cancellation updated successfully",
      data: result,
    });
  }
);

// Event Activity Cancellation
const createEventActivity = catchAsync(async (req, res) => {
  const result = await CertificateServices.createEventActivity(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event Activity Cancellation created successfully",
    data: result,
  });
});

const getAllEventActivities = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllEventActivities(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Event Activity Cancellations retrieved successfully",
    data: result,
  });
});

const getEventActivityById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CertificateServices.getEventActivityById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event Activity Cancellation get successful",
    data: result,
  });
});

const updateEventActivity = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CertificateServices.updateEventActivity(req.body, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event Activity Cancellation updated successfully",
    data: result,
  });
});

// Injury Accident Confirmation
const createInjuryAccident = catchAsync(async (req: Request, res: Response) => {
  const result = await CertificateServices.createInjuryAccident(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Injury Accident Confirmation created successfully",
    data: result,
  });
});

const getAllInjuryAccidents = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllInjuryAccidents(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Injury Accident Confirmations retrieved successfully",
    data: result,
  });
});

const getInjuryAccidentById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.getInjuryAccidentById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Injury Accident Confirmation get successful",
      data: result,
    });
  }
);

const updateInjuryAccident = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CertificateServices.updateInjuryAccident(req.body, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Injury Accident Confirmation updated successfully",
    data: result,
  });
});

// Fit Cruise
const createFitCruise = catchAsync(async (req: Request, res: Response) => {
  const result = await CertificateServices.createFitCruise(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fit Cruise created successfully",
    data: result,
  });
});

const getAllFitCruises = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllFitCruises(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Fit Cruises retrieved successfully",
    data: result,
  });
});

const getFitCruiseById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CertificateServices.getFitCruiseById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fit Cruise get successful",
    data: result,
  });
});

const updateFitCruise = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CertificateServices.updateFitCruise(req.body, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fit Cruise updated successfully",
    data: result,
  });
});

// Medical Letter Blue Badge
const createMedicalBlueBadge = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CertificateServices.createMedicalBlueBadge(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Medical Letter Blue Badge created successfully",
      data: result,
    });
  }
);

const getAllMedicalBlueBadges = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllMedicalBlueBadges(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Medical Letter Blue Badges retrieved successfully",
    data: result,
  });
});

const getMedicalBlueBadgeById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.getMedicalBlueBadgeById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Medical Letter Blue Badge get successful",
      data: result,
    });
  }
);

const updateMedicalBlueBadge = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.updateMedicalBlueBadge(
      req.body,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Medical Letter Blue Badge updated successfully",
      data: result,
    });
  }
);

// Emergency Cancellation
const createEmergencyCancellation = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CertificateServices.createEmergencyCancellation(
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Emergency Cancellation created successfully",
      data: result,
    });
  }
);

const getAllEmergencyCancellations = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllEmergencyCancellations(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Emergency Cancellations retrieved successfully",
    data: result,
  });
});

const getEmergencyCancellationById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.getEmergencyCancellationById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Emergency Cancellation get successful",
      data: result,
    });
  }
);

const updateEmergencyCancellation = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.updateEmergencyCancellation(
      req.body,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Emergency Cancellation updated successfully",
      data: result,
    });
  }
);

// Allergy Certificate
const createAllergyCertificate = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CertificateServices.createAllergyCertificate(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Allergy Certificate created successfully",
      data: result,
    });
  }
);

const getAllAllergyCertificates = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllAllergyCertificates(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Allergy Certificates retrieved successfully",
    data: result,
  });
});

const getAllergyCertificateById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.getAllergyCertificateById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Allergy Certificate get successful",
      data: result,
    });
  }
);

const updateAllergyCertificate = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.updateAllergyCertificate(
      req.body,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Allergy Certificate updated successfully",
      data: result,
    });
  }
);

// Sports Consultation
const createSport = catchAsync(async (req: Request, res: Response) => {
  const result = await CertificateServices.createSport(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sports Consultation created successfully",
    data: result,
  });
});

const getAllSports = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllSports(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Sports retrieved successfully",
    data: result,
  });
});

const getSportById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CertificateServices.getSportById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sports Consultation get successful",
    data: result,
  });
});

const updateSport = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CertificateServices.updateSport(req.body, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sports Consultation updated successfully",
    data: result,
  });
});

// Work Adjustment Assessment
const createWorkAdjustment = catchAsync(async (req: Request, res: Response) => {
  const result = await CertificateServices.createWorkAdjustment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Work Adjustment Assessment created successfully",
    data: result,
  });
});

const getAllWorkAdjustments = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllWorkAdjustments(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Work Adjustment Assessments retrieved successfully",
    data: result,
  });
});

const getWorkAdjustmentById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CertificateServices.getWorkAdjustmentById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Work Adjustment Assessment get successful",
      data: result,
    });
  }
);

const updateWorkAdjustment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CertificateServices.updateWorkAdjustment(req.body, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Work Adjustment Assessment updated successfully",
    data: result,
  });
});

export const CertificateConTrollers = {
  //
  dashboard,
  getCertificateInfo,
  verifyCertificate,
  // Sick Note
  createSickNote,
  getAllSickNotes,
  getSickNoteById,
  updateSickNote,

  // Employee Fitness
  createEmployeeFitness,
  getAllEmployeeFitness,
  getEmployeeFitnessById,
  updateEmployeeFitness,

  // Mitigation Letter
  createMitigationLetter,
  getAllMitigationLetters,
  getMitigationLetterById,
  updateMitigationLetter,

  // Student Sick Leave
  createStudentSickLeave,
  getAllStudentSickLeaves,
  getStudentSickLeaveById,
  updateStudentSickLeave,

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
