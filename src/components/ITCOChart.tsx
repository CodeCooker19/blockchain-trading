import * as React from 'react'
import { colors } from 'src/styles';
import styled from 'styled-components'
import { Chart } from "react-google-charts";
import { greaterThanOrEqual, divide } from "../helpers/bignumber";
import { DEFAULT_LANG } from 'src/constants';
import i18n from "../i18n";

const SPriceChart = styled.div`
  background: #F6F6F6;
  box-shadow: 0px 11px 10px #00000029;
  padding: 10px;
  width: 400px;
  border-radius: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const SHelper = styled.div`
  font-size: x-small;
`


interface IPriceChartState {
  pendingRequest: boolean;
  data: any;
  error: string;
  locale: string;
}

const INITIAL_STATE: IPriceChartState = {
  pendingRequest: false,
  error: "",
  data: {},
  locale: DEFAULT_LANG
};

class ITCOChart extends React.Component<any, any> {

  public state: IPriceChartState;

  constructor(props: any) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };
  }

  public componentDidMount() {
    this.getInitialData();
    const locale = localStorage.getItem('locale');
    this.setState({ locale: locale !== null ? locale : DEFAULT_LANG })
  }



  public async getInitialData() {

    try {
      this.setState({ pendingRequest: true, error: "" });

      const { tier } = this.props;
      const prices = [80000000000000, 90000000000000, 100000000000000, 110000000000000, 120000000000000, 130000000000000];

      const x: any = [['Tier Number', '', ''],];
      for (let i = 1; i < 7; i++) {
        x.push([i, greaterThanOrEqual(tier, i) ? parseFloat(divide(prices[i - 1], 1000000000000000000)) : parseFloat("0"), greaterThanOrEqual(tier, i) ? parseFloat("0") : parseFloat(divide(prices[i - 1], 1000000000000000000))])
      }


      console.log("set graph data to:");

      console.log(x);


      console.log(`tier is : ${tier} type ${typeof (tier)}`);
      this.setState({
        pendingRequest: false,
        data: x,
      });
    } catch (e) {

      console.log(e);
      this.setState({ pendingRequest: false, error: "Request failed" });

    }
  }


  public render() {
    const { error, data, locale } = this.state;

    const wide = window.innerWidth > window.innerHeight;
    return (
      <SPriceChart>
        {
          error !== "" ?
            <SHelper style={{ color: `rgb(${colors.red})` }}>{error}</SHelper>
            :
            <div style={{}}>
              <Chart
                width={wide ?
                  "100%" : window.innerWidth - 20
                }
                height={"25vh"}
                chartType="SteppedAreaChart"
                loader={<div>{i18n[locale].LOADINGCHART}</div>}
                data={data}
                options={{
                  title: `IBCO ${i18n[locale].TIERS}`,
                  vAxis: { title: 'ETH/BIOP' },
                  isStacked: true,
                }}
                rootProps={{ 'data-testid': '1' }}
              />
            </div>
        }
      </SPriceChart>
    )
  }

}

export default ITCOChart
