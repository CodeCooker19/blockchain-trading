import * as React from 'react'
import styled from "styled-components";
import { Pie } from 'react-chartjs-2';
import { colors } from 'src/styles';
import { handleSignificantDecimals } from "../helpers/bignumber";

const SVis = styled.div`
width: 100%;
`
const SRow = styled.div`
display: flex;
flex-firection: row;
justify-content: space-between;
width: 100%;
`

const OptionVis = (props: any) => {

  function processCallPutData() {
    const { calls, puts } = props;

    return {
      labels: ['Calls', 'Puts'],
      datasets: [
        {
          label: '# of Options',
          data: [calls, puts],
          backgroundColor: [
            `rgb(${colors.fadedBlue})`,
            `rgb(${colors.fadedRed})`
          ],
          borderColor: [
            `rgba(${colors.blue} 1)`,
            `rgba(${colors.red} 1)`
          ],
          borderWidth: 1,
        },
      ],
    }
  }

  function processWinLossData() {
    const { exercised, expired } = props;
    return {
      labels: ['Exercised', 'Expired'],
      datasets: [
        {
          label: '# of Options',
          data: [exercised, expired],
          backgroundColor: [
            `rgb(${colors.fadedBlue})`,
            `rgb(${colors.fadedRed})`
          ],
          borderColor: [
            `rgba(${colors.blue} 1)`,
            `rgba(${colors.red} 1)`
          ],
          borderWidth: 1,
        },
      ],
    }
  }

  const { calls, puts, exercised, expired, avgValue } = props;

  console.log(`vising ${calls}, ${puts}, ${exercised}, ${expired}`);

  if (calls > 0 && puts > 0 && exercised > 0 && expired > 0) {
    return (

      <SVis>
        <h3>Snapshot Visualizations:</h3>
        <p>
          {avgValue > 0 ? `Average Option Value: ~${handleSignificantDecimals(avgValue, 6)} ETH` : ""}
          <br />
          <small style={{ color: `rgb(${colors.grey})` }}>(player bet + house value)</small>
        </p>
        <SRow>
          <div style={{ width: "300px", height: "600px" }}>
            <Pie data={processWinLossData()} />
          </div>
          <div style={{ width: "300px", height: "600px" }}>
            <Pie data={processCallPutData()} />
          </div>

        </SRow>
      </SVis>
    )
  } else {
    return (
      <p />
    )
  }
}

export default OptionVis