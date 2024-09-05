import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, Select } from '@chakra-ui/react';
import { useWeb3Context } from '@/context/web3Context';
import { usePOContext } from '@/context/POContext';

const TestPage = () => {
    const { createEduModule, checkIsExecutive } = useWeb3Context();
    const { educationHubAddress, nftMembershipContractAddress, address } = usePOContext();

    const [moduleTitle, setModuleTitle] = useState('');
    const [moduleDescription, setModuleDescription] = useState('');
    const [payout, setPayout] = useState('');
    const [answers, setAnswers] = useState(['', '', '', '']); // Start with 4 empty answers
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [isExecutive, setIsExecutive] = useState(false); // Track executive status

    const handleInputChange = (e, index) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = e.target.value;
        setAnswers(updatedAnswers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!moduleTitle || !moduleDescription || !payout || answers.some(answer => !answer) || correctAnswer === '') {
            alert('Please fill in all fields');
            return;
        }

        try {
            await createEduModule(
                educationHubAddress,
                moduleTitle,
                moduleDescription,
                payout,
                answers,
                correctAnswer
            );
            alert('Module created successfully!');
        } catch (error) {
            console.error('Error creating module:', error);
            alert('Failed to create module');
        }
    };

    const handleCheckExecutive = async () => {
        try {
            const executiveStatus = await checkIsExecutive(nftMembershipContractAddress, "0x1310cEdD03Cc8F6aE50F2Fb93848070FACB042b8");
            setIsExecutive(executiveStatus);
            alert(`Is user executive? ${executiveStatus}`);
        } catch (error) {
            console.error('Error checking executive status:', error);
        }
    };

    return (
        <Box p={6}>
            <form onSubmit={handleSubmit}>
                <FormControl isRequired mb={4}>
                    <FormLabel>Module Title</FormLabel>
                    <Input 
                        value={moduleTitle} 
                        onChange={(e) => setModuleTitle(e.target.value)} 
                        placeholder="Enter module title" 
                    />
                </FormControl>

                <FormControl isRequired mb={4}>
                    <FormLabel>Module Description</FormLabel>
                    <Textarea
                        value={moduleDescription}
                        onChange={(e) => setModuleDescription(e.target.value)}
                        placeholder="Enter module description"
                    />
                </FormControl>

                <FormControl isRequired mb={4}>
                    <FormLabel>Payout</FormLabel>
                    <Input 
                        value={payout}
                        onChange={(e) => setPayout(e.target.value)}
                        placeholder="Enter payout amount (e.g. in ETH)"
                    />
                </FormControl>

                {answers.map((answer, index) => (
                    <FormControl key={index} isRequired mb={4}>
                        <FormLabel>Answer {index + 1}</FormLabel>
                        <Input
                            value={answer}
                            onChange={(e) => handleInputChange(e, index)}
                            placeholder={`Enter answer ${index + 1}`}
                        />
                    </FormControl>
                ))}

                <FormControl isRequired mb={4}>
                    <FormLabel>Select Correct Answer</FormLabel>
                    <Select 
                        placeholder="Select correct answer" 
                        value={correctAnswer} 
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                    >
                        {answers.map((answer, index) => (
                            <option key={index} value={answer}>
                                Answer {index + 1}: {answer}
                            </option>
                        ))}
                    </Select>
                </FormControl>

                <Button type="submit" colorScheme="blue" mb={4}>
                    Create Module
                </Button>
            </form>

            {/* Button to check executive status */}
            <Button onClick={handleCheckExecutive} colorScheme="teal">
                Check Executive Status
            </Button>
        </Box>
    );
};

export default TestPage;
