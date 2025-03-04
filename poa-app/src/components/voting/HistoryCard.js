import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

const glassLayerStyle = {
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: -1,
  borderRadius: "inherit",
  backdropFilter: "blur(20px)",
  backgroundColor: "rgba(0, 0, 0, .8)",
};

const HistoryCard = ({ proposal, onPollClick }) => {
  const totalVotes = proposal.totalVotes;
  let WinnerName = proposal.options[proposal.winningOptionIndex]?.name || "No Winner";
  if (proposal.validWinner === false) {
    WinnerName = "No Winner";
  }

  const predefinedColors = [
    "red",
    "darkblue",
    "yellow",
    "purple",
  ];
  
  const data = [
    {
      name: "Options",
      values: proposal.options.map((option, index) => {
        const color =
          index < predefinedColors.length
            ? predefinedColors[index]
            : `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;
        return {
          value: (option.votes / totalVotes) * 100,
          color: color,
        };
      }),
    },
  ];

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      borderRadius="3xl"
      boxShadow="lg"
      display="flex"
      w="30%"
      minW="30%"
      maxWidth="30%"
      bg="transparent"
      position="relative"
      color="rgba(333, 333, 333, 1)"
      zIndex={1}
      onClick={() => onPollClick(proposal, true)}
    >
      <div className="glass" style={glassLayerStyle} />
      <Text
        mr="2"
        mt="4"
        ml="2 "
        mb="2"
        fontSize={"xl"}
        fontWeight="extrabold"
      >
        {proposal.name}
      </Text>
      <Flex justifyContent="center">
        <BarChart
          width={200}
          height={30}
          layout="vertical"
          data={data}
        >
          <XAxis type="number" hide="true" />
          <YAxis type="category" dataKey="name" hide="true" />
          {data[0].values.map((option, index) => (
            <Bar key={index} dataKey={`values[${index}].value`} stackId="a" fill={option.color} />
          ))}
        </BarChart>
      </Flex>
      <Text mb="2" fontSize="xl" fontWeight="extrabold">
        Winner: {WinnerName}
      </Text>
    </Box>
  );
};

export default HistoryCard; 