import { CartProduct } from './types';
import * as yup from 'yup';

export function getTotalPrice(products: CartProduct[]) {
    return products.map((item) => item.product.price * item.quantity).reduce((a, b) => a + b, 0);
}

export const loginValidationSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

export const registerValidationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

export const paymentValidationSchema = yup.object().shape({
    cardNumber: yup.string().required('Card number is required'),
    date: yup.string().required('Date is required'),
    cvc: yup.string().required('CVC is required'),
    name: yup.string().required('Name is required'),
});

export function parseDate(dateString: string): Date {
    return new Date(dateString);
}