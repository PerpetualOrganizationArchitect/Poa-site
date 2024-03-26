import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useRouter } from "next/router";
import { useMetaMask } from './Metamask';
import NextLink from 'next/link';
import { useGraphContext } from '@/context/graphContext';

const LoginButton = () => {
    const { setChecked } = useMetaMask();

    const {account}= useGraphContext();
    
    const router = useRouter();
    const { userDAO } = router.query;

    const [isMounted, setIsMounted] = useState(false); // new state to track mounting
    const [text, setText] = useState("Connect Wallet");

    // Effect to set text based on accounts, only runs on client side after mount
    useEffect(() => {
        // This runs only on the client, after the component has mounted
        console.log("accounts", account);
        if (account !=="0x00") {
            setText("Connected");
        } else {
            console.log("accounts", account);
            setText("Connect Wallet");
        }
    }, [account]);

    // Effect to set isMounted to true when component mounts
    useEffect(() => {
        setIsMounted(true); // Set mounted state to true
    }, []); // Empty dependency array ensures this only runs on mount

    // Conditional rendering based on the isMounted state
    if (!isMounted) {
        // If the component hasn't mounted yet, render nothing or a placeholder
        return null;
    }

    return (
        <NextLink href={`/user/?userDAO=${userDAO}`} passHref>
            <Button
                bgGradient="linear(to-r, teal.300, green.300)"
                color="white"
                _hover={{
                    bgGradient: "linear(to-r, teal.600, green.600)",
                }}
                _active={{
                    bgGradient: "linear(to-r, teal.700, green.700)",
                }}
                borderRadius="full"
                px="6"
                py="2"
                fontSize="lg"
                fontWeight="bold"
                textColor="black"
                onClick={(e) => {
                        setChecked(false);
                
                }}
            >
                {text}
            </Button>
        </NextLink>
    );
};

export default LoginButton;
