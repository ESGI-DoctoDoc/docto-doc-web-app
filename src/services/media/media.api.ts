import {RequestBuilder} from "~/api/request-builder";
import {type GetFileUrlResponse, getFileUrlResponseSchema} from "~/services/media/dto/get-media.dto";
import {type UploadFileBody, uploadFileBodySchema,} from "~/services/media/dto/upload-media.dto";

export const useMediaApi = () => {

    function uploadFile(file: File | Blob) {
        const formData = new FormData();
        formData.append('file', file);

        return new RequestBuilder(`${import.meta.env.VITE_API_BASE}/v1`)
            .post('/media')
            .withBody<UploadFileBody>(uploadFileBodySchema)
            .withResponse<GetFileUrlResponse>(getFileUrlResponseSchema)
            .execute({
                body: {
                    file: formData,
                },
            });
    }

    function getFileUrl(fileId: string) {
        return new RequestBuilder(`${import.meta.env.VITE_API_BASE}/v1`)
            .get(`/media/${fileId}`)
            .withResponse<GetFileUrlResponse>(getFileUrlResponseSchema)
            .execute();
    }

    function deleteFile(fileId: string) {
        return new RequestBuilder(`${import.meta.env.VITE_API_BASE}/v1`)
            .delete(`/media/${fileId}`)
            .execute()
    }

    return {
        uploadFile,
        deleteFile,
        getFileUrl,
    }
}