// @ts-nocheck
import * as React from 'react'
import { TradingViewStockChartWidget } from 'react-tradingview-components';
import { colors } from 'src/styles';
import styled from 'styled-components'
import { formatFixedDecimals, divide, } from 'src/helpers/bignumber';


const SPriceChart = styled.div`
  
  color: white;
  border: 1px solid rgb(${colors.grey});
  border-radius: 8px;
  background-color: rgb(${colors.white});
`
const SHelper = styled.div`
    font-size: x-small;
`

const SInActiveTimeFrame = styled.span`
  cursor: pointer;
`

interface IPriceChartState {
  pendingRequest: boolean;
  error: string;
  priceInterval: any;
}

const INITIAL_STATE: IPriceChartState = {
  pendingRequest: false,
  error: "",
  priceInterval: null,
};

class PriceChart extends React.Component<any, any> {

  public state: IPriceChartState;

  constructor(props: any) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };
  }

  public copAlert() {
    alert("COP: Current Onchain Price. The exact strike price your option should be at if you initiate a transaction now.");
  }

  public render() {
    const { error } = this.state;
    const { pair, currentPrice } = this.props;
    const wide = window.innerWidth > window.innerHeight;
    const darkMode = localStorage.getItem('darkMode');
    return (
      <SPriceChart>
        {
          error !== "" ?
            <SHelper style={{ color: `rgb(${colors.red})` }}>{error}</SHelper>
            :
            <>
              <SHelper style={{ color: `rgb(${colors.black})` }}>
                <span style={{ fontSize: "large", fontWeight: "400" }}>COP<span style={{ cursor: "pointer", fontWeight: "bold" }} onClick={() => this.copAlert()}>ⓘ</span>:
                ${formatFixedDecimals(divide(currentPrice, 100000000), 3)} USD
              </span>
              </SHelper>
              <div style={{ width: "100%" }}>
                {
                  darkMode === "true" ?
                    <TradingViewStockChartWidget
                      symbol={pair}
                      theme={"Dark"}
                      range='12m'
                    />
                    :

                    <TradingViewStockChartWidget
                      symbol={pair}
                      range='12m'
                      theme="Light"
                    />
                }
              </div>
            </>
        }
      </SPriceChart>
    )
  }

}

export default PriceChart
