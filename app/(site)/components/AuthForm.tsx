"use client"; //this makes the auth form intercative (buttons etc are not compatible with server components)

import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoding] = useState(false); // to disable buttons and inputs once the form is submitted
  
    const toggleVariant = useCallback(() => {
        if (variant == 'LOGIN') {
            setVariant('REGISTER');
        } else {
            setVariant('LOGIN');
        }
    }, [variant]);

    // const {extract functions}
    const {
        register, 
        handleSubmit, 
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoding(true);
        if(variant == 'REGISTER') {
            // Axios Register
        }

        if(variant == 'LOGIN') {
            // NextAuth SignIn
        }
    }

    const socialAction = (action: string) => {
        setIsLoding(true);
        // NextAuth Social SignIn
    }
  
    return <div>hello2222222222222234</div>;
};

export default AuthForm;
