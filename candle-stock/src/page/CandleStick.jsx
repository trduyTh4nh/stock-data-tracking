import React from 'react';
import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { fitWidth } from "react-stockcharts/lib/helper";
import { timeIntervalBarWidth } from "react-stockcharts/lib/utils";
import { utcMinute, utcHour, utcDay } from "d3-time";

const CandleStickChart = ({ type, data, width, ratio, interval }) => {
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);

    const { data: chartData, xScale, xAccessor, displayXAccessor } = xScaleProvider(data);

    const timeInterval = interval === "1m" ? utcMinute
        : interval === "15m" ? utcMinute.every(15)
        : interval === "1h" ? utcHour
        : interval === "4h" ? utcHour.every(4)
        : utcDay; // default 1d

    const barWidth = timeIntervalBarWidth(timeInterval);

    return (
        <ChartCanvas 
            height={400} 
            width={width}
            ratio={ratio}
            margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
            type={type}
            seriesName="MSFT"
            data={chartData}
            xScale={xScale}
            xAccessor={xAccessor}
            displayXAccessor={displayXAccessor}>
            <Chart id={1} yExtents={d => [d.high, d.low]}>
                <XAxis axisAt="bottom" orient="bottom" />
                <YAxis axisAt="left" orient="left" ticks={5} />
                <CandlestickSeries width={barWidth} />
            </Chart>
        </ChartCanvas>
    );
};

export default fitWidth(CandleStickChart);
