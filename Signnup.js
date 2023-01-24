import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";

const theme = createTheme();

export default function SignIn() {
const [email, setEmail] = React.useState("");
const [password, setPassword] = React.useState("");

const navigate = useNavigate();
const handleSubmit = async (event) => {
	event.preventDefault();
	signInWithEmailAndPassword(auth, email, password)
	.then((userCredential) => {
		// Signed in
		const user = userCredential.user;

		navigate("/chat-home/1");
		// ...
	})
	.catch((error) => {
		const errorCode = error.code;
		const errorMessage = error.message;

		alert(errorMessage);
	});
};

return (
	<ThemeProvider theme={theme}>
	<Container component="main" maxWidth="xs">
		<CssBaseline />
		<Box
		sx={{
			marginTop: 8,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
		}}
		>
		<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
			<LockOutlinedIcon />
		</Avatar>
		<Typography component="h1" variant="h5">
			Sign in
		</Typography>
		<Box
			component="form"
			onSubmit={handleSubmit}
			noValidate
			sx={{ mt: 1 }}
		>
			<TextField
			margin="normal"
			required
			fullWidth
			id="email"
			label="Email Address"
			name="email"
			autoComplete="email"
			autoFocus
			value={email}
			onChange={(e) => setEmail(e.target.value)}
			/>
			<TextField
			margin="normal"
			required
			fullWidth
			name="password"
			label="Password"
			type="password"
			id="password"
			autoComplete="current-password"
			value={password}
			onChange={(e) => setPassword(e.target.value)}
			/>
			<FormControlLabel
			control={<Checkbox value="remember"
			color="primary" />}
			label="Remember me"
			/>
			<Button
			type="submit"
			fullWidth
			variant="contained"
			sx={{ mt: 3, mb: 2 }}
			>
			Sign In
			</Button>
			<Grid container>
			<Grid item xs>
				<Link href="#" variant="body2">
				Forgot password?
				</Link>
			</Grid>
			<Grid item>
				<Link href="/Signup" variant="body2">
				{"Don't have an account? Sign Up"}
				</Link>
			</Grid>
			</Grid>
		</Box>
		</Box>
	</Container>
	</ThemeProvider>
);
}


import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Title } from 'react-native-paper';

import FormButton from '../components/formButton';
import FormInput from '../components/formInput';
import Loading from '../components/loading';
import { AuthContext } from '../navigation/authProvider';

export default function SignupScreen({ navigation }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { register, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  return (
      <View style={styles.container}>
        <Title style={styles.titleText}>Let's get started!</Title>
        <FormInput
            labelName="Display Name"
            value={displayName}
            autoCapitalize="none"
            onChangeText={(userDisplayName) => setDisplayName(userDisplayName)}
        />
        <FormInput
            labelName="Email"
            value={email}
            autoCapitalize="none"
            onChangeText={(userEmail) => setEmail(userEmail)}
        />
        <FormInput
            labelName="Password"
            value={password}
            secureTextEntry={true}
            onChangeText={(userPassword) => setPassword(userPassword)}
        />
        <FormButton
            title="Signup"
            modeValue="contained"
            labelStyle={styles.loginButtonLabel}
            onPress={() => register(displayName, email, password)}
        />
        <IconButton
            icon="keyboard-backspace"
            size={30}
            style={styles.navButton}
            color="#5b3a70"
            onPress={() => navigation.goBack()}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10,
  },
  loginButtonLabel: {
    fontSize: 22,
  },
  navButtonText: {
    fontSize: 18,
  },
  navButton: {
    marginTop: 10,
  },
});