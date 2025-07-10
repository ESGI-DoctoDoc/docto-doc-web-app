import PopupContinue from "~/components/modals/PopupContinue.vue";
import CancelAppointmentReason from "~/components/modals/CancelAppointmentReason.vue";
import UpdateOneOrAllSlot from "~/components/modals/UpdateOneOrAllSlot.vue";

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

    const showUpdateOneOrAllSlot = (message: string) => {
        const overlay = useOverlay()
        const modal = overlay.create(UpdateOneOrAllSlot);

        return modal.open({message})
    }

    return {
        showPopupContinueModal,
        showCancelAppointmentReasonModal,
        showUpdateOneOrAllSlot,
    }
}