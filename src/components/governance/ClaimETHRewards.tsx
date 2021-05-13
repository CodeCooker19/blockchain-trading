import * as React from "react";
import styled from "styled-components";
import { colors } from 'src/styles';
import { callDGovPendingETH, sendBIOPApprove} from "../../helpers/web3";
import Button from "../Button";
import Loading from "../Loading"
import {DGOV_CONTRACT} from "../../constants";

import {  convertAmountFromRawNumber } from 'src/helpers/bignumber';

const SClaimETHRewards = styled.div`
    width:100%;
    height:100%;
    margin-bottom: 5%;
`
const SHelper = styled.div`
    font-size: x-small;
`


interface IClaimETHRewardsProps {
    address: string
    chainId: number
    web3: any
}


interface IClaimETHRewardsState {
    address: string;
    web3: any;
    chainId: number;
    pendingRequest: boolean;
    error: string;
    approved: number;
    pendingETH: number;
    loading: boolean;
    staked: number;
}

const INITIAL_STATE: IClaimETHRewardsState = {
    address: "",
    web3: null,
    chainId: 1,
    pendingRequest: false,
    error: "",
    pendingETH: 0,
    approved: 0,
    loading: false,
    staked: 0
};
class ClaimETHRewards extends React.Component<any, any> {
    // @ts-ignore
    public state: IClaimETHRewardsState;

    constructor(props: IClaimETHRewardsProps) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
        this.state.web3 = props.web3;
        this.state.address = props.address;
        this.state.chainId = props.chainId;
    }

    public componentDidMount() {
        this.getCurrentBalance();
    }


    public async getCurrentBalance() {
        const {chainId, web3, address} = this.state;
        
        const pendingETH = await callDGovPendingETH(address, chainId, web3);
        this.setState({pendingETH});
    }



    public handleClaim() {
        this.setState({loading: true});
        const {address, web3, chainId} = this.state;
        sendBIOPApprove(DGOV_CONTRACT[chainId].address, address, chainId, web3, (res: any) => {
            this.getCurrentBalance();
            this.setState({loading: false});
        })

    }

    

  
  
   


    public render() {
        const { loading, error, pendingETH} = this.state;
        return(
            <SClaimETHRewards>
                
                <h3>Claim ETH</h3>

                <SHelper>Claim ETH earned from your staked BIOP.</SHelper>
                <p>Claims: <b>{convertAmountFromRawNumber(pendingETH, 18)} ETH</b></p>
                {loading ?
                <Loading/>
                :
                <div >
                <SHelper style={{color: `rgb(${colors.red})`}}>{error}</SHelper>
                <Button onClick={() => this.handleClaim()}>Claim</Button>
                </div>
                }
            </SClaimETHRewards>

        )
    }

}

export default ClaimETHRewards