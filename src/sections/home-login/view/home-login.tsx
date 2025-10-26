import { Box, Button, Card, CardActions, CardContent, CardHeader, Container, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { Iconify } from "src/components/iconify";
import { CONFIG } from "src/global-config";

export function HomeLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [values, setValues] = useState({
        identifier: '',
        password: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Đăng nhập:', values);
    };

    return (
        <Box
            component="section"
            height='95vh'
            display="flex"
            alignItems="center"
        >
            <Container maxWidth="sm">
                <Stack spacing={3} sx={{ pt: 8, pb: 10 }}>
                    <Card sx={{ p: 3, boxShadow: 4, borderRadius: 3 }}>
                        <CardHeader
                            title={
                                <Typography variant="h5" textAlign="center" fontWeight="bold">
                                    Đăng nhập
                                </Typography>
                            }
                        />
                        <CardContent>
                            <Box component="form" onSubmit={handleSubmit}>
                                <Stack spacing={3}>
                                    <TextField
                                        name="identifier"
                                        label="Số điện thoại hoặc Email"
                                        fullWidth
                                        variant="outlined"
                                        value={values.identifier}
                                        onChange={handleChange}
                                        required
                                    />

                                    <TextField
                                        name="password"
                                        label="Mật khẩu"
                                        type={showPassword ? 'text' : 'password'}
                                        fullWidth
                                        variant="outlined"
                                        value={values.password}
                                        onChange={handleChange}
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                        <Iconify
                                                            icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                                                        />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Stack>
                            </Box>
                        </CardContent>

                        <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                }}
                            >
                                Đăng nhập
                            </Button>
                        </CardActions>

                        <Box textAlign="center" sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Chưa có tài khoản?{' '}
                                <Typography
                                    component="span"
                                    color="primary"
                                    sx={{ cursor: 'pointer', fontWeight: 600 }}
                                >
                                    Đăng ký ngay
                                </Typography>
                            </Typography>
                        </Box>
                    </Card>
                </Stack>
            </Container>
        </Box>
    );
}