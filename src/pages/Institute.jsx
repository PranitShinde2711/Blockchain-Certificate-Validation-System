import React, { useState } from "react";
import { jsPDF } from "jspdf";
import axios from "axios";
import {
  ChakraProvider,
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Text,
  useColorMode,
  IconButton,
  VStack,
  useToast,
  extendTheme,
  ColorModeScript,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

// Create a theme with dark mode support
const config = {
  initialColorMode: "light", // Can be 'light' or 'dark' initially
  useSystemColorMode: false, // Set to true to use system preference
};

const theme = extendTheme({ config });

const Institute = () => {
  const [form, setForm] = useState({ uid: "", name: "", course: "", org: "" });
  const [ipfsHash, setIpfsHash] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerateCertificate = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    const certificateContent = `
      Certificate ID: ${form.uid}
      Name: ${form.name}
      Course: ${form.course}
      Organization: ${form.org}
    `;

    doc.text(certificateContent, 20, 30); // Add certificate content to PDF

    const pdfBlob = doc.output("blob"); // Generate PDF as a Blob
    const pdfUrl = URL.createObjectURL(pdfBlob); // Create a downloadable URL
    setPdfUrl(pdfUrl); // Store the URL for download
    console.log("Generated PDF Blob:", pdfBlob);
    return pdfBlob; // Return the Blob for uploading to IPFS
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pdfBlob = handleGenerateCertificate(); // Generate PDF

    // Check if the Blob is valid
    if (!pdfBlob) {
      setError("Error generating PDF.");
      toast({
        title: "Error",
        description: "Error generating PDF.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", pdfBlob, `certificate-${form.uid}.pdf`); // Append PDF to FormData

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_API_SECRET,
          },
        }
      );

      const newIpfsHash = response.data.IpfsHash;
      setIpfsHash(newIpfsHash); // Save the IPFS hash
      toast({
        title: "Success",
        description: "Certificate uploaded to IPFS.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      console.log("Certificate PDF uploaded to IPFS, Hash:", newIpfsHash);
    } catch (error) {
      console.error("Error uploading certificate to IPFS:", error);
      setError("Error uploading PDF to IPFS.");
      toast({
        title: "Error",
        description: "Error uploading PDF to IPFS.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider theme={theme}>
      {/* Ensure correct color mode script */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />

      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg={colorMode === "light" ? "gray.200" : "gray.800"} // Background changes based on color mode
        color={colorMode === "light" ? "black" : "white"} // Text color changes based on mode
      >
        {/* Dark/Light mode toggle */}
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
            Generate Certificate
          </Text>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>UID</FormLabel>
                <Input
                  type="text"
                  name="uid"
                  placeholder="UID"
                  onChange={handleChange}
                  bg={colorMode === "light" ? "gray.100" : "gray.600"}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  placeholder="Name"
                  onChange={handleChange}
                  bg={colorMode === "light" ? "gray.100" : "gray.600"}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Course Name</FormLabel>
                <Input
                  type="text"
                  name="course"
                  placeholder="Course Name"
                  onChange={handleChange}
                  bg={colorMode === "light" ? "gray.100" : "gray.600"}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Organization</FormLabel>
                <Input
                  type="text"
                  name="org"
                  placeholder="Organization"
                  onChange={handleChange}
                  bg={colorMode === "light" ? "gray.100" : "gray.600"}
                />
              </FormControl>

              <Button colorScheme="blue" type="submit" width="full">
                Generate and Upload Certificate
              </Button>
            </VStack>
          </form>

          {ipfsHash && (
            <>
              <Text mt={4}>Certificate Hash: {ipfsHash}</Text>
              <a href={pdfUrl} download={`certificate-${form.uid}.pdf`}>
                <Button mt={2} colorScheme="green" width="full">
                  Download Certificate
                </Button>
              </a>
            </>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Institute;







// import React, { useState } from "react";
// import {
//   ChakraProvider,
//   Box,
//   Button,
//   Input,
//   FormControl,
//   FormLabel,
//   Text,
//   useColorMode,
//   IconButton,
//   VStack,
//   useToast,
//   extendTheme,
//   ColorModeScript,
// } from "@chakra-ui/react";
// import { SunIcon, MoonIcon } from "@chakra-ui/icons";

// // Import utility functions
// import { generatePDF, uploadToIPFS } from "../utils/certificateUtils";

// // Create a theme with dark mode support
// const config = {
//   initialColorMode: "light", // Can be 'light' or 'dark' initially
//   useSystemColorMode: false, // Set to true to use system preference
// };

// const theme = extendTheme({ config });

// const Institute = () => {
//   const [form, setForm] = useState({ uid: "", name: "", course: "", org: "" });
//   const [ipfsHash, setIpfsHash] = useState("");
//   const [pdfUrl, setPdfUrl] = useState("");
//   const [error, setError] = useState("");
//   const { colorMode, toggleColorMode } = useColorMode();
//   const toast = useToast();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const { pdfBlob, pdfUrl } = generatePDF(form); // Use utility function to generate PDF
//       setPdfUrl(pdfUrl); // Set PDF URL for download

//       const newIpfsHash = await uploadToIPFS(pdfBlob, form.uid); // Use utility function to upload to IPFS
//       setIpfsHash(newIpfsHash); // Save the IPFS hash

//       toast({
//         title: "Success",
//         description: "Certificate uploaded to IPFS.",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//     } catch (error) {
//       console.error(error);
//       setError(error.message);
//       toast({
//         title: "Error",
//         description: error.message,
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <ChakraProvider theme={theme}>
//       {/* Ensure correct color mode script */}
//       <ColorModeScript initialColorMode={theme.config.initialColorMode} />

//       <Box
//         width="100vw"
//         height="100vh"
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         bg={colorMode === "light" ? "gray.200" : "gray.800"} // Background changes based on color mode
//         color={colorMode === "light" ? "black" : "white"} // Text color changes based on mode
//       >
//         {/* Dark/Light mode toggle */}
//         <IconButton
//           icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
//           isRound
//           size="lg"
//           position="absolute"
//           top="4"
//           right="4"
//           onClick={toggleColorMode}
//           aria-label="Toggle Color Mode"
//         />

//         <Box
//           p={8}
//           boxShadow="lg"
//           bg={colorMode === "light" ? "white" : "gray.700"}
//           borderRadius="md"
//           width="400px"
//         >
//           <Text fontSize="2xl" mb={6} fontWeight="bold" textAlign="center">
//             Generate Certificate
//           </Text>

//           <form onSubmit={handleSubmit}>
//             <VStack spacing={4}>
//               <FormControl isRequired>
//                 <FormLabel>UID</FormLabel>
//                 <Input
//                   type="text"
//                   name="uid"
//                   placeholder="UID"
//                   onChange={handleChange}
//                   bg={colorMode === "light" ? "gray.100" : "gray.600"}
//                 />
//               </FormControl>

//               <FormControl isRequired>
//                 <FormLabel>Name</FormLabel>
//                 <Input
//                   type="text"
//                   name="name"
//                   placeholder="Name"
//                   onChange={handleChange}
//                   bg={colorMode === "light" ? "gray.100" : "gray.600"}
//                 />
//               </FormControl>

//               <FormControl isRequired>
//                 <FormLabel>Course Name</FormLabel>
//                 <Input
//                   type="text"
//                   name="course"
//                   placeholder="Course Name"
//                   onChange={handleChange}
//                   bg={colorMode === "light" ? "gray.100" : "gray.600"}
//                 />
//               </FormControl>

//               <FormControl isRequired>
//                 <FormLabel>Organization</FormLabel>
//                 <Input
//                   type="text"
//                   name="org"
//                   placeholder="Organization"
//                   onChange={handleChange}
//                   bg={colorMode === "light" ? "gray.100" : "gray.600"}
//                 />
//               </FormControl>

//               <Button colorScheme="blue" type="submit" width="full">
//                 Generate and Upload Certificate
//               </Button>
//             </VStack>
//           </form>

//           {ipfsHash && (
//             <>
//               <Text mt={4}>Certificate Hash: {ipfsHash}</Text>
//               <a href={pdfUrl} download={`certificate-${form.uid}.pdf`}>
//                 <Button mt={2} colorScheme="green" width="full">
//                   Download Certificate
//                 </Button>
//               </a>
//             </>
//           )}
//         </Box>
//       </Box>
//     </ChakraProvider>
//   );
// };

// export default Institute;
