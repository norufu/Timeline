import React, { useEffect, useState } from 'react';
import XAxis from './XAxis';

export default function Bars({barCount, barWidth, barHeightStart, data}) {
    const [bars, setBars] = useState();

    useEffect(() => {
        console.log(barWidth);
        let barArr = new Array(barCount).fill(0).map((_, index) => {
            let gradient = 150-index*10;
            let colour = "rgba(" + gradient + "," + gradient + "," + gradient +")"
            let height = Math.floor(Math.random() * (barHeightStart - 1 + 1) + 1); //will be based on data in future
            return (<rect key={index} x={index*barWidth} y={barHeightStart-height} width={barWidth} height={height}
            style={{fill: colour, stroke: "pink", stroke: 1 }} />)
        })

        setBars(barArr);
    }, []);

    return (<>{bars}</>)
}