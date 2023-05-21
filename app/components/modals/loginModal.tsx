'use client';

import { signIn } from 'next-auth/react';
import axios from 'axios';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from 'react';
import {
    FieldValues,
    SubmitHandler,
    useForm,
} from 'react-hook-form';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import Modal from '@/app/components/modals/Modal';
import Heading from '@/app/components/Heading';
import Input from '@/app/components/inputs/Input';
import { toast } from 'react-hot-toast';
import Button from '../Button';
import { useRouter } from 'next/navigation';

const LoginModal = () => {
  const router = useRouter();
  const registerModal = useRegisterModal()
  const loginModal = useLoginModal()
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    signIn('credentials', {
      ...data,
      redirect: false,
      })
      .then((callback) => {
        setIsLoading(false);

        if (callback?.ok) {
          toast.success('Login successfully');
          router.refresh();
          loginModal.onClose();
      }

      if (callback?.error) {
        toast.error(callback.error);
      }
    })
  };

  const bodyContet = (
    <div className="flex flex-col gap-4">
      <Heading 
        title="Login to Airbnb"
        subtitle="Welcome back"
      />
      <Input 
        id="email"
        label="Email address"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input 
        id="password"
        label="password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  )

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn('google')}
      ></Button>
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn('github')}
      ></Button>
      <div className='
        text-neutral-500
        text-center
        mt-4
        font-light
      '
      >
        <div className='justify-center flex flex-row items-center gap-2'>
          <div>
            Already have an account?
          </div>
          <div 
            onClick={loginModal.onClose}
            className='
              text-neutral-800
              cursor-pointer
              hover:underline
            '
          >
            Log in
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="login"
      actionLabel='Continue'
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContet}
      footer={footerContent}
    />
  )
}

export default LoginModal