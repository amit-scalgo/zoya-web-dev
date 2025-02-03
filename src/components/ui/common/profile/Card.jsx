import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { newFormRequest } from '@/endpoints';
import { USER } from '@/endpoints/user';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import FileInput from '@/components/ui/common/FileInput';
import { useUserStore } from '@/lib/store/user.store';
import { Textarea } from '../../textarea';

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required'),
    bio: yup.string(),
    phone: yup
        .string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
});

export default function ProfileCard() {
    const [file, setFile] = useState('');
    const [loader, setLoader] = useState(false);
    const { userInfo } = useUserStore();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (userInfo) {
            setValue('name', userInfo?.name);
            setValue('email', userInfo?.email);
            setValue('bio', userInfo?.bio);
            setValue('phone', userInfo?.phoneNumber);
        }
    }, [userInfo, setValue]);

    const onSubmit = async (data) => {
        try {
            setLoader(true);
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('bio', data.bio);
            formData.append('phoneNumber', data.phone);
            if (file) formData.append('avatar', file);

            const response = await newFormRequest.patch(USER, formData);
            if (response.status === 200) {
                setLoader(false);
                toast.success(response.data.message);
                queryClient.invalidateQueries(['profile']);
            } else {
                throw new Error('Invalid');
            }
        } catch (error) {
            console.error(error);
            setLoader(false);
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <Card className="w-full rounded-sm border-black/5 shadow-none">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <FileInput
                        onFileSelected={setFile}
                        type={'round'}
                        givenFile={userInfo?.avatar}
                        userInfo={userInfo}
                    />
                    <div className="flex flex-col">
                        <h2 className="font-semibold">{userInfo?.name}</h2>
                        <div className="flex text-sm font-medium text-black/70">
                            {userInfo?.city} , {userInfo?.country}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <div>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                className="h-10"
                                placeholder="Enter your name"
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                className="h-10"
                                placeholder="Enter your email"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="col-span-2">
                            <Textarea
                                id="bio"
                                name="bio"
                                className="h-10"
                                placeholder="Enter your bio"
                                {...register('bio')}
                            />
                            {errors.bio && (
                                <p className="text-xs text-red-500">
                                    {errors.bio.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <Input
                                id="phone"
                                name="phone"
                                className="h-10"
                                placeholder="Enter your phone number"
                                {...register('phone')}
                                onKeyPress={(event) => {
                                    const regex = /^[0-9]$/;
                                    if (!regex.test(event.key)) {
                                        event.preventDefault();
                                    }
                                    const currentValue = event.target.value;
                                    if (currentValue.length >= 10) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                            {errors.phone && (
                                <p className="text-xs text-red-500">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <Button
                        className="mt-7 min-h-10 min-w-32 cursor-pointer font-medium"
                        type="submit"
                    >
                        {loader ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white" />
                                Updating
                            </div>
                        ) : (
                            'Update'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
