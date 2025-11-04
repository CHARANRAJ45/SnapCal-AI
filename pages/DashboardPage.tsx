
import React, { useState, useEffect, useCallback } from 'react';
import { FoodLog, NutritionInfo } from '../types';
import { useAuth } from '../hooks/useAuth';
import DailyProgress from '../components/dashboard/DailyProgress';
import CameraView from '../components/dashboard/CameraView';
import NutritionResult from '../components/dashboard/NutritionResult';
import { analyzeFoodImage } from '../services/geminiService';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import FoodLogItem from '../components/history/FoodLogItem';

const DashboardPage: React.FC = () => {
    const { user, getFoodLogs, addFoodLog } = useAuth();
    const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(true);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{ nutrition: NutritionInfo, image: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = useCallback(async () => {
        setIsLoadingLogs(true);
        try {
            const logs = await getFoodLogs();
            setFoodLogs(logs);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingLogs(false);
        }
    }, [getFoodLogs]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handlePhotoCaptured = async (imageDataUrl: string) => {
        setIsCameraOpen(false);
        setIsAnalyzing(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const base64Image = imageDataUrl.split(',')[1];
            const result = await analyzeFoodImage(base64Image);
            setAnalysisResult({ nutrition: result, image: imageDataUrl });
        } catch (err: any) {
            setError(err.message || "Failed to analyze image.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAddLog = async () => {
        if (analysisResult) {
            await addFoodLog({ ...analysisResult.nutrition, imageUrl: analysisResult.image });
            setAnalysisResult(null);
            fetchLogs(); // Refresh logs
        }
    };
    
    const today = new Date().toISOString().split('T')[0];
    const todaysLogs = foodLogs.filter(log => log.createdAt.startsWith(today));
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.email.split('@')[0]}!</h1>
            
            <DailyProgress logs={todaysLogs} />

            <div className="text-center">
                 <Button onClick={() => setIsCameraOpen(true)} size="large">
                    {/* Fix: Replaced 'class' with 'className' for React compatibility. */}
                    <ion-icon name="camera" className="mr-2 text-xl"></ion-icon>
                    Analyze Meal
                </Button>
            </div>

            {isAnalyzing && <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-md"><Spinner /><p className="mt-2 text-gray-600">AI is analyzing your meal...</p></div>}
            {error && <div className="p-4 text-center text-red-700 bg-red-100 rounded-lg">{error}</div>}
            
            {analysisResult && (
                <NutritionResult
                    result={analysisResult.nutrition}
                    image={analysisResult.image}
                    onConfirm={handleAddLog}
                    onCancel={() => setAnalysisResult(null)}
                />
            )}

            {isCameraOpen && (
                <CameraView
                    onClose={() => setIsCameraOpen(false)}
                    onCapture={handlePhotoCaptured}
                />
            )}

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Log</h2>
                 {isLoadingLogs ? (
                    <Spinner />
                ) : todaysLogs.length > 0 ? (
                    <div className="space-y-3">
                        {todaysLogs.slice(0, 3).map(log => <FoodLogItem key={log.id} log={log} />)}
                    </div>
                ) : (
                    <p className="text-gray-500 bg-white p-6 rounded-xl shadow-sm text-center">No meals logged yet today. Let's add one!</p>
                )}
            </div>

        </div>
    );
};

export default DashboardPage;
