
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionInfo } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = 'gemini-2.5-flash';

const nutritionSchema = {
    type: Type.OBJECT,
    properties: {
        foodName: {
            type: Type.STRING,
            description: "The name of the food item identified in the image."
        },
        calories: {
            type: Type.NUMBER,
            description: "Estimated number of calories."
        },
        protein: {
            type: Type.NUMBER,
            description: "Estimated grams of protein."
        },
        carbs: {
            type: Type.NUMBER,
            description: "Estimated grams of carbohydrates."
        },
        fat: {
            type: Type.NUMBER,
            description: "Estimated grams of fat."
        }
    },
    required: ["foodName", "calories", "protein", "carbs", "fat"],
};


export const analyzeFoodImage = async (base64Image: string): Promise<NutritionInfo> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }
    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: 'image/jpeg',
            },
        };

        const textPart = {
            text: "Analyze this image of food and provide its nutritional information. Be as accurate as possible. If it's not food, return zeros for all nutritional values and 'Not a food item' as the name."
        };
        
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: nutritionSchema,
            }
        });

        const jsonString = response.text;
        const nutritionData = JSON.parse(jsonString) as NutritionInfo;

        return nutritionData;

    } catch (error) {
        console.error("Error analyzing image with Gemini API:", error);
        throw new Error("Failed to analyze image. Please try again.");
    }
};
