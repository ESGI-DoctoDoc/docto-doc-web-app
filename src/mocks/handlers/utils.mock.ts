export async function resolveRequestMock(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return {
        success: true,
        data: data,
    }
}

export async function rejectRequestMock(): Promise<{ success: false, errorCode: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        success: false,
        errorCode: 'Error.test.errorCode',
    }
}