// import type { LinuxPassword, WindowPassword } from "./password";

import type { Password } from "./password";

const serviceStatus = ["سوفت وير"] as const;
type ServiceStatus = (typeof serviceStatus)[number];

const serviceType = [
  "عمل كامل ويندوز",
  "عمل كامل لينيكس",
  "صيانة ويندوز او لينيكس",
] as const;
type ServiceType = (typeof serviceType)[number];

// interface WindowsAllWork extends Service {
//   password: WindowPassword;
// }

// interface LinuxAllWork extends Service {
//   password: LinuxPassword;
// }

// interface WindowsOrLinuxMaintenance extends Service {}

interface Service {
  id: string;
  job_id: string;
  status: ServiceStatus;
  service_type: ServiceType;
  passwords?: Password;
  requirements?: string;
  notes?: string;
  attach?: string;
}

// const createServiceRefactor = (
//   service: Service,
//   password: LinuxPassword | WindowPassword
// ): WindowsAllWork | LinuxAllWork | WindowsOrLinuxMaintenance => {
//   if (service.service_type == "عمل كامل ويندوز")
//     return {
//       ...service,
//       password: password as WindowPassword,
//     } as WindowsAllWork;
//   else if (service.service_type == "عمل كامل لينيكس")
//     return {
//       ...service,
//       password: {},
//     } as LinuxAllWork;
//   else
//     return {
//       ...service,
//     } as WindowsOrLinuxMaintenance;
// };

export {
  serviceStatus,
  type ServiceStatus,
  serviceType,
  type ServiceType,
  type Service,
};
