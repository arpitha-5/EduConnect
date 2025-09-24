import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Heading,
  Text,
  useToast,
  Spinner,
  Divider,
  Flex,
  IconButton,
  Link,
  useBreakpointValue,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, EmailIcon } from '@chakra-ui/icons';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const usernameInputRef = useRef(null);
  useEffect(() => {
    if (usernameInputRef.current) usernameInputRef.current.focus();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);

      toast({
        title: 'Registration successful',
        description: `Welcome, ${response.data.user.username}!`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      navigate('/login');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'Server error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const bgColor = useColorModeValue('linear-gradient(to right, #f0f4f8, #d9e2ec)', 'gray.900');
  const formBg = useColorModeValue('white', 'gray.700');
  const sideBgGradient = useColorModeValue(
    'linear(to-br, teal.400, blue.500)',
    'linear(to-br, teal.600, blue.700)'
  );

  return (
    <Flex
      minH="100vh"
      bg={bgColor}
      direction={{ base: 'column', md: 'row' }}
      justify="center"
      align="center"
      px={{ base: 6, md: 12 }}
      py={12}
      backgroundImage="url('https://www.transparenttextures.com/patterns/diagmonds-light.png')"
      backgroundSize="cover"
    >
      {!isMobile && (
        <Box
          flex="1"
          bgGradient={sideBgGradient}
          color="white"
          borderRadius="lg"
          p={12}
          maxW="480px"
          textAlign="center"
          boxShadow="2xl"
          mr={12}
        >
          <Heading as="h1" size="2xl" mb={4} fontWeight="extrabold" letterSpacing="tight">
            <Text as="span" color="teal.200">Edu</Text>
            <Text as="span" color="teal.50" ml={1}>Connect</Text>
          </Heading>
          <Text fontSize="lg" mb={6} fontWeight="medium" color="gray.200">
            Join the future of student networking and resource sharing.
          </Text>
          <Box mt={8} p={6} bg="rgba(255, 255, 255, 0.1)" borderRadius="md" boxShadow="md">
            Sign up to unlock personalized tools and community features.
          </Box>
        </Box>
      )}

      <Box
        flex="1"
        bg={formBg}
        p={{ base: 8, md: 10 }}
        borderRadius="lg"
        boxShadow="xl"
        maxW={{ base: '100%', md: '420px' }}
        width="full"
      >
        <Heading mb={6} fontWeight="bold" fontSize="2xl" textAlign="center" color="teal.600">
          Create Your Account
        </Heading>

        <form onSubmit={handleSubmit} noValidate>
          <VStack spacing={5} align="stretch">
            <FormControl id="username" isRequired isInvalid={!!errors.username}>
              <FormLabel>Username</FormLabel>
              <Input
                ref={usernameInputRef}
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your name"
              />
              <FormErrorMessage>{errors.username}</FormErrorMessage>
            </FormControl>

            <FormControl id="email" isRequired isInvalid={!!errors.email}>
              <FormLabel>Email Address</FormLabel>
              <InputGroup>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                />
                <InputRightElement pointerEvents="none">
                  <EmailIcon color="gray.400" />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl id="password" isRequired isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                />
                <InputRightElement>
                  <IconButton
                    variant="ghost"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={toggleShowPassword}
                    tabIndex={-1}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              fontWeight="bold"
              isLoading={isLoading}
              loadingText="Creating account..."
              spinner={<Spinner size="sm" />}
              _hover={{ bg: 'teal.700' }}
            >
              Register
            </Button>

            <Button
              leftIcon={<FcGoogle />}
              colorScheme="gray"
              variant="outline"
              size="lg"
              fontWeight="medium"
              onClick={() => toast({ title: 'Google registration clicked', status: 'info', duration: 3000 })}
              _hover={{ bg: 'gray.100' }}
            >
              Sign up with Google
            </Button>

            <Divider />

            <HStack justify="center" spacing={2}>
              <Text fontSize="sm" color="gray.600">
                Already have an account?
              </Text>
              <Link color="teal.600" fontWeight="semibold" href="/login">
                Sign in
              </Link>
            </HStack>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default Register;
