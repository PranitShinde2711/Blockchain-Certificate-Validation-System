import React, { useState } from 'react';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useColorMode,
  IconButton,
  useToast, // Import useToast
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const Verifier = () => {
  const [certificateID, setCertificateID] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast(); // Initialize useToast

  const handleIDVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${certificateID}`);
      console.log('Fetched Certificate from IPFS:', response.data);
      toast({
        title: "Certificate is valid!",
        status: "success",
        duration: 5000, // Toast stays for 5 seconds
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error('Error fetching certificate from IPFS:', error);
      toast({
        title: "Invalid Certificate!",
        status: "error",
        duration: 5000, // Toast stays for 5 seconds
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleFileUpload = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const handleFileVerification = async (e) => {
    e.preventDefault();
    if (!uploadedFile) return;

    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      const uploadedContent = event.target.result;

      try {
        const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${certificateID}`);
        const ipfsContent = response.data;

        console.log('IPFS Content:', ipfsContent);

        const loadingTask = pdfjsLib.getDocument({ data: uploadedContent });
        loadingTask.promise.then(async (pdf) => {
          const page = await pdf.getPage(1);
          const textContent = await page.getTextContent();
          const textItems = textContent.items.map(item => item.str).join(' ');

          console.log('Extracted Text from PDF:', textItems);

          const uploadedUIDMatch = textItems.match(/Certificate ID \(IPFS Hash\): ([a-zA-Z0-9]+)$/m);
          const uploadedUID = uploadedUIDMatch ? uploadedUIDMatch[1] : null;

          console.log('Extracted UID from PDF:', uploadedUID);

          let ipfsUID;
          try {
            ipfsUID = JSON.parse(ipfsContent).uid;
            console.log('Expected UID from IPFS:', ipfsUID);
          } catch (err) {
            console.error('Error parsing IPFS content:', err);
            toast({
              title: "Invalid Certificate!",
              status: "error",
              duration: 5000, // Toast stays for 5 seconds
              isClosable: true,
              position: "top",
            });
            return;
          }

          if (uploadedUID) {
            if (uploadedUID.trim() === ipfsUID.trim()) {
              toast({
                title: "Certificate is valid!",
                status: "success",
                duration: 5000, // Toast stays for 5 seconds
                isClosable: true,
                position: "top",
              });
            } else {
              console.error('UIDs do not match:', uploadedUID, ipfsUID);
              toast({
                title: "Invalid Certificate!",
                status: "error",
                duration: 5000, // Toast stays for 5 seconds
                isClosable: true,
                position: "top",
              });
            }
          } else {
            console.error('No UID found in uploaded PDF.');
            toast({
              title: "Invalid Certificate!",
              status: "error",
              duration: 5000, // Toast stays for 5 seconds
              isClosable: true,
              position: "top",
            });
          }
        }, (reason) => {
          console.error('Error loading PDF:', reason);
          toast({
            title: "Invalid Certificate!",
            status: "error",
            duration: 5000, // Toast stays for 5 seconds
            isClosable: true,
            position: "top",
          });
        });
      } catch (error) {
        console.error('Error verifying certificate:', error);
        toast({
          title: "Invalid Certificate!",
          status: "error",
          duration: 5000, // Toast stays for 5 seconds
          isClosable: true,
          position: "top",
        });
      }
    };

    fileReader.readAsArrayBuffer(uploadedFile);
  };

  return (
    <Box p={6}>
      {/* Dark/Light Mode Toggle */}
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

      <VStack spacing={8} mt={10}>
        <Heading>Verify Certificate</Heading>

        <Box w="100%" maxW="400px">
          <Heading as="h2" size="md" mb={4}>
            Verify by Certificate ID (IPFS Hash)
          </Heading>
          <form onSubmit={handleIDVerification}>
            <FormControl>
              <FormLabel>Certificate ID</FormLabel>
              <Input
                placeholder="Enter Certificate ID (IPFS Hash)"
                value={certificateID}
                onChange={(e) => setCertificateID(e.target.value)}
                type="text"
              />
              <Button mt={4} colorScheme="blue" type="submit">
                Verify
              </Button>
            </FormControl>
          </form>
        </Box>

        <Box w="100%" maxW="400px">
          <Heading as="h2" size="md" mb={4}>
            Or Upload Certificate to Verify
          </Heading>
          <form onSubmit={handleFileVerification}>
            <FormControl>
              <FormLabel>Upload Certificate (PDF)</FormLabel>
              <Input type="file" accept=".pdf" onChange={handleFileUpload} />
              <Button mt={4} colorScheme="blue" type="submit">
                Upload and Verify
              </Button>
            </FormControl>
          </form>
        </Box>
      </VStack>
    </Box>
  );
};

export default Verifier;
