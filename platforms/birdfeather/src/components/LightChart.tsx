import { useRef, useEffect, Fragment } from "react";
import { createChart, ColorType, LineSeries, type TimeChartOptions, type DeepPartial } from 'lightweight-charts';
import type { HistoricalData } from "../types";
import LoadingSpinner from "./LoadingSpinner";

interface LightChartProps {
    historicalData: HistoricalData[];
    loading: boolean;
    selectedIndicator: string;
}

const LightChart: React.FC<LightChartProps> = ({
    historicalData,
    loading,
    selectedIndicator
}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    // Initialize and update chart when historical data changes
    useEffect(() => {
        if (!historicalData.length || !chartContainerRef.current) return;

        chartContainerRef.current.innerHTML = ''; // Clear previous chart

        const chartOptions = {
            ...defaultChartOptions,
            width: chartContainerRef.current.clientWidth,
            height: 400,
        };

        // Create chart instance
        const chart = createChart(chartContainerRef.current, chartOptions) as any;
        if (chart === null) {
            return;
        }

        // Format data for the chart
        const formattedData = historicalData.map(item => ({
            time: item.DateTime.split('T')[0], // Format: YYYY-MM-DD
            value: item.Value
        }));

        // Add line series to the chart
        const lineSeries = chart?.addSeries?.(LineSeries);

        // Set the data
        lineSeries.setData(formattedData);

        // Cleanup function
        return () => {
            chart.remove();
        };
    }, [historicalData]);

    if (!selectedIndicator) {
        return <Fragment />;
    }


    if (loading) {
        return (
            <div className="my-20 flex justify-center items-center h-80">
                <LoadingSpinner />
            </div>
        );
    }

    if (historicalData.length === 0) {
        return (
            <div className="my-20  text-center p-8 bg-card rounded-lg">
                <p>No historical data available for {selectedIndicator}</p>
            </div>
        );
    }

    return (
        <div className="my-20  flex justify-center items-center h-80 rounded-lg">
            <div ref={chartContainerRef} className="w-full h-[400px]"></div>
        </div>
    );
};


const defaultChartOptions = {
    layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'text-default/50',
    },
    grid: {
        vertLines: {
            color: 'text-default/20',
        },
        horzLines: {
            color: 'text-default/20',
        },
    },
} as DeepPartial<TimeChartOptions>;

export default LightChart;