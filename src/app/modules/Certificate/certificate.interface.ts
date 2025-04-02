import { RequestStatus } from "@prisma/client";

export interface IUpdateCertificate {
  requestStatus: RequestStatus;
}
