'use client';

import { type } from "os";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { BiDollar } from "react-icons/bi";

interface InputProps {
    id: string;
    label: string;
    type?: string;
    disabled?: boolean;
    formatPrice?: boolean;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors
}

const Input: React.FC<InputProps> = ({
    id,
    label,
    type = "text",
    disabled,
    formatPrice,
    register,
    required,
    errors,
}) => {
  return (
    <div className="w-full relative">
        {formatPrice && (
            <BiDollar
                size={24}
                className="absolute top-5 left-2 text-neutral-500"
            />
        )}
        <input
            id={id}
            disabled={disabled}
            {...register(id, {required})}
            placeholder=""
            type={type}
            className={`
                w-full
                peer
                p-4
                pt-6
                font-light
                bg-white
                border-2
                rounded-md
                outline-none
                transition
                disabled:opacity-70
                disabled:cursor-not-allowed
                ${formatPrice ? 'pl-9' : 'pl-4'}
                ${errors[id] ? 'border-rose-500' : 'border-neutral-200'}
                ${errors[id] ? 'forcus:border-rose-500' : 'forcus:border-black'}
            `}
        />
        <label
            className={`
                absolute
                text-md
                duration-150
                transform
                -translate-y-3
                top-5
                z-10
                origin-[0]
                ${formatPrice ? 'left-9' : 'left-4'}
                peer-placeholder-shown:scale-100
            `}
        >
            {label}
        </label>
    </div>
  )
}

export default Input