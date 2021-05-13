import * as React from "react";
import styled from "styled-components";
import { colors } from 'src/styles';
import { sendDGovDelegate, callDGovRep, sendDGovUnDelegate} from "../../helpers/web3";
import Button from "../Button";
import Loading from "../Loading"
import { ellipseAddress } from "../../helpers/utilities";
import Input from "../Input";

const SDelegate = styled.div`
    width:100%;
    height:100%;
    margin-bottom: 5%;
`
const SHelper = styled.div`
    font-size: x-small;
`


interface IDelegateProps {
    address: string
    chainId: number
    web3: any
}


interface IDelegateState {
    address: string;
    web3: any;
    chainId: number;
    pendingRequest: boolean;
    error: string;
    approved: number;
    newRep: string;
    loading: boolean;
    currentRep: string;
}

const INITIAL_STATE: IDelegateState = {
    address: "",
    web3: null,
    chainId: 1,
    pendingRequest: false,
    error: "",
    newRep: "",
    approved: 0,
    loading: false,
    currentRep: ""
};
class Delegate extends React.Component<any, any> {
    // @ts-ignore
    public state: IDelegateState;

    constructor(props: IDelegateProps) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
        this.state.web3 = props.web3;
        this.state.address = props.address;
        this.state.chainId = props.chainId;
    }

    public componentDidMount() {
        this.getCurrentRep();
    }


    public async getCurrentRep() {
        const {chainId, web3, address} = this.state;
        
        const currentRep = await callDGovRep(address, chainId, web3);
        this.setState({currentRep});
    }



    public handleDelegate() {
        const {address, web3, chainId, newRep} = this.state;
        if (web3.utils.isAddress(newRep)) {
            this.setState({loading: true});
            sendDGovDelegate(newRep, address, chainId, web3, (res: any) => {
                this.getCurrentRep();
                this.setState({loading: false, error: ""});
            })
        } else {
            this.setState({error: "Invalid Address"})
        }
    }

    public handleUnDelegate() {
        const {address, web3, chainId} = this.state;
            this.setState({loading: true});
            sendDGovUnDelegate(address, chainId, web3, (res: any) => {
                this.getCurrentRep();
                this.setState({loading: false, error: ""});
            })
    }

    

    public render() {
        const { loading, error, currentRep, newRep} = this.state;
        return(
            <SDelegate>
                
                <h3>Delegate</h3>

                <SHelper>Align your staked BIOP voting power with any address.</SHelper>
                <p>Rep: <b><a target="_" href={`https://etherscan.io/address/${currentRep}`}>{ellipseAddress(currentRep)}</a></b></p>
                
                {loading ?
                <Loading/>
                :
                <div>
                <SHelper style={{color: `rgb(${colors.red})`}}>{error}</SHelper>
                <Input id="newRep" value={newRep} placeholder="Address to delegate votes to" onChange={(e: any)=> {this.setState({newRep: e.target.value})}}/>
                <br/> <Button onClick={()=>this.handleDelegate()}>Delegate</Button><Button onClick={() => this.handleUnDelegate()}>Undelegate</Button> </div>
                }
            </SDelegate>

        )
    }

}

export default Delegate