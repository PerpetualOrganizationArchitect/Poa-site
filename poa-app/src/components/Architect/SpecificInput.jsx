import React, { useState, useEffect, forwardRef } from "react";
import { Input, VStack, Button } from "@chakra-ui/react";

const SpecificInput = forwardRef(
  (
    { inputFields = [], onInputsChanged = () => {}, showAddTierButton },
    ref
  ) => {
    // Initialize the state with keys from inputFields and empty values
    const [inputs, setInputs] = useState(
      inputFields.reduce((acc, field) => ({ ...acc, [field.label]: "" }), {})
    );

    // Handle changes to each input field
    const handleChange = (label, value) => {
      setInputs((prev) => ({ ...prev, [label]: value }));
    };

    // Call onInputsChanged whenever inputs change, passing the updated inputs
    useEffect(() => {
      onInputsChanged(inputs);
    }, [inputs, onInputsChanged]);

    return (
      <VStack ref={ref} spacing={4} p={15}>
        {inputFields.map((field, index) => (
          <div key={index}>
            <label>{field.label}</label>
            <Input
              size="sm"
              value={inputs[field.label]}
              onChange={(e) => handleChange(field.label, e.target.value)}
              isRequired
            />
          </div>
        ))}
        {showAddTierButton && (
          <Button
            colorScheme="teal"
            onClick={() => {
              /* Add logic for what happens when the button is clicked */
            }}
          >
            Add New Tier
          </Button>
        )}
      </VStack>
    );
  }
);

export default SpecificInput;
