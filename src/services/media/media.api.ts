import {RequestBuilder} from "~/api/request-builder";
import {
    type GetFileResponse,
    getFileResponseSchema,
    type RetrieveUrlResponse,
    retrieveUrlResponseSchema
} from "~/services/media/dto/get-media.dto";
import {
    type PreUploadFileBodySchema,
    preUploadFileBodySchema,
    type PreUploadFileDto,
    preUploadFileResponseSchema,
    type PreUploadFileResponseSchema
} from "~/services/media/dto/upload-media.dto";

export const useMediaApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`;

    async function getSignedUrl(endPoint: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(endPoint)
            .withResponse<RetrieveUrlResponse>(retrieveUrlResponseSchema)
            .execute();
    }

    async function preUploadFile(requestDto: PreUploadFileDto) {
        return new RequestBuilder(BASE_API_URL)
            .post(requestDto.endPoint)
            .withBody<PreUploadFileBodySchema>(preUploadFileBodySchema)
            .withResponse<PreUploadFileResponseSchema>(preUploadFileResponseSchema)
            .execute({
                body: {
                    filename: requestDto.filename,
                    type: requestDto.type
                }
            });
    }

    async function uploadFile(file: File, signedUrl: string) {
        try {
            // Convert file to ArrayBuffer and prepare for upload to S3
            const contentType = file.type || 'application/octet-stream';
            const arrayBuffer = await file.arrayBuffer();
            const contentLength = arrayBuffer.byteLength;
            const response = await fetch(signedUrl, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': contentType,
                    'Content-Length': contentLength.toString(),
                },
                body: arrayBuffer,
            });
            if (!response.ok) {
                throw new Error(`Failed to upload file: ${response.statusText}`);
            }
        } catch (error) {
            throw new Error(`Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async function getFile(endPoint: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(endPoint)
            .withResponse<GetFileResponse>(getFileResponseSchema)
            .execute();
    }

    async function deleteFile(endPoint: string) {
        return new RequestBuilder(BASE_API_URL)
            .delete(endPoint)
            .execute();
    }

    return {
        getSignedUrl,
        getFile,
        deleteFile,
        preUploadFile,
        uploadFile,
    }
}