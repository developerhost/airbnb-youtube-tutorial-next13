'use client';

import {AiOutlineMenu} from 'react-icons/ai'
import Avatar from '../Avatar'
import MenuItem from './MenuItem'
import { useCallback, useState } from 'react';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';

const UserMenu = () => {
    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()
    const [isOpen , setIsOpen] = useState(false);  

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value)
    }, [])

    return (
    <div className="relative">
        <div className="flex flex-row items-center gap-3">
            <div 
                // onClick={() => {}}
                className="hidden md:block text-sm font-semibold px-4 py-3 rounded-full hover:bg-neutral-100 transition cursor-pointer"
            >
                Airbnb your home
            </div>
            <div 
                onClick={toggleOpen}
                className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 rounded-full flex flex-row items-center gap-3 transition cursor-pointer hover:shadow-md"
            >
                <AiOutlineMenu />
                <div className='hidden md:block'>
                    <Avatar />
                </div>
            </div>
        </div>
        {isOpen && (
            <div className="absolute top-12 right-0 w-[40vw] bg-white shadow-md rounded-xl text-sm overflow-hidden md:w-3/4">
                <div className='flex flex-col cursor-p@ointer'>
                    <>
                        <MenuItem
                            label="Login"
                            onClick={loginModal.onOpen}
                        />
                        <MenuItem
                            label="Sign up"
                            onClick={registerModal.onOpen}
                        />
                    </>
                </div>
            </div>    
        )}
    </div>
  )
}

export default UserMenu