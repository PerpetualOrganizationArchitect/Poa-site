import React from 'react';
import { useWeb3Context } from '@/context/web3Context';
import {usePOContext} from '@/context/POContext';
import { ethers } from 'ethers';

const TestPage = () => {
    const { sendToTreasury } = useWeb3Context(); 
    const {treasuryContractAddress} = usePOContext();

    const handleSendToTreasury = async () => {
       
        const tokenAddress = "0x0000000000000000000000000000000000001010";
        const amount = ethers.utils.parseUnits("0.001", 18); 

        try {
            console.log("address", treasuryContractAddress)
            await sendToTreasury('0x195059d32b75cdb9b15ca4d0af53c8c3a4ad604e', tokenAddress, amount);
            console.log("Tokens sent to treasury");
        } catch (error) {
            console.error("Error sending tokens to treasury:", error);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: "200px" }}>
                <img src="/images/high_res_poa.png" alt="POA Image" width={"20%"} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: "20px" }}>
                <button onClick={handleSendToTreasury}>Send to Treasury</button>
            </div>
        </div>
    );
};

export default TestPage;
