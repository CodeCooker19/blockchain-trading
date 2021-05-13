import * as React from "react";
import styled from "styled-components";
import { colors } from 'src/styles';
import { callBIOPAllowance, callBIOPBalance, sendBIOPApprove, sendDGovWithdraw, sendDGovStake, callDGovStaked} from "../../helpers/web3";
import Button from "../Button";
import Loading from "../Loading"
import {DGOV_CONTRACT} from "../../constants";

import Input from "../Input";
import {  convertAmountFromRawNumber } from 'src/helpers/bignumber';

const SStakeBIOP = styled.div`
    width:100%;
    height:100%;
    margin-bottom: 5%;
`
const SHelper = styled.div`
    font-size: x-small;
`

const SRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 40px;
    margin: 5px;
`
const SCol = styled.div`
    display: flex;
    flex-direction: column;
`

const SLarge = styled.span`
    font-size: 40px;
`

interface IStakeBIOPProps {
    address: string
    chainId: number
    web3: any
}


interface IStakeBIOPState {
    address: string;
    web3: any;
    chainId: number;
    pendingRequest: boolean;
    error: string;
    approved: number;
    biopBalance: number;
    loading: boolean;
    amountToStake: number;
    staked: number;
}

const INITIAL_STATE: IStakeBIOPState = {
    address: "",
    web3: null,
    chainId: 1,
    pendingRequest: false,
    error: "",
    biopBalance: 0,
    approved: 0,
    loading: false,
    amountToStake: 0,
    staked: 0
};
class StakeBIOP extends React.Component<any, any> {
    // @ts-ignore
    public state: IStakeBIOPState;

    constructor(props: IStakeBIOPProps) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
        this.state.web3 = props.web3;
        this.state.address = props.address;
        this.state.chainId = props.chainId;
    }

    public componentDidMount() {
        this.getApproved();
        this.getCurrentBalance();
    }


    public async getCurrentBalance() {
        const {chainId, web3, address} = this.state;
        
        
        console.log(`getting balcen with id ${chainId}`);
        const biopBalance = await callBIOPBalance(address, chainId, web3);
        const staked = await callDGovStaked(address, chainId, web3);


            
            console.log("presend");
            
            console.log(biopBalance);
            this.setState({biopBalance, staked});
    }

    public async getApproved() {
        const {chainId, web3, address} = this.state;
        const approved = await callBIOPAllowance(DGOV_CONTRACT[chainId].address, address, chainId, web3);
        this.setState({approved})
    }


    public handleApprove() {
        this.setState({loading: true});
        const {address, web3, chainId} = this.state;
        sendBIOPApprove(DGOV_CONTRACT[chainId].address, address, chainId, web3, (res: any) => {

            this.getApproved();
            this.getCurrentBalance();
            this.setState({loading: false});
        })

    }
    public handleStake() {
        const {address, web3, chainId, biopBalance, amountToStake} = this.state;
        if ( amountToStake <= 0) {
            this.setState({error: "Invalid Amount To Stake"});
        } else if (amountToStake > biopBalance) {
            this.setState({error: "Insufficent Balance To Stake"});
        } else {
            this.setState({loading: true});
            sendDGovStake(web3.utils.toWei(amountToStake, "ether"), address, chainId, web3, (res: any) => {

                this.getApproved();
                this.getCurrentBalance();
                this.setState({loading: false, error: ""});
                window.location.reload();
            })
        }
    }

    public handleWithdraw() {
        const {address, web3, chainId, amountToStake, staked} = this.state;
        if ( amountToStake <= 0) {
            this.setState({error: "Invalid Amount To Withdraw"});
        } else if (amountToStake > staked) {
            this.setState({error: "Insufficent Staked Balance To Withdraw"});
        } else {
            this.setState({loading: true});
            sendDGovWithdraw(web3.utils.toWei(amountToStake, "ether"), address, chainId, web3, (res: any) => {

                this.getApproved();
                this.getCurrentBalance();
                this.setState({loading: false, error: ""});
                window.location.reload();
            })
        }
    }

    

    public buttons() {
        const {approved, biopBalance} = this.state;
        
            
            console.log(`approved ${approved} ${biopBalance}`);
        if (approved >= biopBalance) {
            return <SRow ><><Button disabled>Approved✅</Button></><SLarge>→</SLarge><SCol><Button onClick={() => this.handleStake()}>Stake</Button><Button onClick={() => this.handleWithdraw()}>Withdraw</Button></SCol></SRow>;
        } else {
            return <SRow><><Button onClick={()=> this.handleApprove()}>Approve</Button></><SLarge>→</SLarge><SCol><Button disabled>Stake</Button><Button disabled>Withdraw</Button></SCol></SRow>;
        }
    }


  
   


    public render() {
        const { loading, amountToStake, error, staked} = this.state;
        return(
            <SStakeBIOP>
                
                <h3>Stake</h3>
                <p>Staked: <b>{convertAmountFromRawNumber(staked, 18)} BIOP</b></p>
                <SHelper>Stake your $BIOP to claim rewards in ETH from every option created.</SHelper>
                {loading ?
                <Loading/>
                :
                <div >
               <Input id="amountToStake" value={amountToStake} onChange={(e: any) => {this.setState({amountToStake: e.target.value})}} placeholder="Amount To Stake (in BIOP)"/> 
                <SHelper style={{color: `rgb(${colors.red})`}}>{error}</SHelper>
                {this.buttons()}
                </div>
                }
            </SStakeBIOP>

        )
    }

}

export default StakeBIOP