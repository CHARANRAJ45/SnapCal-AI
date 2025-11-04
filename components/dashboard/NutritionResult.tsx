
import React from 'react';
import { NutritionInfo } from '../../types';
import Button from '../common/Button';

interface NutritionResultProps {
    result: NutritionInfo;
    image: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const Stat: React.FC<{ label: string; value: number; unit: string; color: string }> = ({ label, value, unit, color }) => (
    <div className="flex flex-col items-center">
        <p className={`text-2xl font-bold ${color}`}>{value.toFixed(0)}</p>
        <p className="text-xs text-gray-500">{label} ({unit})</p>
    </div>
);

const NutritionResult: React.FC<NutritionResultProps> = ({ result, image, onConfirm, onCancel }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Analysis Complete!</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <img src={image} alt="Captured food" className="w-full md:w-1/3 h-auto rounded-lg object-cover" />
                <div className="flex-1 w-full">
                    <h3 className="text-xl font-semibold text-center md:text-left capitalize">{result.foodName}</h3>
                    <div className="my-4 p-4 bg-slate-50 rounded-lg flex justify-around items-center">
                        <div className="text-center">
                            <p className="text-4xl font-extrabold text-green-600">{result.calories.toFixed(0)}</p>
                            <p className="text-sm font-medium text-gray-500">Calories</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <Stat label="Protein" value={result.protein} unit="g" color="text-sky-500" />
                        <Stat label="Carbs" value={result.carbs} unit="g" color="text-orange-500" />
                        <Stat label="Fat" value={result.fat} unit="g" color="text-yellow-500" />
                    </div>
                </div>
            </div>
             <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button onClick={onConfirm} className="w-full">
                    {/* Fix: Replaced 'class' with 'className' for React compatibility. */}
                    <ion-icon name="add-circle" className="mr-2"></ion-icon>
                    Add to Daily Log
                </Button>
                <Button onClick={onCancel} variant="secondary" className="w-full">
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default NutritionResult;
