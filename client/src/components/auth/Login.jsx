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
  Icon,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, EmailIcon, LockIcon } from '@chakra-ui/icons';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Professional CampusConnect Login Component
 */
const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailInputRef = useRef(null);
  useEffect(() => {
    if (emailInputRef.current) emailInputRef.current.focus();
  }, []);

  const validate = () => {
    const newErrors = {};
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
      const response = await axios.post('http://localhost:5000/api/login', formData);

      toast({
        title: 'Login successful',
        description: `Welcome back, ${response.data.user.name}!`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
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
          <Heading as="h1" size="2xl" mb={4} fontWeight="extrabold" letterSpacing="tight" lineHeight="shorter">
            <Text as="span" color="teal.200">Edu</Text>
            <Text as="span" color="teal.50" ml={1}>Connect</Text>
          </Heading>

          <Text fontSize="lg" mb={6} fontWeight="medium" letterSpacing="wider" color="gray.200">
            Empowering Students. Enabling Success. <br />
            Connect, Learn, and Grow with CampusConnect.
          </Text>

          <Box mt={8} p={6} bg="rgba(255, 255, 255, 0.1)" borderRadius="md" boxShadow="md" fontSize="md" fontWeight="semibold">
            Join the premier student community platform tailored for your academic and career growth.
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
          Sign In to Your Account
        </Heading>

        <form onSubmit={handleSubmit} noValidate>
          <VStack spacing={5} align="stretch">
            <FormControl id="email" isRequired isInvalid={!!errors.email}>
              <FormLabel>Email Address</FormLabel>
              <InputGroup>
                <Input
                  ref={emailInputRef}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  autoComplete="email"
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
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

            <Flex justify="space-between" align="center">
              <Link
                color="teal.600"
                fontWeight="semibold"
                fontSize="sm"
                onClick={() => toast({ title: 'Forgot password clicked', status: 'info', duration: 3000 })}
                role="button"
                tabIndex={0}
              >
                Forgot password?
              </Link>
            </Flex>

            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              fontWeight="bold"
              isLoading={isLoading}
              loadingText="Signing In..."
              spinner={<Spinner size="sm" />}
              _hover={{ bg: 'teal.700' }}
            >
              Sign In
            </Button>

            <Button
              leftIcon={<Icon as={FcGoogle} boxSize={5} />}
              colorScheme="gray"
              variant="outline"
              size="lg"
              fontWeight="medium"
              onClick={() => toast({ title: 'Google login clicked', status: 'info', duration: 3000 })}
              _hover={{ bg: 'gray.100' }}
            >
              Sign in with Google
            </Button>

            <Divider />

            <HStack justify="center" spacing={2}>
              <Text fontSize="sm" color="gray.600">
                New to CampusConnect?
              </Text>
              <Link color="teal.600" fontWeight="semibold" href="/register">
                Create an account
              </Link>
            </HStack>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
