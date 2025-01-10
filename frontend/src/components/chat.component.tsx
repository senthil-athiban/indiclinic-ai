import React, { useState } from "react";
import medicalSuggestions, { chestSuggestion } from "../example";
import { BACKEND_DOMAIN } from "../config";

const Chat = () => {
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [patientAge, setPatientAge] = useState(0);
  const [patientMedicalHistory, setPatientMedicalHistory] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [response, setResponse] = useState(chestSuggestion);

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
    const res = await fetch(`${BACKEND_DOMAIN}/api/v1/ai/suggestions`, options);
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
        <div id="results" className="flex flex-col gap-x-2 gap-y-4">
          <div className="flex gap-x-10">
            <div id="diagnosis" className="flex gap-x-4">
              <div id="primary" className="border-2 shadow-md rounded-lg p-4">
                <label htmlFor="" className="text-lg text-black underline">
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
              <div id="secondary" className="border-2 shadow-md rounded-lg p-4">
                <label htmlFor="" className="text-lg text-black underline">
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

            <div id="medications" className="border-2 shadow-md rounded-lg p-4">
              <label htmlFor="" className="text-lg text-black underline">
                Medications
              </label>
              {response.medications?.map((item: any, index: number) => {
                return (
                  <div className="mt-2 text-sm">
                    <p className="text-blue-400">{`Medication: ${
                      index + 1
                    }`}</p>
                    <p>{`name : ${item.name}`}</p>
                    <p className="text-balance">{`dosage: ${item.dosage}`}</p>
                    <p className="text-wrap">{`duration: ${item.duration}`}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-y-10">
            <div
              id="investigation"
              className="border-2 shadow-md rounded-lg p-4 flex gap-x-4 flex-col"
            >
              <div id="title">
                <label htmlFor="" className="text-lg text-black underline">
                  Investigations
                </label>
              </div>
              <div className="flex gap-x-4">
                <div className="flex gap-x-4 flex-col border p-2 rounded-lg">
                  <label htmlFor="" className="text-base text-red-400">
                    Required
                  </label>
                  {response.investigations?.required.map((item: any, index: number) => {
                    
                    return (
                      <div className="my-2 p-2 border rounded-lg shadow-md">
                        <p className="text-blue-400">Radiology {index + 1}</p>    
                        <p>{`category: ${item.category}`}</p>
                        <div className="flex flex-col">
                          <p>Tests</p>
                          {item.tests.map((test: string) => (
                            <li>{test}</li>
                          ))}
                        </div>
                        <p>{`rationale: ${item.rationale}`}</p>
                        <p>{`timing: ${item.timing}`}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="border p-2 rounded-lg">
                  <label htmlFor="" className="text-base text-slate-600">
                    Optional
                  </label>
                  {response.investigations?.optional.map((item: any) => {
                    return (
                      <div className="my-2 p-2 border rounded-lg shadow-md">
                        <p>{`category: ${item.category}`}</p>
                        <div className="flex flex-col">
                          <p>Tests</p>
                          {item.tests.map((test: string) => (
                            <li>{test}</li>
                          ))}
                        </div>
                        <p>{`conditions: ${item.conditions}`}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div id="radiology" className="border-2 shadow-md rounded-lg p-4">
              <label htmlFor="" className="text-lg text-black underline">
                Radiology
              </label>
              <div className="flex gap-x-4">
              <div className="my-2 p-2 border rounded-lg shadow-md">
                <label htmlFor="" className="text-base text-red-400">
                  Required
                </label>
                {response.radiology?.primary.map((item: any) => {
                  return (
                    <div>
                      <p>{`modality: ${item.modality}`}</p>
                      <p>{`region: ${item.region}`}</p>
                      <p>{`views: ${item.views}`}</p>
                      <p>{`rationale: ${item.rationale}`}</p>
                    </div>
                  );
                })}
              </div>
              <div className="my-2 p-2 border rounded-lg shadow-md">
                <label htmlFor="" className="text-base text-red-400">
                  Alternative
                </label>
                {response.radiology?.alternative.map((item: any) => {
                  return (
                    <div>
                      <p>{`modality: ${item.modality}`}</p>
                      <p>{`conditions: ${item.conditions}`}</p>
                      <p>{`contraindications: ${item.contraindications}`}</p>
                    </div>
                  );
                })}
              </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Chat;
