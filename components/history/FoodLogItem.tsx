
import React from 'react';
import { FoodLog } from '../../types';

interface FoodLogItemProps {
    log: FoodLog;
}

const FoodLogItem: React.FC<FoodLogItemProps> = ({ log }) => {
    const logTime = new Date(log.createdAt).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
            {log.imageUrl && <img src={log.imageUrl} alt={log.foodName} className="w-16 h-16 rounded-md object-cover" />}
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-800 capitalize">{log.foodName}</h4>
                    <p className="text-sm text-gray-400">{logTime}</p>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <p><span className="font-bold text-green-600">{log.calories.toFixed(0)}</span> kcal</p>
                    <p><span className="font-bold text-sky-500">{log.protein.toFixed(0)}</span> P</p>
                    <p><span className="font-bold text-orange-500">{log.carbs.toFixed(0)}</span> C</p>
                    <p><span className="font-bold text-yellow-500">{log.fat.toFixed(0)}</span> F</p>
                </div>
            </div>
        </div>
    );
};

export default FoodLogItem;
