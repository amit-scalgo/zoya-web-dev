import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginUserSchema } from '@/schema/auth.schema';
import { useForm } from 'react-hook-form';
import { newRequest } from '@/endpoints';
import { LOGIN_USER } from '@/endpoints/user';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useChatStore } from '@/lib/store/chat.store';
import { Eye, EyeClosed } from 'lucide-react';

export default function Login() {
    const { changeCurrentChatUser } = useChatStore();
    const [loader, setLoader] = useState(false);
    const [passwordVisible, isPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ resolver: yupResolver(loginUserSchema) });

    const onsubmit = async (data) => {
        setLoader(true);
        const { email, password } = data;
        const formData = {
            email,
            password,
            key: 'web',
        };
        try {
            const res = await newRequest.post(LOGIN_USER, formData);
            if (res.status === 200) {
                toast.success(res.data.message);
                setLoader(false);
                localStorage.setItem('token', res.data.token);
                reset();
                setLoader(false);
                if (res.data.role === 'admin') {
                    navigate('/admin');
                } else {
                    changeCurrentChatUser(undefined);
                    navigate('/');
                }
            } else {
                throw new Error('Something went wrong');
            }
        } catch (error) {
            console.log(error);
            setLoader(false);
            toast.error(error?.response?.data?.message);
            reset();
        }
    };

    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <form
                onSubmit={handleSubmit(onsubmit)}
                className="flex h-full w-80 flex-col justify-center gap-2"
            >
                <div className="flex flex-col items-start">
                    <h5 className="text-3xl font-semibold">Welcome back</h5>
                    <p className="mt-3 text-black/50">
                        Welcome back! Please enter your details.
                    </p>
                </div>
                <div className="mt-7 flex flex-col gap-1">
                    <Input
                        type="email"
                        {...register('email')}
                        className="h-10"
                        placeholder="Email address"
                    />
                    {errors?.email && (
                        <span className="text-xs font-medium text-red-500">
                            {errors.email.message}
                        </span>
                    )}
                </div>
                <div className="mt-1.5 flex flex-col gap-1">
                    <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            {...register('password')}
                            className="h-full w-full outline-none"
                            placeholder="Password"
                        />
                        <span
                            onClick={() => isPasswordVisible(!passwordVisible)}
                            className="cursor-pointer text-sm text-black/50 transition-all duration-500 hover:text-zoyaprimary/80"
                        >
                            {passwordVisible ? (
                                <Eye className="h-5" />
                            ) : (
                                <EyeClosed className="h-5" />
                            )}
                        </span>
                    </div>
                    {/* <Input
            type="password"
            className="h-10"
            {...register("password")}
            placeholder="Password"
          /> */}
                    {errors?.password && (
                        <span className="text-xs font-medium text-red-500">
                            {errors.password.message}
                        </span>
                    )}
                </div>
                <Button
                    className="mt-7 min-h-11 bg-zoyaprimary font-bold"
                    type="submit"
                >
                    {loader ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white" />
                            Signing you in
                        </div>
                    ) : (
                        'Sign In'
                    )}
                </Button>
                {/* <div className="flex items-center gap-1 text-sm text-black/50">
          <p>Don’t have an account? </p>
          <Link
            className="font-semibold text-zoyaprimary/80"
            to="/auth/register"
          >
            Sign Up
          </Link>
        </div> */}
            </form>
        </div>
    );
}
