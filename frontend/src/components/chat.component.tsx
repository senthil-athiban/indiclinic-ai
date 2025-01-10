import React, { useState } from "react";
import medicalSuggestions from "../example";
import { BACKEND_DOMAIN } from "../config";

const Chat = () => {
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [patientAge, setPatientAge] = useState(0);
  const [patientMedicalHistory, setPatientMedicalHistory] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [response, setResponse] = useState(medicalSuggestions);
  
    console.log("response: ", response);
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const patientContext = {
      age: patientAge,
      gender: patientGender,
      medicalExam: patientMedicalHistory,
    };
    const jsonData = {
      chiefComplaint,
      patientContext,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    };
    const res = await fetch(
      `${BACKEND_DOMAIN}/api/v1/ai/suggestions`,
      options
    );
    const responseBody = await res.json();
    setResponse(responseBody);
    console.log("responseBody: ", responseBody);
  };
  return (
    <div className="flex flex-col items-center justify-center my-2 top-10 gap-x-4">
      <div>
        <form onSubmit={onSubmit}>
          <div className="flex gap-x-4">
            <input
              type="text"
              placeholder="chief complaint"
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="border shadow-md p-2 rounded-md"
            />
            <input
              type="number"
              placeholder="patient age"
              onChange={(e) => setPatientAge(parseInt(e.target.value))}
              className="border shadow-md p-2 rounded-md"
            />
            <input
              type="text"
              placeholder="patient gender"
              onChange={(e) => setPatientGender(e.target.value)}
              className="border shadow-md p-2 rounded-md"
            />
            <input
              type="text"
              placeholder="patient medication history"
              onChange={(e) => setPatientMedicalHistory(e.target.value)}
              className="border shadow-md p-2 rounded-md"
            />
          </div>
          <div className="flex justify-center my-4">
            <button
              type="submit"
              className="border bg-blue-400 hover:bg-blue-600 text-white my-2 p-2 rounded-lg "
            >
              submit
            </button>
          </div>
        </form>
      </div>
      {response && (
        <div id="results" className="flex gap-x-6">
          <div id="diagnosis" className="flex gap-x-4">
            <div id="primary">
              <label htmlFor="" className="text-lg text-black">
                Primary diagnosis
              </label>
              {response.diagnoses.primary?.map((item: any) => {
                return (
                  <li key={item} className="text-sm mt-2">
                    {item}
                  </li>
                );
              })}
            </div>
            <div id="secondary">
              <label htmlFor="" className="text-lg text-black">
                Secondary diagnosis
              </label>
              {response.diagnoses.secondary?.map((item: any) => {
                return (
                  <li key={item} className="text-sm mt-2">
                    {item}
                  </li>
                );
              })}
            </div>
          </div>
          <div id="medications">
            <label htmlFor="" className="text-lg text-black">
              Medications
            </label>
            {response.medications?.map((item: any, index: number) => {
              return (
                <div className="mt-2 text-sm">
                  <p className="text-blue-400">{`Medication: ${index + 1}`}</p>
                  <p>{`name : ${item.name}`}</p>
                  <p className="text-balance">{`dosage: ${item.dosage}`}</p>
                  <p className="text-wrap">{`duration: ${item.duration}`}</p>
                </div>
              );
            })}
          </div>
          <div id="investigation">
            <label htmlFor="" className="text-lg text-black">
              Investigations
            </label>
            {response.investigations?.map((item: any) => {
              return (
                <li key={item} className="text-sm mt-2">
                    {item}
                  </li>
              );
            })}
          </div>
          <div id="radiology">
            <label htmlFor="" className="text-lg text-black">
              Radiology
            </label>
            {response.radiology?.map((item: any) => {
              return (
                <li key={item} className="text-sm mt-2">
                    {item}
                  </li>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default Chat;
