import React from 'react';
import { Box, Heading, Text, VStack, useColorMode, IconButton } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const NotFound = () => {
  const { colorMode, toggleColorMode } = useColorMode(); // Dark/Light mode toggle

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      bg={colorMode === "light" ? "gray.100" : "gray.900"}
      color={colorMode === "light" ? "black" : "white"}
      padding={8}
    >
      {/* Dark/Light Mode Toggle Button */}
      <IconButton
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        isRound
        size="lg"
        position="absolute"
        top="4"
        right="4"
        onClick={toggleColorMode}
        aria-label="Toggle Color Mode"
      />

      <VStack spacing={4}>
        <Heading fontSize="6xl">Oops! 😕</Heading>
        <Text fontSize="2xl">404 - Page Not Found</Text>
        <Text fontSize="lg">The page you are looking for does not exist.</Text>
      </VStack>
    </Box>
  );
};

export default NotFound;
