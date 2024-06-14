import React from 'react';
import { useWeb3Context } from '@/context/web3Context';
import NetworkSwitchModal  from '@/components/NetworkSwitchModal';

const NetworkModalControl = () => {
    const { isNetworkModalOpen, closeNetworkModal } = useWeb3Context();

    return (
        <NetworkSwitchModal isOpen={isNetworkModalOpen} onClose={closeNetworkModal} />
    );
};

export default NetworkModalControl;
