
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Goal } from '../types';
import { useAuth } from '../hooks/useAuth';
import { GOAL_DESCRIPTIONS, GOAL_CALORIE_TARGETS } from '../constants';
import Button from '../components/common/Button';

const GoalCard: React.FC<{ goal: Goal; isSelected: boolean; onSelect: (goal: Goal) => void }> = ({ goal, isSelected, onSelect }) => {
    const { title, description } = GOAL_DESCRIPTIONS[goal];
    const calories = GOAL_CALORIE_TARGETS[goal];
    const selectedClasses = isSelected ? 'ring-2 ring-green-500 bg-green-50' : 'bg-white hover:bg-slate-50';

    return (
        <button
            onClick={() => onSelect(goal)}
            className={`p-6 rounded-xl shadow-md text-left transition-all duration-200 w-full ${selectedClasses}`}
        >
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
            <p className="text-xs text-gray-400 mt-2">{calories} kcal / day</p>
        </button>
    );
};


const GoalPage: React.FC = () => {
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const { setGoal, loading } = useAuth();
    const navigate = useNavigate();

    const handleSaveGoal = async () => {
        if (selectedGoal) {
            await setGoal(selectedGoal);
            navigate('/');
        }
    };

    return (
        <div className="text-center max-w-lg mx-auto">
            <h1 className="text-3xl font-bold text-gray-900">What's Your Goal?</h1>
            <p className="mt-2 text-gray-600">Select a goal to personalize your daily calorie target.</p>
            <div className="mt-8 space-y-4">
                {(Object.keys(GOAL_DESCRIPTIONS) as Goal[]).map((goal) => (
                    <GoalCard
                        key={goal}
                        goal={goal}
                        isSelected={selectedGoal === goal}
                        onSelect={setSelectedGoal}
                    />
                ))}
            </div>
            <div className="mt-8">
                <Button onClick={handleSaveGoal} disabled={!selectedGoal || loading}>
                    {loading ? 'Saving...' : 'Continue'}
                </Button>
            </div>
        </div>
    );
};

export default GoalPage;
