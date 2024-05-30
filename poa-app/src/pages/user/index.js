import React, { useState, useEffect } from "react";

import { useWeb3Context } from "@/context/web3Context";
// import MumbaiButton from "../components/userPage/importMumbai";
// import NFTButton from "@/components/userPage/importMemberNFT";
import { HStack, ScaleFade } from "@chakra-ui/react";
import NextLink from 'next/link';
import Navbar from "@/templateComponents/studentOrgDAO/NavBar";
import { useGraphContext } from "@/context/graphContext";

import { useRouter } from 'next/router';




import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  Flex,
  Heading,
  Link,
  Image,
  VStack,
} from "@chakra-ui/react";



const glassLayerStyle = {
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: -1,
  borderRadius: "inherit",
  backdropFilter: "blur(20px)",
  backgroundColor: "rgba(0, 0, 0, .6)",
};


const User = () => {



  const { account, nftMembershipContractAddress, hasMemberNFT, setLoaded, ddTokenContractAddress, fetchUsername} = useGraphContext();
  const router = useRouter();
  const { userDAO } = router.query;
  useEffect(() => {
      setLoaded(userDAO);
    }, [userDAO]);



  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [name, setName] = useState("");
  const[showMetaMaskMessage, setShowMetaMaskMessage]=useState(false);
  const[dispaly,setDispaly]=useState(true);

  const setDispalyHandle=()=>{
    // setDispaly(false);
    setLoading(true);

    async function mint(nftMembershipContractAddress, ddTokenContractAddress) {
      if (!nftMembershipContractAddress) return;
      try {
        await mintDefaultNFT(nftMembershipContractAddress);
      } catch (error) {
        console.error(error);
      }
      console.log("minting dd tokens", ddTokenContractAddress)
      if (!ddTokenContractAddress) return;
      try {
        await mintDDtokens(ddTokenContractAddress);
        
      } catch (error) {
        console.error(error);
      }

      setTimeout(() => {
        setLoading(false);
        router.push(`/dashboard/?userDAO=${userDAO}`);

      }, 2700);
    }
    mint(nftMembershipContractAddress, ddTokenContractAddress);

  }

  const setDispalyHandleNew=()=>{
    // setDispaly(false);
    setLoading(true);

    async function join(nftMembershipContractAddress, ddTokenContractAddress) {
      try{
        await createNewUser(newUsername);
      }catch(error){
        console.error(error);
      }

      if (!nftMembershipContractAddress) return;
      try {
        await mintDefaultNFT(nftMembershipContractAddress);
      } catch (error) {
        console.error(error);
      }
      console.log("minting dd tokens", ddTokenContractAddress)
      if (!ddTokenContractAddress) return;
      try {
        await mintDDtokens(ddTokenContractAddress);
        
      } catch (error) {
        console.error(error);
      }

      setTimeout(() => {
        setLoading(false);
        router.push(`/dashboard/?userDAO=${userDAO}`);

      }, 2700);


    }
    join(nftMembershipContractAddress, ddTokenContractAddress);

  }




  const [loading,setLoading]=useState(false);

  const [userDetails, setUserDetails] = useState(null);
  const{mintDDtokens,createNewUser, mintDefaultNFT,mintNFT, providerUniversal,signerUniversal, execNftBalance,balance,nftBalance, fetchBalance,web3, kubiMembershipNFTContract, contract,KUBIXbalance, kubiMembershipNFTAddress}=useWeb3Context();


  
  const toast = useToast();

  

    useEffect(() => {
          async function fetchUserDetails() {
            const userName = await fetchUsername(account);
            console.log("username", userName);
            setUsername(userName);
      }

      if (account!= null) {
        fetchUserDetails();

      }
    }, [account]);



    useEffect(() => {
    if (hasMemberNFT) {
          router.push(`/dashboard/?userDAO=${userDAO}`); 
      }
    }, [hasMemberNFT]);





  const mintMembershipNFT = async () => {
    if (!kubiMembershipNFTContract) return;
    try {

      await kubiMembershipNFTContract.mintMembershipNFT(account, 2023, 0, "yes")

      toast({ title: "Success", description: "Successfully minted Membership NFT", status: "success", duration: 5000, isClosable: true });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Error minting Membership NFT", status: "error", duration: 5000, isClosable: true });
    }
  };


  const handleJoin = async (e) => {
    
    setShowMetaMaskMessage(true);
    setLoading(true)
  
    if (web3 && account) {
      console.log("inital")
      const networkId = await web3.eth.net.getId();
      if (networkId !== 80001) {
        toast({
          title: "Wrong network",
          description: "Please switch to the Polygon Mumbai Network",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false)
        return;
      }
    }
  
    if (!email.endsWith("@ku.edu")) {
      toast({
        title: "Invalid email domain",
        description: "Please use a valid @ku.edu email",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false)
      return;
    }
  

  
    if (!contract) return;
  
    try {
      console.log("minting")
      await mintMembershipNFT();
      toast({
        title: "Success",
        description: "Successfully minted Membership NFT",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error minting Membership NFT",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false)
      return;
    }
  
    try {
      console.log("minting token")
      await contract.methods.mint(account).send({ from: account });
      const newBalance = await contract.methods.balanceOf(account).call();
      fetchBalance();
      toast({
        title: "Success",
        description: `Successfully minted ${newBalance} tokens`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error minting tokens",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    try {
      console.log("checkUsername")
      const checkUsername = await addUserData(account, name, username, email);
      if (checkUsername !== true) {
        toast({
          title: "Error",
          description: "Username already exists",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false)
        return;
      }
  
      toast({
        title: "Success",
        description: "Successfully added user information",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error adding user information",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false)
      return;
    }
  
    setLoading(false);
    e.target.disabled = false;
  };
  

  


  
  const renderJoinSteps = () => (
    <ScaleFade initialScale={0.8} in={true}>
      <VStack
        spacing={20}
        
        color={"ghostwhite"}
      >
    {isConnected && !isMember && (
      
      <Flex flexDirection="row" alignItems="center" justifyContent="center">
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          borderRadius="lg"
          boxShadow="lg"
          display="flex"
          w="100%"
          bg="transparent"
          position="relative"
          mr={6}
          p={6}
          zIndex={1}
          mt={4}
        >
          <div className="glass" style={glassLayerStyle} />

          <VStack fontWeight="bold"spacing={6} width="100%" align="flex-start">

          <Heading  as="h2" size="lg" mb={4}>
            How To Join the DAO
          </Heading>
          <Text fontSize="xl"  mb={4}>1. If you haven't added the polygon Mumbai testnet import it below:</Text>
          <MumbaiButton />
          <Text  fontSize="xl" mt={4} mb={4}>2. Copy your wallet adress: </Text>
          <Text  >{account}</Text>
          <Text  fontSize="xl" mt={4} mb={4}>and paste it to get free MATIC <Link href="https://mumbaifaucet.com/" isExternal fontWeight="bold" textDecoration="underline" color="blue.500">here</Link></Text>
        
          <Text  fontSize="xl" mt={4} mb={4}>3. Import the KUBIX coin here:</Text>
          <KubixButton />
          <Text mt ={4}  fontSize="xl" >4. Make sure to switch to the mumbai Network at the top of Metamask </Text>
          <Text mt ={4}  mb="5%" fontSize="xl" >5. Put in your information to the right and confirm the minting transaction on Metamask.</Text>
          </VStack>
        </Box>
        
          <Box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            borderRadius="lg"
            boxShadow="lg"
            w="100%"
            bg="transparent"
            position="relative"
            display="flex"
            p={6}
            zIndex={1}
            ml={6}
          >
             <div className="glass" style={glassLayerStyle} />
            <Heading as="h2" size="lg" mb={6} mt="4%" >
              Join KUBI DAO
            </Heading>
            <FormControl id="email" >
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="KU Email required" value={email} onChange={(event) => setEmail(event.target.value)} />
            </FormControl>
            <FormControl id="name" mt={4}>
              <FormLabel>Name</FormLabel>
              <Input type="text" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
            </FormControl>
            <FormControl id="username" mt={4}>
              <FormLabel>Username</FormLabel>
              <Input type="text" placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
            </FormControl>
            <Button colorScheme="blue" mt={6} onClick={handleJoin} _hover={{ bg: "blue.600", boxShadow: "md", transform: "scale(1.05)"}}
            isLoading={loading}
            loadingText="Joining"
            >
              Join
            </Button>
            {showMetaMaskMessage && (
              <Text fontSize="xl" fontWeight="bold" color="red.500" mt={4}>
                Wait for MetaMask popup and confirm transaction
              </Text>)}
          </Box>
          </Flex>
         
        )}
      </VStack>
    </ScaleFade>
   );

  const tiers = [
    { balance: 1000, name: "Bronze", unlocks: "Basic Features" },
    { balance: 5000, name: "Silver", unlocks: "Advanced Features" },
    { balance: 10000, name: "Gold", unlocks: "Premium Features" },
  ];

  const determineTier = (balance) => {
    let userTier = "";
    tiers.forEach(tier => {
      if (balance >= tier.balance) userTier = tier.name;
    });
    return userTier;
  };
  
  const renderDashboard = () => (
    
    <ScaleFade initialScale={0.8} in={true}>
    <>
      {isConnected && isMember && (
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          borderRadius="lg"
          boxShadow="lg"
          p={6}
          w="100%"
          maxWidth="600px"
          bg="transparent"
          position="relative"
          display="flex"
          zIndex={0}
          color= "ghostwhite"
        >
          <div className="glass" style={glassLayerStyle} />
          <Heading as="h2" size="lg" mb={4}>
            KUBI User Dashboard
          </Heading>
          {web3 && (
          <Text color="green.400" fontWeight="extrabold">

            Wallet Connected
          </Text>
        )}
        <Text mt={4} fontWeight="extrabold">Username: {userDetails && userDetails.username}</Text>
        <Text mt= {4}>Account:</Text>
        <Text>{account}</Text>
        <Text fontWeight="bold" mt={4}>KUBI Token Balance: {balance}</Text>
        <Text fontWeight="bold">KUBIX Token Balance: {KUBIXbalance}</Text>
        <Text fontWeight="bold">Membership NFT Balance: {nftBalance}</Text>
        <Text fontWeight="bold">Executive NFT Balance: {execNftBalance}</Text>
        

        </Flex>
      )}
    </>
    </ScaleFade>
  );

  const renderMetamaskMessage = () => (
    <ScaleFade initialScale={0.8} in={true}>
    <>
    
      {!isConnected && (<>
      <VStack  position="relative">
      <Text fontSize="3xl" fontWeight="extrabold" color="white" mt="4%">
          Please refresh with Metamask. If you don't have Metamask, please install it <Link href="https://metamask.io/" isExternal fontWeight="bold" textDecoration="underline" color="ghostwhite">here</Link>
        </Text>


      </VStack>
        

        </>
      )}
    </>
    </ScaleFade>
  );
  const renderDevMenu = () => (
    <>
      {isConnected && isMember && (
        <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        borderRadius="lg"
        boxShadow="lg"
        p={6}
        ml={4}
        w="100%"
        maxWidth="400px"
        bg="transparent"
        zIndex={1}
        position="relative" 
        display="flex"
        
      >
        <div className="glass" style={glassLayerStyle} />

        <Heading color = "ghostwhite" as="h2" size="lg" mb={6}>
            Developer Menu
        </Heading>

        <DeployMenu />
        <MintMenu />
        <DataMenu />
        <Button mt ={4} colorScheme="purple" _hover={{ bg: "purple.600", boxShadow: "md", transform: "scale(1.05)"}}>
        <Link as={NextLink} href="/practice" color="white" fontWeight="bold" fontSize="l" mx={"2%"}> 
            Practice
          </Link>
        </Button>
      </Flex>
      )}
  </>


  );

  const render = () => (
    <>
      {renderJoinSteps()}
      {renderMetamaskMessage()}
    </>
  );



  return (
    <>
      <Navbar />
      {dispaly && username ? (
        <VStack mt="8" spacing="6">
          <Text fontWeight="extrabold" ml="15%" mr="15%" fontSize="3xl" textColor="black">
            Join to become a member and Access the Dashboard. Please wait for both Transactions; it could take some time.
          </Text>
          <Button isLoading={loading} loadingText="Joining Please wait for Second Transaction" onClick={setDispalyHandle} size="lg" mt={4} bg="green.300" _hover={{ bg: "green.400", boxShadow: "md", transform: "scale(1.05)" }}>
            Join Now
          </Button>
        </VStack>
      ) : (
        <VStack mt="8" spacing="6">
          <Text fontWeight="extrabold" ml="15%" mr="15%" fontSize="3xl" textColor="black">
            Join to become a member and Access the Dashboard. Please wait for all three Transactions; it could take some time.
          </Text>
          <Input 
            placeholder="Enter your username" 
            value={newUsername} 
            onChange={(e) => setNewUsername(e.target.value)}
            size="lg" 
            mt={4}
          />
          <Button 
            isLoading={loading} 
            loadingText="Joining Please wait for Three total Transactions" 
            onClick={setDispalyHandleNew} 
            size="lg" 
            mt={4} 
            bg="green.300" 
            _hover={{ bg: "green.400", boxShadow: "md", transform: "scale(1.05)" }}
            isDisabled={!newUsername}  
          >
            Join Now and Create Account
          </Button>
        </VStack>
      )}
    </>
  );
};

export default User;