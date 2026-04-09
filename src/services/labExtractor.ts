import type { LabTest, NormalizationMap, TestStatus } from '../types';
import { chat, withRetry } from './ollama';
import { getNormalizationMap, updateNormalizationMap } from './storage';

interface ExtractedReport {
  patientName: string;
  labName: string;
  reportDate: string;
  tests: Array<{
    name: string;
    value: number;
    unit: string;
    referenceMin: number | null;
    referenceMax: number | null;
    category: string;
  }>;
}

const EXTRACTION_SCHEMA = {
  type: 'object',
  properties: {
    patientName: { type: 'string' },
    labName: { type: 'string' },
    reportDate: { type: 'string' },
    tests: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          value: { type: 'number' },
          unit: { type: 'string' },
          referenceMin: { type: ['number', 'null'] },
          referenceMax: { type: ['number', 'null'] },
          category: { type: 'string' },
        },
        required: ['name', 'value', 'unit', 'category'],
      },
    },
  },
  required: ['patientName', 'labName', 'reportDate', 'tests'],
};

const EXTRACTION_PROMPT = `You are a medical lab report data extractor. Analyze the lab report image(s) and extract ALL test results.

Rules:
- reportDate must be in YYYY-MM-DD format. Look for "Report Date", "Collection Date", or similar.
- For non-numeric values like "Negative", "Reactive", "Non-Reactive", use 0 as the value.
- referenceMin and referenceMax should be numbers or null if not available.
- category should be one of: CBC, Liver, Kidney, Lipid, Thyroid, Diabetes, Vitamin, Mineral, Hormone, Urine, Cardiac, Other
- Extract EVERY test result visible in the report. Do not skip any.
- Use the exact test name as printed on the report.`;

export async function extractFromImages(
  images: string[],
  onStatus?: (msg: string) => void,
): Promise<ExtractedReport> {
  onStatus?.('Sending images to AI for extraction...');

  const result = await withRetry(() =>
    chat(
      [
        { role: 'system', content: EXTRACTION_PROMPT },
        {
          role: 'user',
          content: 'Extract all lab test results from this report. Return structured JSON.',
          images,
        },
      ],
      { temperature: 0.1, format: EXTRACTION_SCHEMA },
    ),
  );

  const parsed = JSON.parse(result) as ExtractedReport;
  return parsed;
}

function computeStatus(value: number, min: number | null, max: number | null): TestStatus {
  if (min !== null && value < min) return 'low';
  if (max !== null && value > max) return 'high';
  return 'normal';
}

export function buildLabTests(
  extracted: ExtractedReport['tests'],
  normMap: NormalizationMap,
): LabTest[] {
  return extracted.map((t) => {
    const normalizedName = normMap[t.name] || t.name;
    return {
      id: crypto.randomUUID(),
      testName: normalizedName,
      originalName: t.name,
      value: t.value,
      unit: t.unit,
      referenceMin: t.referenceMin,
      referenceMax: t.referenceMax,
      category: t.category,
      status: computeStatus(t.value, t.referenceMin, t.referenceMax),
    };
  });
}

const NORMALIZATION_PROMPT = `You are a Medical Data Specialist. Your job is to normalize medical test marker names.

Given NEW_MARKERS (test names from a new report) and EXISTING_HISTORY (test names already tracked), map each new marker to an existing one if they refer to the same clinical test.

Rules:
- Force match synonyms: ALT = SGPT, AST = SGOT, Hb = Hemoglobin, etc.
- Strip noise words: "Serum", "Calculated", "Total" (unless clinically significant like "Total Cholesterol" vs "LDL Cholesterol")
- Prefer brevity and common medical abbreviations
- If no match exists, return the best clean short name for the marker
- Return a JSON object mapping each input name to its normalized name

Example: {"SGPT (ALT)": "ALT", "Serum Creatinine": "Creatinine", "Hb": "Hemoglobin"}`;

export async function normalizeMarkers(
  newNames: string[],
  existingNames: string[],
  onStatus?: (msg: string) => void,
): Promise<NormalizationMap> {
  if (newNames.length === 0) return {};

  onStatus?.('Normalizing test names...');

  const existing = getNormalizationMap();
  const unknownNames = newNames.filter((n) => !existing[n]);

  if (unknownNames.length === 0) return existing;

  const result = await withRetry(() =>
    chat(
      [
        { role: 'system', content: NORMALIZATION_PROMPT },
        {
          role: 'user',
          content: `NEW_MARKERS: ${JSON.stringify(unknownNames)}\nEXISTING_HISTORY: ${JSON.stringify(existingNames)}`,
        },
      ],
      {
        temperature: 0,
        format: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
    ),
  );

  const newMap = JSON.parse(result) as NormalizationMap;
  updateNormalizationMap(newMap);
  return { ...existing, ...newMap };
}
