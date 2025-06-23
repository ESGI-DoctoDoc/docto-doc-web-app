export async function resolveRequestMock(data: unknown, delay = 250) {
    await new Promise(resolve => setTimeout(resolve, delay));
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