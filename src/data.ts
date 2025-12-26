// src/data.ts

export const MOCK_PATIENTS = [
    { id: 1, name: "Leticia García", historyId: "HC-2024-001", familyHistory: "Antecedentes de ceguera nocturna" },
    { id: 2, name: "Juan Pérez", historyId: "HC-2024-002", familyHistory: "Sin antecedentes relevantes" },
];

export const MOCK_VARIANTS = [
    { id: "rs1", gene: "RHO", variant: "c.68C>A", classification: "Patogénica", depth: "120x" },
    { id: "rs2", gene: "USH2A", variant: "c.2299delG", classification: "Probablemente Patogénica", depth: "95x" },
    { id: "rs3", gene: "ABCA4", variant: "c.5882G>A", classification: "Benigna", depth: "200x" },
    { id: "rs4", gene: "RPGR", variant: "c.2405_2406del", classification: "Incierta (VUS)", depth: "45x" },
];

export const MOCK_PREDICTION = {
    disease: "Retinosis Pigmentaria",
    probability: 92.5,
    reasoning: "Se han identificado variantes patogénicas en el gen RHO consistentes con el fenotipo clínico reportado y el historial familiar de ceguera nocturna.",
    recommendedTests: ["Electrorretinograma", "Campo visual computarizado"]
};

export const CHAT_RESPONSES = {
    default: "Como asistente genético, puedo ayudarte a interpretar esta variante. Según ClinVar, esta mutación está asociada frecuentemente a distrofias retinianas.",
    prediction: "La predicción se basa en el peso combinado de la variante RHO (Dominante) y los antecedentes familiares reportados."
};