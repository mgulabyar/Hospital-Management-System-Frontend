// /* eslint-disable react-hooks/set-state-in-effect */

// /* eslint-disable @typescript-eslint/no-explicit-any */

// import React, { useState, useEffect } from "react";
// import {
//   UserPlus,
//   Ticket,
//   RefreshCw,
//   HeartPulse,
//   ClipboardCheck,
//   CreditCard,
//   Droplet,
// } from "lucide-react";
// import { hmsServices } from "../../services/apiService";
// import { hmsReceptionServices } from "../../services/receptionService";

// export const ReceptionistWorkspace: React.FC = () => {
//   const [patients, setPatients] = useState<any[]>([]);
//   const [doctors, setDoctors] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);

//   const [patientBtnLoading, setPatientBtnLoading] = useState<boolean>(false);
//   const [tokenBtnLoading, setTokenBtnLoading] = useState<boolean>(false);

//   const [name, setName] = useState<string>("");
//   const [age, setAge] = useState<string>("");
//   const [gender, setGender] = useState<string>("Male");
//   const [phone, setPhone] = useState<string>("");
//   const [address, setAddress] = useState<string>("");
//   const [cnicOrPassport, setCnicOrPassport] = useState<string>("");
//   const [bloodGroup, setBloodGroup] = useState<string>("");
//   const [emergencyName, setEmergencyName] = useState<string>("");
//   const [emergencyRelation, setEmergencyRelation] = useState<string>("");
//   const [emergencyPhone, setEmergencyPhone] = useState<string>("");

//   const [selectedPatientId, setSelectedPatientId] = useState<string>("");
//   const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
//   const [department, setDepartment] = useState<string>("General OPD");
//   const [bp, setBp] = useState<string>("120/80");
//   const [pulse, setPulse] = useState<string>("75");
//   const [weight, setWeight] = useState<string>("70");
//   const [temp, setTemp] = useState<string>("98.6");

//   const [successMsg, setSuccessMsg] = useState<string>("");
//   const [errorMsg, setErrorMsg] = useState<string>("");

//   const syncReceptionPanelData = async () => {
//     setLoading(true);
//     setErrorMsg("");

//     try {
//       const patientResponse =
//         await hmsReceptionServices.getRegisteredPatients();

//       if (patientResponse.success) {
//         setPatients(patientResponse.data || []);
//       }

//       const doctorResponse = await hmsServices.staff.getAllStaff("doctor");

//       if (doctorResponse.success) {
//         setDoctors(doctorResponse.data || []);
//       }
//     } catch (err: any) {
//       setErrorMsg(
//         err?.response?.data?.message || "Failed to sync reception parameters.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     syncReceptionPanelData();
//   }, []);

//   const handleRegisterPatientForm = async (
//     event: React.FormEvent<HTMLFormElement>,
//   ) => {
//     event.preventDefault();

//     setSuccessMsg("");
//     setErrorMsg("");
//     setPatientBtnLoading(true);

//     const payload = {
//       name,
//       age: Number(age),
//       gender,
//       phone,
//       address,
//       cnicOrPassport,
//       bloodGroup,
//       emergencyContact: {
//         name: emergencyName,
//         relation: emergencyRelation,
//         phone: emergencyPhone,
//       },
//     };

//     setTimeout(async () => {
//       try {
//         const response =
//           await hmsReceptionServices.registerPatientProfile(payload);

//         if (response.success && response.data) {
//           setSuccessMsg(
//             `Success: Patient folder assigned official UHID ${response.data.patientId} inside server database memory.`,
//           );

//           setName("");
//           setAge("");
//           setGender("Male");
//           setPhone("");
//           setAddress("");
//           setCnicOrPassport("");
//           setBloodGroup("");
//           setEmergencyName("");
//           setEmergencyRelation("");
//           setEmergencyPhone("");

//           await syncReceptionPanelData();
//         }
//       } catch (err: any) {
//         setErrorMsg(
//           err?.response?.data?.message ||
//             "Failed to save patient folder profile registries.",
//         );
//       } finally {
//         setPatientBtnLoading(false);
//       }
//     }, 2000);
//   };

//   const handleIssueTokenTicketForm = async (
//     event: React.FormEvent<HTMLFormElement>,
//   ) => {
//     event.preventDefault();

//     setSuccessMsg("");
//     setErrorMsg("");

//     if (!selectedPatientId || !selectedDoctorId) {
//       setErrorMsg(
//         "Validation Warning: Ensure both target patient profile and duty doctor are selected.",
//       );
//       return;
//     }

//     setTokenBtnLoading(true);

//     const payload = {
//       patient: selectedPatientId,
//       doctor: selectedDoctorId,
//       department,
//       vitals: {
//         bp,
//         pulse: Number(pulse),
//         weight: Number(weight),
//         temperature: Number(temp),
//       },
//     };

//     setTimeout(async () => {
//       try {
//         const response = await hmsReceptionServices.issueOPDQueueToken(payload);

//         if (response.success && response.data) {
//           setSuccessMsg(
//             `Success: OPD Entry Token issued successfully! Assigned Serial Ticket Queue Number #${response.data.tokenNumber}.`,
//           );

//           setSelectedPatientId("");
//           setSelectedDoctorId("");
//           setDepartment("General OPD");
//           setBp("120/80");
//           setPulse("75");
//           setWeight("70");
//           setTemp("98.6");
//         }
//       } catch (err: any) {
//         setErrorMsg(
//           err?.response?.data?.message ||
//             "Failed to issue active checkup parameters line token.",
//         );
//       } finally {
//         setTokenBtnLoading(false);
//       }
//     }, 2000);
//   };

//   return (
//     <div className="mx-auto max-w-7xl p-6 font-sans antialiased text-slate-700">
//       <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
//         <div>
//           <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
//             Receptionist <span className="text-[#029352]">Workspace</span>
//           </h1>

//           <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
//             Register patient profiles and manage daily OPD queue tokens.
//           </p>
//         </div>

//         <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
//           <HeartPulse className="h-5 w-5" />
//         </div>
//       </div>

//       {successMsg && (
//         <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-xs font-bold text-[#029352] shadow-sm">
//           {successMsg}
//         </div>
//       )}

//       {errorMsg && (
//         <div className="mb-4 rounded-lg border border-rose-100 bg-rose-50 p-4 text-xs font-bold text-rose-600 shadow-sm">
//           {errorMsg}
//         </div>
//       )}

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//         <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
//             <div className="rounded-lg bg-[#1a4b8c]/10 p-2 text-[#1a4b8c]">
//               <UserPlus className="h-4 w-4" />
//             </div>

//             <div>
//               <h3 className="text-sm font-bold uppercase text-[#1a4b8c]">
//                 Patient Entry <span className="text-[#029352]">Directory</span>
//               </h3>

//               <p className="mt-0.5 text-[10px] font-medium text-slate-400">
//                 Create a new patient demographic profile.
//               </p>
//             </div>
//           </div>

//           <form onSubmit={handleRegisterPatientForm} className="space-y-4">
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <div>
//                 <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                   Patient Name
//                 </label>

//                 <input
//                   type="text"
//                   required
//                   value={name}
//                   onChange={(event) => setName(event.target.value)}
//                   placeholder="Zain Ali Niazi"
//                   className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                   Contact Phone
//                 </label>

//                 <input
//                   type="tel"
//                   required
//                   value={phone}
//                   onChange={(event) => setPhone(event.target.value)}
//                   placeholder="03009876543"
//                   className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <div>
//                 <label className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                   <CreditCard className="h-3 w-3 text-[#1a4b8c]" />
//                   <span>CNIC / Passport</span>
//                 </label>

//                 <input
//                   type="text"
//                   value={cnicOrPassport}
//                   onChange={(event) => setCnicOrPassport(event.target.value)}
//                   placeholder="35202-XXXXXXXX-X"
//                   className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
//                 />
//               </div>

//               <div className="font-sans antialiased">
//                 <label className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-slate-400 select-none">
//                   <Droplet className="h-3 w-3 text-[#029352]" />
//                   <span>Blood Group</span>
//                 </label>

//                 <div className="relative w-full">
//                   <select
//                     value={bloodGroup}
//                     onChange={(event) => setBloodGroup(event.target.value)}
//                     className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 pl-3 pr-10 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 outline-none transition-all duration-200 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10 appearance-none shadow-sm"
//                   >
//                     <option value="">Select Blood Group</option>
//                     <option value="O+">O Pos (O+)</option>
//                     <option value="O-">O Neg (O-)</option>
//                     <option value="A+">A Pos (A+)</option>
//                     <option value="A-">A Neg (A-)</option>
//                     <option value="B+">B Pos (B+)</option>
//                     <option value="B-">B Neg (B-)</option>
//                     <option value="AB+">AB Pos (AB+)</option>
//                     <option value="AB-">AB Neg (AB-)</option>
//                   </select>

//                   <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2.5"
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <div>
//                 <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                   Age (Years)
//                 </label>

//                 <input
//                   type="number"
//                   required
//                   min="0"
//                   max="150"
//                   value={age}
//                   onChange={(event) => setAge(event.target.value)}
//                   placeholder="28"
//                   className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
//                 />
//               </div>

//               <div className="font-sans antialiased">
//                 <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-400 select-none">
//                   Gender Specification
//                 </label>

//                 <div className="relative w-full">
//                   <select
//                     value={gender}
//                     onChange={(event) => setGender(event.target.value)}
//                     className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 pl-3 pr-10 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-500 outline-none transition-all duration-200 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10 appearance-none shadow-sm"
//                   >
//                     <option value="Male">MALE</option>
//                     <option value="Female">FEMALE</option>
//                     <option value="Other">OTHER</option>
//                   </select>

//                   <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2.5"
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                 Permanent Residential Address
//               </label>

//               <input
//                 type="text"
//                 required
//                 value={address}
//                 onChange={(event) => setAddress(event.target.value)}
//                 placeholder="House 12, Block C, Faisalabad"
//                 className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
//               />
//             </div>

//             <div className="rounded-lg border border-[#029352]/20 bg-[#029352]/5 p-4">
//               <div className="mb-3 flex items-center gap-2">
//                 <ClipboardCheck className="h-4 w-4 text-[#029352]" />

//                 <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#1a4b8c]">
//                   Emergency Contact Node
//                 </h4>
//               </div>

//               <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//                 <input
//                   type="text"
//                   required
//                   value={emergencyName}
//                   onChange={(event) => setEmergencyName(event.target.value)}
//                   placeholder="Name"
//                   className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:ring-2 focus:ring-[#029352]/10"
//                 />

//                 <input
//                   type="text"
//                   required
//                   value={emergencyRelation}
//                   onChange={(event) => setEmergencyRelation(event.target.value)}
//                   placeholder="Relation"
//                   className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:ring-2 focus:ring-[#029352]/10"
//                 />

//                 <input
//                   type="tel"
//                   required
//                   value={emergencyPhone}
//                   onChange={(event) => setEmergencyPhone(event.target.value)}
//                   placeholder="Phone"
//                   className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:ring-2 focus:ring-[#029352]/10"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={patientBtnLoading}
//               className="flex w-full items-center justify-center gap-2 rounded-lg cursor-pointer bg-[#1a4b8c] px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#143b6e] focus:outline-none focus:ring-2 focus:ring-[#029352]/30 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {patientBtnLoading ? (
//                 <>
//                   <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
//                   <span>Processing...</span>
//                 </>
//               ) : (
//                 <>
//                   <UserPlus className="h-4 w-4" />
//                   <span>Commit Directory Profile</span>
//                 </>
//               )}
//             </button>
//           </form>
//         </div>

//         <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
//             <div className="flex items-center gap-2">
//               <div className="rounded-lg bg-[#029352]/10 p-2 text-[#029352]">
//                 <Ticket className="h-4 w-4" />
//               </div>

//               <div>
//                 <h3 className="text-sm font-bold uppercase text-[#1a4b8c]">
//                   Issue OPD Queue <span className="text-[#029352]">Token</span>
//                 </h3>

//                 <p className="mt-0.5 text-[10px] font-medium text-slate-400">
//                   Allocate a patient to the doctor queue.
//                 </p>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={syncReceptionPanelData}
//               disabled={loading}
//               className="rounded-lg border border-slate-200 p-2 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] disabled:cursor-not-allowed disabled:opacity-50"
//               title="Refresh Patients and Doctors"
//             >
//               <RefreshCw
//                 className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
//               />
//             </button>
//           </div>

//           <form onSubmit={handleIssueTokenTicketForm} className="space-y-4">
//             <div className="font-sans antialiased">
//               <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-400 select-none">
//                 Target Patient Profile
//               </label>

//               <div className="relative w-full">
//                 <select
//                   required
//                   value={selectedPatientId}
//                   onChange={(event) => setSelectedPatientId(event.target.value)}
//                   className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 pl-3 pr-10 py-2.5 text-xs font-bold uppercase text-slate-600 outline-none transition-all duration-200 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10 appearance-none shadow-sm"
//                 >
//                   <option value="">SELECT PATIENT</option>

//                   {patients.map((patient: any) => (
//                     <option key={patient._id} value={patient._id}>
//                       {(patient.name || "Unknown Patient").toUpperCase()}
//                       {patient.patientId ? ` (${patient.patientId})` : ""}
//                     </option>
//                   ))}
//                 </select>

//                 <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
//                   <svg
//                     className="w-4 h-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2.5"
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4 font-sans antialiased">
//               {/* 1. ASSIGNED PRACTITIONER DROPDOWN */}
//               <div>
//                 <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-400 select-none">
//                   Assigned Practitioner
//                 </label>

//                 <div className="relative w-full">
//                   <select
//                     required
//                     value={selectedDoctorId}
//                     onChange={(event) =>
//                       setSelectedDoctorId(event.target.value)
//                     }
//                     className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 pl-3 pr-10 py-2.5 text-xs font-bold uppercase text-slate-600 outline-none transition-all duration-200 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10 appearance-none shadow-sm"
//                   >
//                     <option value="">SELECT DOCTOR</option>
//                     {doctors.map((doctor: any) => (
//                       <option key={doctor._id} value={doctor._id}>
//                         {(doctor.name || "Unknown Doctor").toUpperCase()}
//                       </option>
//                     ))}
//                   </select>

//                   <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2.5"
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-400 select-none">
//                   Clinical Department
//                 </label>

//                 <div className="relative w-full">
//                   <select
//                     required
//                     value={department}
//                     onChange={(event) => setDepartment(event.target.value)}
//                     className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 pl-3 pr-10 py-2.5 text-xs font-bold uppercase text-slate-600 outline-none transition-all duration-200 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10 appearance-none shadow-sm"
//                   >
//                     <option value="General OPD">GENERAL OPD</option>
//                     <option value="Cardiology">CARDIOLOGY</option>
//                     <option value="Pediatrics">PEDIATRICS</option>
//                     <option value="ENT">ENT DEPARTMENT</option>
//                     <option value="Orthopedics">ORTHOPEDICS</option>
//                     <option value="Gynecology">GYNECOLOGY</option>
//                     <option value="Dermatology">DERMATOLOGY</option>
//                     <option value="Ophthalmology">OPHTHALMOLOGY</option>
//                     <option value="Neurology">NEUROLOGY</option>
//                     <option value="Gastroenterology">GASTROENTEROLOGY</option>
//                     <option value="Urology">UROLOGY</option>
//                     <option value="Psychiatry">PSYCHIATRY</option>
//                   </select>

//                   <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2.5"
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                 Patient Blood Pressure (BP)
//               </label>

//               <input
//                 type="text"
//                 required
//                 value={bp}
//                 onChange={(event) => setBp(event.target.value)}
//                 className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
//               />
//             </div>

//             <div className="grid grid-cols-3 gap-3 rounded-lg border border-[#1a4b8c]/10 bg-[#1a4b8c]/2.5 p-3">
//               <div>
//                 <label className="mb-1 block text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
//                   Pulse (bpm)
//                 </label>

//                 <input
//                   type="number"
//                   required
//                   value={pulse}
//                   onChange={(event) => setPulse(event.target.value)}
//                   className="w-full rounded-md border border-slate-200 bg-white px-2 py-2.5 text-center text-xs font-semibold text-slate-700 outline-none focus:border-[#029352]"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
//                   Weight (kg)
//                 </label>

//                 <input
//                   type="number"
//                   required
//                   value={weight}
//                   onChange={(event) => setWeight(event.target.value)}
//                   className="w-full rounded-md border border-slate-200 bg-white px-2 py-2.5 text-center text-xs font-semibold text-slate-700 outline-none focus:border-[#029352]"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
//                   Temp (°F)
//                 </label>

//                 <input
//                   type="text"
//                   required
//                   value={temp}
//                   onChange={(event) => setTemp(event.target.value)}
//                   className="w-full rounded-md border border-slate-200 bg-white px-2 py-2.5 text-center text-xs font-semibold text-slate-700 outline-none focus:border-[#029352]"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={tokenBtnLoading}
//               className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#029352] px-4 py-3.5 cursor-pointer text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#017542] focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {tokenBtnLoading ? (
//                 <>
//                   <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
//                   <span>Processing...</span>
//                 </>
//               ) : (
//                 <>
//                   <Ticket className="h-4 w-4" />
//                   <span>Generate Live OPD Token</span>
//                 </>
//               )}
//             </button>

//             <p className="text-center text-[10px] font-medium italic text-slate-400">
//               OPD token records automatically increment inside MongoDB storage
//               on every dynamic transaction commit.
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Ticket,
  RefreshCw,
  HeartPulse,
  ClipboardCheck,
  CreditCard,
  Droplet,
  Activity,
  Thermometer,
  Scale,
  Heart,
  Phone,
  HeartHandshake,
  User,
} from "lucide-react";
import { hmsServices } from "../../services/apiService";
import { hmsReceptionServices } from "../../services/receptionService";

export const ReceptionistWorkspace: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [patientBtnLoading, setPatientBtnLoading] = useState<boolean>(false);
  const [tokenBtnLoading, setTokenBtnLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("Male");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [cnicOrPassport, setCnicOrPassport] = useState<string>("");
  const [bloodGroup, setBloodGroup] = useState<string>("O+");
  const [emergencyName, setEmergencyName] = useState<string>("");
  const [emergencyRelation, setEmergencyRelation] = useState<string>("");
  const [emergencyPhone, setEmergencyPhone] = useState<string>("");

  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [department, setDepartment] = useState<string>("General OPD");
  const [bp, setBp] = useState<string>("120/80");
  const [pulse, setPulse] = useState<string>("75");
  const [weight, setWeight] = useState<string>("70");
  const [temp, setTemp] = useState<string>("98.6");

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const syncReceptionPanelData = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const patientResponse =
        await hmsReceptionServices.getRegisteredPatients();

      if (patientResponse.success) {
        setPatients(patientResponse.data || []);
      }

      const doctorResponse = await hmsServices.staff.getAllStaff("doctor");

      if (doctorResponse.success) {
        setDoctors(doctorResponse.data || []);
      }
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || "Failed to sync reception parameters.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncReceptionPanelData();
  }, []);

  const handleRegisterPatientForm = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSuccessMsg("");
    setErrorMsg("");
    setPatientBtnLoading(true);

    const payload = {
      name,
      age: Number(age),
      gender,
      phone,
      address,
      cnicOrPassport,
      bloodGroup,
      emergencyContact: {
        name: emergencyName,
        relation: emergencyRelation,
        phone: emergencyPhone,
      },
    };

    setTimeout(async () => {
      try {
        const response =
          await hmsReceptionServices.registerPatientProfile(payload);

        if (response.success && response.data) {
          setSuccessMsg(
            `Success: Patient folder assigned official UHID ${response.data.patientId} inside server database memory.`,
          );

          setName("");
          setAge("");
          setGender("Male");
          setPhone("");
          setAddress("");
          setCnicOrPassport("");
          setBloodGroup("O+");
          setEmergencyName("");
          setEmergencyRelation("");
          setEmergencyPhone("");

          await syncReceptionPanelData();
        }
      } catch (err: any) {
        setErrorMsg(
          err?.response?.data?.message ||
            "Failed to save patient folder profile registries.",
        );
      } finally {
        setPatientBtnLoading(false);
      }
    }, 2000);
  };

  const handleIssueTokenTicketForm = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSuccessMsg("");
    setErrorMsg("");

    if (!selectedPatientId || !selectedDoctorId) {
      setErrorMsg(
        "Validation Warning: Ensure both target patient profile and duty doctor are selected.",
      );
      return;
    }

    setTokenBtnLoading(true);

    const payload = {
      patient: selectedPatientId,
      doctor: selectedDoctorId,
      department,
      vitals: {
        bp,
        pulse: Number(pulse),
        weight: Number(weight),
        temperature: Number(temp),
      },
    };

    setTimeout(async () => {
      try {
        const response = await hmsReceptionServices.issueOPDQueueToken(payload);

        if (response.success && response.data) {
          setSuccessMsg(
            `Success: OPD Entry Token issued successfully! Assigned Serial Ticket Queue Number #${response.data.tokenNumber}.`,
          );

          setSelectedPatientId("");
          setSelectedDoctorId("");
          setDepartment("General OPD");
          setBp("120/80");
          setPulse("75");
          setWeight("70");
          setTemp("98.6");
        }
      } catch (err: any) {
        setErrorMsg(
          err?.response?.data?.message ||
            "Failed to issue active checkup parameters line token.",
        );
      } finally {
        setTokenBtnLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-7xl p-6 font-sans antialiased text-slate-700">
      <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
            Receptionist <span className="text-[#029352]">Workspace</span>
          </h1>

          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Register patient profiles and manage daily OPD queue tokens.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
          <HeartPulse className="h-5 w-5" />
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-xs font-bold text-[#029352] shadow-sm">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 rounded-lg border border-rose-100 bg-rose-50 p-4 text-xs font-bold text-rose-600 shadow-sm">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Panel: Patient Registration */}
        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="rounded-lg bg-[#1a4b8c]/10 p-2 text-[#1a4b8c]">
              <UserPlus className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase text-[#1a4b8c]">
                Patient Entry <span className="text-[#029352]">Directory</span>
              </h3>

              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                Create a new patient demographic profile.
              </p>
            </div>
          </div>

          <form onSubmit={handleRegisterPatientForm} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Patient Name
                </label>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Zain Ali Niazi"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Contact Phone
                </label>

                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="03009876543"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="font-sans antialiased">
                <label className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-slate-400 select-none">
                  <CreditCard className="h-3 w-3 text-[#1a4b8c]" />
                  <span>CNIC / Passport</span>
                </label>

                <input
                  type="text"
                  value={cnicOrPassport}
                  maxLength={15}
                  onChange={(event) => {
                    const rawValue = event.target.value;
                    const digitsOnly = rawValue.replace(/\D/g, "");

                    // eslint-disable-next-line no-useless-assignment
                    let maskedValue = "";

                    if (digitsOnly.length <= 5) {
                      maskedValue = digitsOnly;
                    } else if (digitsOnly.length <= 12) {
                      maskedValue = `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5)}`;
                    } else {
                      maskedValue = `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5, 12)}-${digitsOnly.slice(12, 13)}`;
                    }

                    if (rawValue.length > 0 && !/^\d/.test(rawValue)) {
                      setCnicOrPassport(rawValue.toUpperCase());
                    } else {
                      setCnicOrPassport(maskedValue);
                    }
                  }}
                  placeholder="35202-XXXXXXX-X"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10 shadow-sm"
                />
              </div>
              <div className="font-sans antialiased">
                <label className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-slate-400 select-none">
                  <Droplet className="h-3 w-3 text-[#029352]" />
                  <span>Blood Group</span>
                </label>

                <div className="relative w-full">
                  <select
                    value={bloodGroup}
                    onChange={(event) => setBloodGroup(event.target.value)}
                    className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 pl-3 pr-10 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 outline-none transition-all duration-200 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10 appearance-none shadow-sm"
                  >
                    <option value="O+">O Pos (O+)</option>
                    <option value="O-">O Neg (O-)</option>
                    <option value="A+">A Pos (A+)</option>
                    <option value="A-">A Neg (A-)</option>
                    <option value="B+">B Pos (B+)</option>
                    <option value="B-">B Neg (B-)</option>
                    <option value="AB+">AB Pos (AB+)</option>
                    <option value="AB-">AB Neg (AB-)</option>
                  </select>

                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Age (Years)
                </label>

                <input
                  type="number"
                  required
                  min="0"
                  max="150"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  placeholder="28"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
                />
              </div>

              <div className="font-sans antialiased">
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-400 select-none">
                  Gender Specification
                </label>

                <div className="relative w-full">
                  <select
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                    className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 pl-3 pr-10 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-500 outline-none transition-all duration-200 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10 appearance-none shadow-sm"
                  >
                    <option value="Male">MALE</option>
                    <option value="Female">FEMALE</option>
                    <option value="Other">OTHER</option>
                  </select>

                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Permanent Residential Address
              </label>

              <input
                type="text"
                required
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="House 12, Block C, Faisalabad"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
              />
            </div>

            <div className="rounded-lg border border-[#1a4b8c]/10 bg-[#1a4b8c]/2.5 p-3 font-sans antialiased select-none">
              <div className="mb-3 flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-[#1a4b8c]" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#1a4b8c]">
                  Emergency Contact Node
                </h4>
              </div>

              {/* Exact Grid Columns Array and Spacing Configuration */}
              <div className="grid grid-cols-3 gap-3">
                {/* COLUMN 1: CONTACT NAME */}
                <div>
                  <div className="mb-1 flex items-center justify-center gap-1">
                    <User className="h-3 w-3 text-slate-400" />
                    <label className="text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Name
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    value={emergencyName}
                    onChange={(event) => setEmergencyName(event.target.value)}
                    placeholder="Muhammad Ali"
                    className="w-full rounded-md border border-slate-200 bg-white px-2 py-2.5 text-center text-xs font-semibold text-slate-700 outline-none focus:border-[#029352] transition-colors placeholder:text-slate-300"
                  />
                </div>

                {/* COLUMN 2: KINSHIP RELATION */}
                <div>
                  <div className="mb-1 flex items-center justify-center gap-1">
                    <HeartHandshake className="h-3 w-3 text-slate-400" />
                    <label className="text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Relation
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    value={emergencyRelation}
                    onChange={(event) =>
                      setEmergencyRelation(event.target.value)
                    }
                    placeholder="Brother"
                    className="w-full rounded-md border border-slate-200 bg-white px-2 py-2.5 text-center text-xs font-semibold text-slate-700 outline-none focus:border-[#029352] transition-colors placeholder:text-slate-300"
                  />
                </div>

                {/* COLUMN 3: SECURE PHONE CHANNEL */}
                <div>
                  <div className="mb-1 flex items-center justify-center gap-1">
                    <Phone className="h-3 w-3 text-slate-400" />
                    <label className="text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Phone
                    </label>
                  </div>
                  <input
                    type="tel"
                    required
                    value={emergencyPhone}
                    onChange={(event) => setEmergencyPhone(event.target.value)}
                    placeholder="0300-XXXXXXX"
                    className="w-full rounded-md border border-slate-200 bg-white px-2 py-2.5 text-center text-xs font-semibold text-slate-700 outline-none focus:border-[#029352] transition-colors placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={patientBtnLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg cursor-pointer bg-[#1a4b8c] px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#143b6e] focus:outline-none focus:ring-2 focus:ring-[#029352]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {patientBtnLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Commit Directory Profile</span>
                </>
              )}
            </button>

            <p className="text-center text-[10px] font-medium italic text-slate-400">
              Patient records are permanently saved inside MongoDB storage on
              every dynamic transaction commit via encrypted pipeline logs.
            </p>
          </form>
        </div>

        {/* Right Panel: OPD Token */}
        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-[#029352]/10 p-2 text-[#029352]">
                <Ticket className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase text-[#1a4b8c]">
                  Issue OPD Queue <span className="text-[#029352]">Token</span>
                </h3>

                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                  Allocate a patient to the doctor queue.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={syncReceptionPanelData}
              disabled={loading}
              className="rounded-lg border border-slate-200 p-2 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] disabled:cursor-not-allowed disabled:opacity-50"
              title="Refresh Patients and Doctors"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          <form onSubmit={handleIssueTokenTicketForm} className="space-y-4">
            <div className="font-sans antialiased">
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-400 select-none">
                Target Patient Profile
              </label>

              <div className="relative w-full">
                <select
                  required
                  value={selectedPatientId}
                  onChange={(event) => setSelectedPatientId(event.target.value)}
                  className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 pl-3 pr-10 py-2.5 text-xs font-bold uppercase text-slate-600 outline-none transition-all duration-200 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10 appearance-none shadow-sm"
                >
                  <option value="">SELECT PATIENT</option>

                  {patients.map((patient: any) => (
                    <option key={patient._id} value={patient._id}>
                      {(patient.name || "Unknown Patient").toUpperCase()}
                      {patient.patientId ? ` (${patient.patientId})` : ""}
                    </option>
                  ))}
                </select>

                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-4 font-sans antialiased">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-400 select-none">
                  Assigned Practitioner
                </label>

                <div className="relative w-full">
                  <select
                    required
                    value={selectedDoctorId}
                    onChange={(event) =>
                      setSelectedDoctorId(event.target.value)
                    }
                    className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 pl-3 pr-10 py-2.5 text-xs font-bold uppercase text-slate-600 outline-none transition-all duration-200 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10 appearance-none shadow-sm"
                  >
                    <option value="">SELECT DOCTOR</option>
                    {doctors.map((doctor: any) => (
                      <option key={doctor._id} value={doctor._id}>
                        {(doctor.name || "Unknown Doctor").toUpperCase()}
                      </option>
                    ))}
                  </select>

                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-400 select-none">
                  Clinical Department
                </label>

                <div className="relative w-full">
                  <select
                    required
                    value={department}
                    onChange={(event) => setDepartment(event.target.value)}
                    className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 pl-3 pr-10 py-2.5 text-xs font-bold uppercase text-slate-600 outline-none transition-all duration-200 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10 appearance-none shadow-sm"
                  >
                    <option value="General OPD">GENERAL OPD</option>
                    <option value="Cardiology">CARDIOLOGY</option>
                    <option value="Pediatrics">PEDIATRICS</option>
                    <option value="ENT">ENT DEPARTMENT</option>
                    <option value="Orthopedics">ORTHOPEDICS</option>
                    <option value="Gynecology">GYNECOLOGY</option>
                    <option value="Dermatology">DERMATOLOGY</option>
                    <option value="Ophthalmology">OPHTHALMOLOGY</option>
                    <option value="Neurology">NEUROLOGY</option>
                    <option value="Gastroenterology">GASTROENTEROLOGY</option>
                    <option value="Urology">UROLOGY</option>
                    <option value="Psychiatry">PSYCHIATRY</option>
                  </select>

                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Patient Blood Pressure (BP)
              </label>

              <input
                type="text"
                required
                value={bp}
                onChange={(event) => setBp(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
              />
            </div>

            <div className="rounded-lg border border-[#1a4b8c]/10 bg-[#1a4b8c]/2.5 p-3">
              <div className="mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#1a4b8c]" />

                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#1a4b8c]">
                  Vital Signs Monitor
                </h4>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="mb-1 flex items-center justify-center gap-1">
                    <Heart className="h-3 w-3 text-slate-400" />
                    <label className="text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Pulse
                    </label>
                  </div>

                  <input
                    type="number"
                    required
                    value={pulse}
                    onChange={(event) => setPulse(event.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-2 py-2.5 text-center text-xs font-semibold text-slate-700 outline-none focus:border-[#029352]"
                  />
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-center gap-1">
                    <Scale className="h-3 w-3 text-slate-400" />
                    <label className="text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Weight
                    </label>
                  </div>

                  <input
                    type="number"
                    required
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-2 py-2.5 text-center text-xs font-semibold text-slate-700 outline-none focus:border-[#029352]"
                  />
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-center gap-1">
                    <Thermometer className="h-3 w-3 text-slate-400" />
                    <label className="text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Temp
                    </label>
                  </div>

                  <input
                    type="text"
                    required
                    value={temp}
                    onChange={(event) => setTemp(event.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-2 py-2.5 text-center text-xs font-semibold text-slate-700 outline-none focus:border-[#029352]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={tokenBtnLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#029352] px-4 py-3.5 cursor-pointer text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#017542] focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {tokenBtnLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Ticket className="h-4 w-4" />
                  <span>Generate Live OPD Token</span>
                </>
              )}
            </button>

            <p className="text-center text-[10px] font-medium italic text-slate-400">
              OPD token records automatically increment inside MongoDB storage
              on every dynamic transaction commit.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
