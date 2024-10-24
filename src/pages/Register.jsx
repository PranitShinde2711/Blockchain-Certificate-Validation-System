import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChakraProvider,
  Box,
  Button,
  Input,
  VStack,
  Text,
  useColorMode,
  IconButton,
  FormControl,
  FormLabel,
  useColorModeValue,
  extendTheme,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";

const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
});

function Register() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation(); // Use location to access state
  const role = location.state?.role; // Get role from state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/login", { state: { role } });  // Redirect to login, passing the role
    } catch (error) {
      console.error("Error code:", error.code);  
      console.error("Error message:", error.message);  
      setError(error.message);  
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={useColorModeValue("gray.100", "gray.900")}
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
        <VStack
          spacing={6}
          bg={useColorModeValue("white", "gray.700")}
          p={8}
          borderRadius="lg"
          boxShadow="lg"
          w="md"
        >
          <Text fontSize="3xl" fontWeight="bold" color={useColorModeValue("gray.800", "white")}>
            Register
          </Text>
          {error && <Text color="red.500">{error}</Text>}
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg={useColorModeValue("gray.50", "gray.800")}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg={useColorModeValue("gray.50", "gray.800")}
            />
          </FormControl>
          <Button colorScheme="blue" w="full" onClick={handleRegister}>
            Register
          </Button>
          <Text>Already have an account?</Text>
          <Button
            variant="link"
            colorScheme="blue"
            onClick={() => navigate("/login", { state: { role } })} // Pass role back to Login
          >
            Login here
          </Button>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default Register;
