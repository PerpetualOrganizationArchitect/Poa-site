import React, { useRef, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import MainLayout from '../../../components/TaskManager/MainLayout';
//import FloatingBalls from '../components/TaskManager/floatingBalls';
import { useDataBaseContext } from '@/context/dataBaseContext';
import { useRouter } from 'next/router';
import Navbar from "@/templateComponents/studentOrgDAO/NavBar";
import { useGraphContext } from '@/context/graphContext';

//<FloatingBalls containerRef={containerRef} />




const Tasks = () => {
  const router = useRouter();
  const { userDAO } = router.query;

  const {setTaskLoaded, setSelectedProjectId, projects} = useDataBaseContext();
  const containerRef = useRef();

  useEffect(()=>{
    


    if(router.query.projectId!==null){
      console.log("project id",router.query.projectId)
      
      setSelectedProjectId(projects,router.query.projectId)

    }
    


  },[router.query.projectId,projects]);

  // useEffect(() => {
  //   setTaskLoaded(true);
  // }, []);

  return (
    <>
      <Navbar />
    <Box p={0} minH="80vh" position="relative" bg="blackAlpha.600" ref={containerRef}>
      
      <MainLayout />
    </Box>
    </>
  );
};

export default Tasks;
