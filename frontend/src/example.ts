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

export default medicalSuggestions;