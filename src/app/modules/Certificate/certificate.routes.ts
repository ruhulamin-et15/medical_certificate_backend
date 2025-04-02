import express from "express";
import { CertificateConTrollers } from "./certificate.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();

router.get(
  "/dashboard",
  auth(UserRole.ADMIN),
  CertificateConTrollers.dashboard
);

router.post(
  "/file-upload/return-url",
  fileUploader.fileUpload,
  CertificateConTrollers.uploadFile
);

router.get(
  "/certificate/information/:certificateId",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getCertificateInfo
);
router.post("/verify-certificate", CertificateConTrollers.verifyCertificate);

// sick note
router.post(
  "/sick-note-for-work/create",
  CertificateConTrollers.createSickNote
);
router.get(
  "/sick-note-for-work",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllSickNotes
);
router.get("/sick-note-for-work/:id", CertificateConTrollers.getSickNoteById);
router.patch(
  "/sick-note-for-work/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateSickNote
);

// Employee Fitness
router.post(
  "/employee-fitness-to-work-certificate/create",
  CertificateConTrollers.createEmployeeFitness
);
router.get(
  "/employee-fitness-to-work-certificate",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllEmployeeFitness
);
router.get(
  "/employee-fitness-to-work-certificate/:id",
  CertificateConTrollers.getEmployeeFitnessById
);
router.patch(
  "/employee-fitness-to-work-certificate/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateEmployeeFitness
);

// MitigationLetter
router.post(
  "/student-mitigation-letter/create",
  CertificateConTrollers.createMitigationLetter
);
router.get(
  "/student-mitigation-letter",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllMitigationLetters
);
router.get(
  "/student-mitigation-letter/:id",
  CertificateConTrollers.getMitigationLetterById
);
router.patch(
  "/student-mitigation-letter/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateMitigationLetter
);

//Student Sick Leave
router.post(
  "/student-sick-leave-letter/create",
  CertificateConTrollers.createStudentSickLeave
);
router.get(
  "/student-sick-leave-letter",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllStudentSickLeaves
);
router.get(
  "/student-sick-leave-letter/:id",
  CertificateConTrollers.getStudentSickLeaveById
);
router.patch(
  "/student-sick-leave-letter/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateStudentSickLeave
);

// Fit For Flight
router.post(
  "/fit-for-flight-letter-for-expecting-mothers/create",
  CertificateConTrollers.createFitForFlight
);
router.get(
  "/fit-for-flight-letter-for-expecting-mothers",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllFitForFlights
);
router.get(
  "/fit-for-flight-letter-for-expecting-mothers/:id",
  CertificateConTrollers.getFitForFightById
);
router.patch(
  "/fit-for-flight-letter-for-expecting-mothers/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateFitForFight
);

// chicken pox
router.post(
  "/chickenpox-flight-clearance-medical/create",
  CertificateConTrollers.createChickenPox
);
router.get(
  "/chickenpox-flight-clearance-medical",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllChickenPox
);
router.get(
  "/chickenpox-flight-clearance-medical/:id",
  CertificateConTrollers.getChickenPoxById
);
router.patch(
  "/chickenpox-flight-clearance-medical/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateChickenPox
);

// visa certificate
router.post(
  "/visa-medicals-certificates-of-good-health/create",
  CertificateConTrollers.createVisaCertificate
);
router.get(
  "/visa-medicals-certificates-of-good-health",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllVisaCertificates
);
router.get(
  "/visa-medicals-certificates-of-good-health/:id",
  CertificateConTrollers.getVisaCertificateById
);
router.patch(
  "/visa-medicals-certificates-of-good-health/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateVisaCertificate
);

// Disability Certificate
router.post(
  "/disability-medical-certificate/create",
  CertificateConTrollers.createDisabilityCertificate
);
router.get(
  "/disability-medical-certificate",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllDisabilityCertificates
);
router.get(
  "/disability-medical-certificate/:id",
  CertificateConTrollers.getDisabilityCertificateById
);
router.patch(
  "/disability-medical-certificate/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateDisabilityCertificate
);

// vaccine
router.post(
  "/vaccine-exemption-certificate/create",
  CertificateConTrollers.createVaccineCertificate
);
router.get(
  "/vaccine-exemption-certificate",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllVaccineCertificates
);
router.get(
  "/vaccine-exemption-certificate/:id",
  CertificateConTrollers.getVaccineCertificateById
);
router.patch(
  "/vaccine-exemption-certificate/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateVaccineCertificate
);

//travel-medication-letter
router.post(
  "/travel-with-medication-letter/create",
  CertificateConTrollers.createTravelMedicationLetter
);
router.get(
  "/travel-with-medication-letter",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllTravelMedicationLetters
);
router.get(
  "/travel-with-medication-letter/:id",
  CertificateConTrollers.getTravelMedicationLetterById
);
router.patch(
  "/travel-with-medication-letter/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateTravelMedicationLetter
);

// Gym Cancellation
router.post(
  "/gym-and-health-club-cancellation-certificate/create",
  CertificateConTrollers.createGymCancellation
);
router.get(
  "/gym-and-health-club-cancellation-certificate",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllGymCancellations
);
router.get(
  "/gym-and-health-club-cancellation-certificate/:id",
  CertificateConTrollers.getGymCancellationById
);
router.patch(
  "/gym-and-health-club-cancellation-certificate/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateGymCancellation
);

//Event Activity
router.post(
  "/event-and-activity-cancellation-certificate/create",
  CertificateConTrollers.createEventActivity
);
router.get(
  "/event-and-activity-cancellation-certificate",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllEventActivities
);
router.get(
  "/event-and-activity-cancellation-certificate/:id",
  CertificateConTrollers.getEventActivityById
);
router.patch(
  "/event-and-activity-cancellation-certificate/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateEventActivity
);

// Injury Accident Confirmation
router.post(
  "/injury-and-accident-confirmation-certificates/create",
  CertificateConTrollers.createInjuryAccident
);
router.get(
  "/injury-and-accident-confirmation-certificates",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllInjuryAccidents
);
router.get(
  "/injury-and-accident-confirmation-certificates/:id",
  CertificateConTrollers.getInjuryAccidentById
);
router.patch(
  "/injury-and-accident-confirmation-certificates/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateInjuryAccident
);

// Fit Cruise
router.post(
  "/fit-to-cruise-medical-certificate/create",
  CertificateConTrollers.createFitCruise
);
router.get(
  "/fit-to-cruise-medical-certificate",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllFitCruises
);
router.get(
  "/fit-to-cruise-medical-certificate/:id",
  CertificateConTrollers.getFitCruiseById
);
router.patch(
  "/fit-to-cruise-medical-certificate/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateFitCruise
);

// Medical Letter Blue Badge
router.post(
  "/medical-letter-for-a-blue-badge/create",
  CertificateConTrollers.createMedicalBlueBadge
);
router.get(
  "/medical-letter-for-a-blue-badge",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllMedicalBlueBadges
);
router.get(
  "/medical-letter-for-a-blue-badge/:id",
  CertificateConTrollers.getMedicalBlueBadgeById
);
router.patch(
  "/medical-letter-for-a-blue-badge/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateMedicalBlueBadge
);

// Emergency Cancellation
router.post(
  "/emergency-cancellation-letter-for-travel/create",
  CertificateConTrollers.createEmergencyCancellation
);
router.get(
  "/emergency-cancellation-letter-for-travel",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllEmergencyCancellations
);
router.get(
  "/emergency-cancellation-letter-for-travel/:id",
  CertificateConTrollers.getEmergencyCancellationById
);
router.patch(
  "/emergency-cancellation-letter-for-travel/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateEmergencyCancellation
);

// Allergy Certificate
router.post(
  "/allergy-certificate/create",
  CertificateConTrollers.createAllergyCertificate
);
router.get(
  "/allergy-certificate",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllAllergyCertificates
);
router.get(
  "/allergy-certificate/:id",
  CertificateConTrollers.getAllergyCertificateById
);
router.patch(
  "/allergy-certificate/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateAllergyCertificate
);

// Sports Consultation
router.post(
  "/sports-consultation-and-fitness-certificate/create",
  CertificateConTrollers.createSport
);
router.get(
  "/sports-consultation-and-fitness-certificate",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllSports
);
router.get(
  "/sports-consultation-and-fitness-certificate/:id",
  CertificateConTrollers.getSportById
);
router.patch(
  "/sports-consultation-and-fitness-certificate/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateSport
);

// Work Adjustment Assessment
router.post(
  "/work-adjustment-assessment/create",
  CertificateConTrollers.createWorkAdjustment
);
router.get(
  "/work-adjustment-assessment",
  auth(UserRole.ADMIN),
  CertificateConTrollers.getAllWorkAdjustments
);
router.get(
  "/work-adjustment-assessment/:id",
  CertificateConTrollers.getWorkAdjustmentById
);
router.patch(
  "/work-adjustment-assessment/:id",
  auth(UserRole.ADMIN),
  CertificateConTrollers.updateWorkAdjustment
);

export const certificateRoutes = router;
