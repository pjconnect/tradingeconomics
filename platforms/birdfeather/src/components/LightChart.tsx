import { useRef, useEffect, Fragment } from "react";
import { createChart, ColorType, LineSeries, type TimeChartOptions, type DeepPartial } from 'lightweight-charts';
import type { HistoricalData } from "../types";
import LoadingSpinner from "./LoadingSpinner";
import { useTheme } from "../context/ThemeContext";

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
    const chartRef = useRef<any>(null);
    const { theme } = useTheme();

    const defaultChartOptions = {
        layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: theme == 'light' ? 'black' : 'white',
        },
        grid: {
            vertLines: { color: '#46464680' },
            horzLines: { color: '#46464680' },
        },
    } as DeepPartial<TimeChartOptions>;
    

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
        chartRef.current = chart;

        if (chart === null) {
            return;
        }

        // Format data for the chart
        historicalData.pop(); //temp fix last item empty, so the chart won't jump to value 0.
        const formattedData = historicalData.map(item => ({
            time: item.DateTime.split('T')[0], // Format: YYYY-MM-DD
            value: item.Value
        }));

        // Add line series to the chart
        const lineSeries = chart?.addSeries?.(LineSeries);

        // Set the data
        lineSeries.setData(formattedData);

        // Add resize event listener
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth
                });
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
            }
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
            <div className="my-20 text-center p-8 bg-card rounded-lg">
                <p>No historical data available for {selectedIndicator}</p>
            </div>
        );
    }

    return (
        <div className="my-20 flex justify-center items-center h-80 rounded-lg">
            <div ref={chartContainerRef} className="w-full h-[400px]"></div>
        </div>
    );


};



export default LightChart;