import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import WardenSidebar from './WardenSidebar';

const MonthlyAtt = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [outingData, setOutingData] = useState([]);
    const [outingCount, setOutingCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const wardenId = JSON.parse(localStorage.getItem("data")).id
    console.log(wardenId);
    

    useEffect(() => {
        fetchMonthlyOutings();
    }, [year, month]);

    const fetchMonthlyOutings = async () => {
        try {
            setLoading(true);
            const response = await api.get(`warden/outings/monthly/${wardenId}?year=${year}&month=${month}`);
            const data = response.data;

            if (data.status === 'success') {
                setOutingData(data.outingDetails);
                setOutingCount(data.outingCount);
                setError('');
            } else {
                setError(data.message || 'Failed to fetch data');
            }
        } catch (err) {
            setError('Data not Found');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <WardenSidebar />

            <div className="flex-1 ml-64 p-8">
                <h2 className="text-xl font-bold mb-4">Monthly Outings - {month}/{year}</h2>

                <div className="mb-4 flex items-center space-x-4">
                    <div>
                        <label className="mr-2 font-medium">Year:</label>
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="border p-1 rounded"
                        />
                    </div>
                    <div>
                        <label className="mr-2 font-medium">Month:</label>
                        <input
                            type="number"
                            min="1"
                            max="12"
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                            className="border p-1 rounded"
                        />
                    </div>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <div>
                        <p className="font-semibold mb-2">Total Outings: {outingCount}</p>
                        <table className="min-w-full border text-sm">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="border px-2 py-1">Name</th>
                                    <th className="border px-2 py-1">Reason</th>
                                    <th className="border px-2 py-1">Date From</th>
                                    <th className="border px-2 py-1">Date To</th>
                                    <th className="border px-2 py-1">Status</th>
                                    <th className="border px-2 py-1">Approved On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {outingData.map((outing, index) => (
                                    <tr key={index}>
                                        <td className="border px-2 py-1">{outing.studentName}</td>
                                        <td className="border px-2 py-1">{outing.reason}</td>
                                        <td className="border px-2 py-1">{outing.dateFrom}</td>
                                        <td className="border px-2 py-1">{outing.dateTo}</td>
                                        <td className="border px-2 py-1">{outing.status}</td>
                                        <td className="border px-2 py-1">{outing.dateApproved || 'Pending'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MonthlyAtt;
