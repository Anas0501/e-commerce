import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, newOrder } from '../../actions/orderAction'; // Import newOrder action creator
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MetaData from '../Layouts/MetaData';
import Stepper from './Stepper';
import { useNavigate } from 'react-router-dom';
import PriceSidebar from './PriceSidebar';

const Payment = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const [payDisable, setPayDisable] = useState(false);
	const { shippingInfo, cartItems } = useSelector((state) => state.cart);
	const { user } = useSelector((state) => state.user);
	const { error } = useSelector((state) => state.newOrder);

	const totalPrice = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);

	const [paymentData, setPaymentData] = useState({
		amount: Math.round(totalPrice),
		email: user.email,
		phoneNo: shippingInfo.phoneNo,
		selectedOption: '',
	});

	const submitHandler = async (e) => {
		e.preventDefault();
		setPayDisable(true);

		try {
			var redirect_url = '';
			const site_name = 'Shopping website';
			const upi_address = 'merchant1068689.augp@aubank';
			const amt = paymentData.amount;

			if (paymentData.selectedOption === 'paytm') {
				redirect_url =
					'paytmmp://pay?pa=' +
					upi_address +
					'&pn=' +
					site_name +
					'&am=' +
					amt +
					'&tr=H2MkMGf5olejI&mc=8931&cu=INR&tn=' +
					site_name;
			} else if (paymentData.selectedOption === 'phonepe') {
				redirect_url =
					'phonepe://pay?pa=' +
					upi_address +
					'&pn=' +
					site_name +
					'&am=' +
					amt +
					'&tr=H2MkMGf5olejI&mc=8931&cu=INR&tn=' +
					site_name;
			} else if (paymentData.selectedOption === 'gpay') {
				redirect_url =
					'tez://upi/pay?pa=' +
					upi_address +
					'&pn=' +
					site_name +
					'&am=' +
					amt +
					'&tr=H2MkMGf5olejI&mc=8931&cu=INR&tn=' +
					site_name;
			} else if (paymentData.selectedOption === 'whatsApp') {
				redirect_url =
					'whatsapp://pay?pa=' +
					upi_address +
					'&pn=' +
					site_name +
					'&am=' +
					amt +
					'&tr=H2MkMGf5olejI&mc=8931&cu=INR&tn=' +
					site_name;
			}

			window.location.href = redirect_url;

			const paymentId = uuidv4();

			const order = {
				shippingInfo: shippingInfo,
				orderItems: cartItems.map(item => ({
						name: item.name,
						price: item.price,
						quantity: item.quantity,
						image: item.image,
						product: item.product,
				})),
				user: user._id,
				paymentInfo: {
						id: paymentId,
						status: 'paid',
				},
				totalPrice: totalPrice
			};
			console.log('orderData:', order);
			
			dispatch(newOrder(order)).then(() => {
				navigate('/')
			})
		} catch (error) {
			setPayDisable(false);
			const errorMessage = error.response
				? error.response.data.message
				: 'An error occurred';
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	};

	const handlePaymentOptionChange = (event) => {
		setPaymentData({ ...paymentData, selectedOption: event.target.value });
		setPayDisable(false);
	};

	useEffect(() => {
		if (error) {
			dispatch(clearErrors());
			enqueueSnackbar(error, { variant: 'error' });
		}
	}, [dispatch, error, enqueueSnackbar]);

	return (
		<>
			<MetaData title='Flipkart: Secure Payment | Paytm' />

			<main className='w-full mt-20'>
				<div className='flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7'>
					<div className='flex-1'>
						<Stepper activeStep={3}>
							<div className='w-full bg-white'>
								<form
									onSubmit={submitHandler}
									autoComplete='off'
									className='flex flex-col justify-start gap-2 w-full mx-8 my-4 overflow-hidden'
								>
									<FormControl component='fieldset'>
										<RadioGroup
											aria-labelledby='payment-radio-group'
											name='payment-radio-button'
											value={paymentData.selectedOption}
											onChange={handlePaymentOptionChange}
										>
											<FormControlLabel
												value='paytm'
												control={<Radio />}
												label={
													<div className='flex items-center gap-4'>
														<img
															draggable='false'
															className='h-7 w-7 object-contain'
															src='https://rukminim1.flixcart.com/www/96/96/promos/01/09/2020/a07396d4-0543-4b19-8406-b9fcbf5fd735.png'
															alt='Paytm Logo'
														/>
														<span>Paytm</span>
													</div>
												}
											/>
											<FormControlLabel
												value='phonepe'
												control={<Radio />}
												label={
													<div className='flex items-center gap-4'>
														<img
															draggable='false'
															className='h-7 w-7 object-contain'
															src='https://w7.pngwing.com/pngs/345/591/png-transparent-phonepe-hd-logo.png'
															alt='PhonePay Logo'
														/>
														<span>PhonePe</span>
													</div>
												}
											/>
											<FormControlLabel
												value='gpay'
												control={<Radio />}
												label={
													<div className='flex items-center gap-4'>
														<img
															draggable='false'
															className='h-7 w-7 object-contain'
															src='https://w7.pngwing.com/pngs/1016/761/png-transparent-gpay-logo.png'
															alt='gpay Logo'
														/>
														<span>GPay</span>
													</div>
												}
											/>
											<FormControlLabel
												value='whatsApp'
												control={<Radio />}
												label={
													<div className='flex items-center gap-4'>
														<img
															draggable='false'
															className='h-7 w-7 object-contain'
															src='https://png.pngtree.com/element_our/sm/20180626/sm_5b321c99945a2.jpg'
															alt='bhim Logo'
														/>
														<span>WhatsApp Pay</span>
													</div>
												}
											/>
										</RadioGroup>
									</FormControl>

									<input
										type='submit'
										value={`Pay ₹${totalPrice.toLocaleString()}`}
										disabled={payDisable}
										className={`${
											payDisable
												? 'bg-primary-grey cursor-not-allowed'
												: 'bg-primary-orange cursor-pointer'
										} w-1/2 sm:w-1/4 my-2 py-3 font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none`}
									/>
								</form>
							</div>
						</Stepper>
					</div>
					<PriceSidebar cartItems={cartItems} />
				</div>
			</main>
		</>
	);
};

export default Payment;
