import React, { useState } from "react";
import { ChakraProvider, Box, Button, Input, FormControl, FormLabel, Text, useColorMode, IconButton, VStack, useToast, extendTheme, ColorModeScript } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

// Create a theme with dark mode support
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

const Recipient = () => {
  const [ipfsHash, setIpfsHash] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  const handleChange = (e) => {
    setIpfsHash(e.target.value);
  };

  const handleDownload = () => {
    if (!ipfsHash) {
      toast({
        title: "Error",
        description: "Please enter a valid IPFS hash.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const url = `https://ipfs.io/ipfs/${ipfsHash}`; // IPFS gateway URL for downloading
    setDownloadUrl(url);
    window.open(url, "_blank"); // Open the URL in a new tab
  };

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />

      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg={colorMode === "light" ? "gray.200" : "gray.800"}
        color={colorMode === "light" ? "black" : "white"}
      >
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

        <Box
          p={8}
          boxShadow="lg"
          bg={colorMode === "light" ? "white" : "gray.700"}
          borderRadius="md"
          width="400px"
        >
          <Text fontSize="2xl" mb={6} fontWeight="bold" textAlign="center">
            Download Certificate
          </Text>

          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>IPFS Hash</FormLabel>
              <Input
                type="text"
                placeholder="Enter IPFS Hash"
                value={ipfsHash}
                onChange={handleChange}
                bg={colorMode === "light" ? "gray.100" : "gray.600"}
              />
            </FormControl>

            <Button colorScheme="blue" onClick={handleDownload} width="full">
              Download Certificate
            </Button>
          </VStack>

          {downloadUrl && (
            <Text mt={4}>
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                Click here to download your certificate
              </a>
            </Text>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Recipient;
