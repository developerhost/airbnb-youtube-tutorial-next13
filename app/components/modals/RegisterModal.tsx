/*
Airbnbのサイトで新規登録するためのモーダルを定義しています。
ユーザーがフォームに必要事項を入力し、送信すると、axiosを使ってAPIエンドポイントにデータを送信します。
その後、成功した場合はログインモーダルを開き、失敗した場合はエラートーストを表示します。
また、GoogleアカウントやGithubアカウントを使用して登録することもできます。
*/

'use client'

// ライブラリのインポート
import axios from 'axios'; // HTTPクライアント
import { AiFillGithub } from 'react-icons/ai'; // Githubアイコン
import { FcGoogle } from 'react-icons/fc'; // Googleアイコン
import { useCallback, useState } from 'react'; // React Hooks
import {
    FieldValues,
    SubmitHandler,
    useForm,
} from 'react-hook-form'; // フォームバリデーションライブラリ

// カスタムフックのインポート
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';

// コンポーネントのインポート
import Modal from '@/app/components/modals/Modal';
import Heading from '@/app/components/Heading';
import Input from '@/app/components/inputs/Input';
import Button from '../Button';

// その他のライブラリのインポート
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';

// RegisterModalコンポーネントの定義
const RegisterModal = () => {
  // カスタムフックの呼び出し
  const registerModal = useRegisterModal()
  const loginModal = useLoginModal()

  // ステート変数の定義
  const [isLoading, setIsLoading] = useState(false);

  // フォームバリデーションの設定
  const {
    register,
    handleSubmit,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  });

  // フォームの送信処理
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios.post('/api/register', data)
      .then(() => {
        toast.success('Registration successful');
        registerModal.onClose();
        loginModal.onOpen();
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // ログインフォームとの切り替え処理
  const toggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, registerModal])

  // モーダルの中身を定義
  const bodyContet = (
    <div className="flex flex-col gap-4">
      <Heading 
        title="Sign up to Airbnb"
        subtitle="Already have an account?"
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
        id="name"
        label="Name"
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

  // モーダルのフッターを定義
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
            onClick={toggle}
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

  // モーダルを返す
  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel='Continue'
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContet}
      footer={footerContent}
    />
  )
}

export default RegisterModal
