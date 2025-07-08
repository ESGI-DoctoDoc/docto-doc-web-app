import PopupContinue from "~/components/modals/PopupContinue.vue";
import CancelAppointmentReason from "~/components/modals/CancelAppointmentReason.vue";

export const useModals = () => {
    const showPopupContinueModal = (message: string) => {
        const overlay = useOverlay()
        const modal = overlay.create(PopupContinue);

        return modal.open({message: message})
    }

    const showCancelAppointmentReasonModal = () => {
        const overlay = useOverlay()
        const modal = overlay.create(CancelAppointmentReason);

        return modal.open()
    }

    // const showSendEmailModal = ()

    return {
        showPopupContinueModal,
        showCancelAppointmentReasonModal,
    }
}