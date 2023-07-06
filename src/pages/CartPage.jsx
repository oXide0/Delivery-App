import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import { useGetCartQuery, useRemoveGoodsMutation } from '../services/cartApi';
import CircularProgress from '@mui/joy/CircularProgress';
import NotFound from '../components/NotFound';
import BasketGoodsCard from '../components/BasketGoodsCard';
import { useAddOrderMutation } from '../services/orderApi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setDisbaled } from '../features/shop/shopSlice';
import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { totalPrice } from '../utils/totalPrice.js';

function CartPage() {
	const [userData, setUserData] = useState({ name: '', email: '', phone: '', address: '' });
	const [errorMessage, setErrorMessage] = useState(false);
	const { data, error, isLoading } = useGetCartQuery();
	const [addOrder] = useAddOrderMutation();
	const [removeGoods] = useRemoveGoodsMutation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [coupon, setCoupon] = useState('');

	const handleSubmit = () => {
		for (let item in userData) {
			if (userData[item].trim() === '' || data.length === 0) {
				setErrorMessage(true);
				return;
			}
		}
		const order = {};
		order.id = nanoid();
		order.food = data;
		order.user = userData;
		addOrder(order);
		data.map((order) => removeGoods(order));
		setErrorMessage(false);
		dispatch(setDisbaled(false));
		navigate('/success');
	};

	if (isLoading) {
		return <CircularProgress sx={{ position: 'absolute', left: '49%', top: '49%' }} />;
	}
	if (error) {
		return <NotFound title='stores' />;
	}
	return (
		<div className='wrapper'>
			<div style={{ display: 'flex', justifyContent: 'center', gap: '40px', paddingTop: '20px' }}>
				<form
					style={{ width: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}
					className='cart__form'
				>
					<iframe
						src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d42593.73154113143!2d17.106447025914203!3d48.14671879999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c893b86dfef1f%3A0x97a96066e3908558!2sNivy%20centrum!5e0!3m2!1suk!2sde!4v1688581901405!5m2!1suk!2sde'
						width={500}
						height={250}
						style={{ border: 0 }}
						allowFullScreen=''
						loading='lazy'
						referrerPolicy='no-referrer-when-downgrade'
						className='google__map'
					/>

					{errorMessage ? (
						<Typography level='h5' color='danger'>
							All fields must be filled
						</Typography>
					) : (
						''
					)}
					<FormControl>
						<FormLabel>Name</FormLabel>
						<Input
							placeholder='Name'
							color={errorMessage ? 'danger' : 'neutral'}
							value={userData.name}
							onChange={(e) => setUserData({ ...userData, name: e.target.value })}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Email</FormLabel>
						<Input
							placeholder='Email'
							type='email'
							color={errorMessage ? 'danger' : 'neutral'}
							onChange={(e) => setUserData({ ...userData, email: e.target.value })}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Phone</FormLabel>
						<Input
							placeholder='Phone'
							type='tel'
							color={errorMessage ? 'danger' : 'neutral'}
							onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Address</FormLabel>
						<Input
							placeholder='Address'
							color={errorMessage ? 'danger' : 'neutral'}
							onChange={(e) => setUserData({ ...userData, address: e.target.value })}
						/>
					</FormControl>
				</form>
				<div className='cart__block'>
					{data.map((item) => {
						return <BasketGoodsCard key={item.id} goods={item} />;
					})}
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					padding: '30px 0',
					alignItems: 'center',
					gap: '40px',
				}}
			>
				<Input
					placeholder='Coupon'
					color='neutral'
					value={coupon}
					onChange={(e) => setCoupon(e.target.value)}
				/>
				<Typography level='h5'>Total price: {totalPrice(data, coupon)}€</Typography>
				<Button color='neutral' size='lg' onClick={handleSubmit}>
					Submit
				</Button>
			</div>
		</div>
	);
}

export default CartPage;
