const medicalSuggestions = {
    diagnoses: {
        primary: [
            "Influenza",
            "Strep Throat",
            "Urinary Tract Infection"
        ],
        secondary: [
            "Pneumonia",
            "Gastroenteritis",
            "Appendicitis"
        ]
    },
    medications: [
        {
            name: "Oseltamivir",
            dosage: "30-60mg twice daily for 5 days",
            duration: "5 days"
        },
        {
            name: "Amoxicillin",
            dosage: "25-50mg/kg/day divided into 2 doses for 10 days",
            duration: "10 days"
        },
        {
            name: "Trimethoprim-sulfamethoxazole",
            dosage: "5-10mg/kg/day of trimethoprim component divided into 2 doses for 3-7 days",
            duration: "3-7 days"
        }
    ],
    investigations: [
        "Complete Blood Count",
        "Urinalysis",
        "Rapid Strep Test",
        "Nasopharyngeal Swab for Influenza"
    ],
    radiology: [
        "Chest X-ray",
        "Abdominal X-ray"
    ]
};

export const chestSuggestion = {
    "diagnoses": {
        "primary": [
            "Acute bronchitis",
            "Upper respiratory tract infection",
            "Influenza"
        ],
        "secondary": [
            "Pneumonia",
            "Asthma exacerbation",
            "Allergic rhinitis"
        ]
    },
    "medications": [
        {
            "name": "Guaifenesin",
            "dosage": "600-1200 mg every 12 hours",
            "duration": "5-7 days",
            "note": "Expectorant to help loosen mucus"
        },
        {
            "name": "Ibuprofen",
            "dosage": "400-600 mg every 6-8 hours",
            "duration": "3-5 days",
            "note": "Anti-inflammatory for fever and body aches"
        },
        {
            "name": "Dextromethorphan",
            "dosage": "10-20 mg every 4-6 hours",
            "duration": "3-5 days",
            "note": "Cough suppressant if cough is severe"
        }
    ],
    "investigations": {
        "required": [
            {
                "category": "Blood",
                "tests": [
                    "Complete blood count (CBC)",
                    "C-reactive protein (CRP)"
                ],
                "rationale": "To check for infection and inflammation",
                "timing": "Routine",
                "prerequisites": "None"
            },
            {
                "category": "Respiratory",
                "tests": [
                    "Chest X-ray",
                    "Pulmonary function tests"
                ],
                "rationale": "To rule out pneumonia and assess lung function",
                "timing": "Routine unless severe symptoms",
                "prerequisites": "None"
            }
        ],
        "optional": [
            {
                "category": "Microbiology",
                "tests": [
                    "Sputum culture",
                    "Influenza/Respiratory virus PCR"
                ],
                "conditions": "If symptoms persist or worsen after initial treatment"
            }
        ]
    },
    "radiology": {
        "primary": [
            {
                "modality": "Chest X-ray",
                "region": "Chest/Lungs",
                "views": "Posteroanterior (PA) and lateral views",
                "rationale": "To evaluate for pneumonia or other lung abnormalities",
                "timing": "Routine unless severe symptoms",
                "prerequisites": "None"
            }
        ],
        "alternative": [
            {
                "modality": "Chest CT scan",
                "conditions": "If X-ray is inconclusive or to evaluate complications",
                "contraindications": "Pregnancy, high radiation exposure risk"
            }
        ]
    }
};
export default medicalSuggestions;