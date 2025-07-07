// import {authMockHandlers} from "~/mocks/handlers/auth.handler";
// import {careTrackingMockHandlers} from "~/mocks/handlers/care-tracking.handler";
// import {medicalConcernsMockHandlers} from "~/mocks/handlers/medical-concerns.handler";
// import {absencesMockHandlers} from "~/mocks/handlers/absences.handler";
import {patientsMockHandlers} from "~/mocks/handlers/patients.handler";
// import {appointmentsMockHandlers} from "~/mocks/handlers/appointments.handler";
// import {slotsMockHandlers} from "~/mocks/handlers/slots.handler";
// import {subscriptionMockHandlers} from "~/mocks/handlers/subscription.handler";
// import {doctorsMockHandlers} from "~/mocks/handlers/doctors.handler";
import {autocompleteHandlers} from "~/mocks/handlers/autocomplete.handler";

export const handlers = [
    // ...authMockHandlers,
    // ...careTrackingMockHandlers,
    // ...medicalConcernsMockHandlers,
    // ...slotsMockHandlers,
    // ...absencesMockHandlers,
    ...patientsMockHandlers,
    // ...appointmentsMockHandlers,
    // ...subscriptionMockHandlers,
    // ...doctorsMockHandlers,
    ...autocompleteHandlers,
    // ...mediaHandlers,
]