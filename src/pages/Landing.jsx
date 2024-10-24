import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChakraProvider,
  Box,
  Button,
  Image,
  Text,
  useColorMode,
  IconButton,
  VStack,
  SimpleGrid,
  ColorModeScript,
  useColorModeValue,
  extendTheme,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import institute_logo from "../assets/university.jpg";
import company_logo from "../assets/verify.jpg";
import recipient_logo from "../assets/recipient.webp";

// Create a theme with dark mode support
const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
});

function Landing() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    navigate("/login", { state: { role } }); // Pass role as state
  };

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />

      <Box
        width="100vw"
        height="100vh"
        textAlign="center"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bg={useColorModeValue("gray.200", "gray.800")}
        color={useColorModeValue("black", "white")}
        transition="background 0.5s ease"
      >
        <IconButton
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          isRound
          size="lg"
          position="absolute"
          top="4"
          right="4"
          onClick={toggleColorMode}
          aria-label="Toggle Light/Dark Mode"
        />

        <VStack spacing={8}>
          <Text fontSize={["3xl", "4xl"]} fontWeight="bold">
            Certificate Validation System
          </Text>

          <Text fontSize={["lg", "xl"]}>Select Your Role</Text>

          <SimpleGrid columns={[1, 2, 3]} spacing={[10, 15]} width={["90%", "80%"]}>
            <Box textAlign="center" p={2} boxShadow="md" borderRadius="lg" width="300px" height="350px" bg={useColorModeValue("white", "gray.700")}>
              <Image src={institute_logo} alt="Institute" boxSize="250px" mx="auto" />
              <Button mt={4} colorScheme="blue" onClick={() => handleRoleClick("Institute")}>
                Institute
              </Button>
            </Box>

            <Box textAlign="center" p={2} boxShadow="md" borderRadius="lg" width="300px" height="350px" bg={useColorModeValue("white", "gray.700")}>
              <Image src={company_logo} alt="Verifier" boxSize="250px" mx="auto" />
              <Button mt={4} colorScheme="green" onClick={() => handleRoleClick("Verifier")}>
                Verifier
              </Button>
            </Box>

            <Box textAlign="center" p={2} boxShadow="md" borderRadius="lg" width="300px" height="350px" bg={useColorModeValue("white", "gray.700")}>
              <Image src={recipient_logo} alt="Recipient" boxSize="250px" mx="auto" />
              <Button mt={4} colorScheme="purple" onClick={() => handleRoleClick("Recipient")}>
                Recipient
              </Button>
            </Box>
          </SimpleGrid>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default Landing;
