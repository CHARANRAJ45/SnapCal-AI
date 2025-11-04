
import React from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { FoodLog, Goal } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { GOAL_CALORIE_TARGETS } from '../../constants';

interface DailyProgressProps {
    logs: FoodLog[];
}

const DailyProgress: React.FC<DailyProgressProps> = ({ logs }) => {
    const { user } = useAuth();

    const totalCalories = logs.reduce((sum, log) => sum + log.calories, 0);
    const calorieGoal = user?.goal ? GOAL_CALORIE_TARGETS[user.goal] : 2000;
    
    const percentage = Math.min(Math.round((totalCalories / calorieGoal) * 100), 150);

    const data = [{ name: 'Calories', value: percentage }];

    const getMotivationalMessage = () => {
        if (percentage < 25) return "Let's get started on a great day!";
        if (percentage < 75) return "You're doing great, keep it up!";
        if (percentage <= 100) return "Almost there! Finishing strong.";
        return "Goal reached! Amazing work.";
    };
    
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800">Daily Progress</h2>
                <p className="text-gray-500 mt-1">{getMotivationalMessage()}</p>
                <div className="mt-4 text-4xl font-extrabold text-green-600">
                    {totalCalories}
                    <span className="text-lg font-medium text-gray-500 ml-1">/ {calorieGoal} kcal</span>
                </div>
            </div>
            <div className="w-48 h-48 mt-4 md:mt-0">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        innerRadius="70%"
                        outerRadius="100%"
                        data={data}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            angleAxisId={0}
                            tick={false}
                        />
                        <RadialBar
                            background
                            dataKey="value"
                            cornerRadius={10}
                            className="fill-green-500"
                        />
                         <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-3xl font-bold fill-gray-700"
                        >
                            {`${Math.round((totalCalories / calorieGoal) * 100)}%`}
                        </text>
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DailyProgress;
