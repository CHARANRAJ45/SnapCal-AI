
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FoodLog } from '../types';
import Spinner from '../components/common/Spinner';
import FoodLogItem from '../components/history/FoodLogItem';

const HistoryPage: React.FC = () => {
    const { getFoodLogs } = useAuth();
    const [logs, setLogs] = useState<FoodLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const historyLogs = await getFoodLogs();
                setLogs(historyLogs);
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const groupedLogs = useMemo(() => {
        return logs.reduce((acc, log) => {
            const date = new Date(log.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(log);
            return acc;
        }, {} as Record<string, FoodLog[]>);
    }, [logs]);

    if (loading) {
        return <div className="flex justify-center mt-10"><Spinner /></div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Food Log History</h1>
            {Object.keys(groupedLogs).length > 0 ? (
                Object.entries(groupedLogs).map(([date, dateLogs]) => (
                    <div key={date}>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-slate-200">{date}</h2>
                        <div className="space-y-4">
                            {dateLogs.map(log => <FoodLogItem key={log.id} log={log} />)}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 mt-10">Your food log history is empty.</p>
            )}
        </div>
    );
};

export default HistoryPage;
