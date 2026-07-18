// /v1/dlc/sets/search
import { type GourmetApiResponse, handleApiCall } from '@/parcels/api/handleApiCall.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import type { components as c } from '@/schema/api.d.ts';
import umoriClient from '@/schema/umoriClient.ts';

export type DataIssueReport = c['schemas']['ReducedDataIssueReport'];
export type DataIssueReportPaginated = c['schemas']['SimplePage-ReducedDataIssueReport'];
export type PublicDataIssueReport = c['schemas']['PublicDataIssueReport'];
export type PublicDataIssueReportPaginated = c['schemas']['SimplePage-PublicDataIssueReport'];

// /v1/direports
export async function getOpenReports(
  tcg: Tcg,
  subjectType: DataIssueReport['subjectType'],
  subjectId: string,
  abort?: AbortController,
): Promise<GourmetApiResponse<DataIssueReportPaginated>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/direports`, {
      params: {
        query: {
          tcg: tcg,
          type: subjectType,
          subjectId: subjectId,
        },
      },
      signal: abort?.signal,
    });
  });
}

// /v1/users/{id}/direports
export async function getOpenUserReports(
  userId: string,
  tcg: Tcg,
  subjectType: DataIssueReport['subjectType'],
  subjectId: string,
  abort?: AbortController,
): Promise<GourmetApiResponse<PublicDataIssueReportPaginated>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/{userId}/direports`, {
      params: {
        path: {
          userId: userId,
        },
        query: {
          tcg: tcg,
          type: subjectType,
          subjectId: subjectId,
        },
      },
      signal: abort?.signal,
    });
  });
}

export type CreateUserReportRequest = {
  note?: string;
  severity?: DataIssueReport['severity'];
  subject?: string;
};

// /v1/users/{id}/direports
export async function createUserReport(
  userId: string,
  tcg: Tcg,
  subjectType: DataIssueReport['subjectType'],
  subjectId: string,
  url: string,
  req: CreateUserReportRequest,
  abort?: AbortController,
): Promise<GourmetApiResponse<DataIssueReport>> {
  const { note, severity, subject } = req;

  return handleApiCall(async () => {
    return await umoriClient.POST(`/v1/{userId}/direports`, {
      params: {
        path: {
          userId: userId,
        },
      },
      body: {
        gameType: tcg,
        subjectType: subjectType,
        subjectId: subjectId,
        url: url,
        note: note,
        severity: severity,
        subject: subject,
      },
      signal: abort?.signal,
    });
  });
}
