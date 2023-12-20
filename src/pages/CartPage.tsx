import {
    Box,
    Button,
    Divider,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { Formik } from 'formik';
import Input from '../components/Input';
import Loader from '../components/Loader';
import PageLayout from '../layout/PageLayout';
import { useGetCartQuery } from '../services/cartApi';
import { useCreateOrderMutation } from '../services/orderApi';
import { CartProduct } from '../types';
import { getTotalPrice } from '../utils';

interface OrderFormValues {
    userId: number;
    totalPrice: number;
    status: string;
    date: string;
}

const CartPage = () => {
    const [createOrder] = useCreateOrderMutation();
    const { data, isLoading } = useGetCartQuery(1);

    const handleSubmit = async () => {
        await createOrder(10);
    };

    if (isLoading || !data) return <Loader />;

    return (
        <PageLayout>
            <Typography variant='h3' fontWeight={700}>
                Cart
            </Typography>
            <Grid container pt={5} columnSpacing={4}>
                <Grid item xs={12} sm={9}>
                    <ProductsTable products={data} />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <PaymentForm onSubmit={handleSubmit} products={data} />
                </Grid>
            </Grid>
        </PageLayout>
    );
};

export default CartPage;

const ProductsTable = ({ products }: { products: CartProduct[] }) => {
    return (
        <TableContainer component={Paper} sx={{ maxHeight: '500px' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Cart items</TableCell>
                        <TableCell align='center'>Price</TableCell>
                        <TableCell align='center'>Quantity</TableCell>
                        <TableCell align='center'>Subtotal</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((item) => (
                        <TableRow
                            key={item.cartItemId}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component='th' scope='row'>
                                {item.product.title}
                            </TableCell>
                            <TableCell align='center'>€{item.product.price}</TableCell>
                            <TableCell align='center'>{item.quantity}</TableCell>
                            <TableCell align='center'>
                                €{item.quantity * item.product.price}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const PaymentForm = ({
    onSubmit,
    products,
}: {
    onSubmit: (value: number) => void;
    products: CartProduct[];
}) => {
    return (
        <Formik
            initialValues={{ cardNumber: '', date: '', cvc: '', name: '', coupon: '' }}
            onSubmit={() => onSubmit(100)}
        >
            {({ values, handleChange, handleSubmit }) => (
                <>
                    <Box
                        component='form'
                        display='flex'
                        flexDirection='column'
                        height='100%'
                        onSubmit={handleSubmit}
                    >
                        <Typography variant='h4' fontWeight={700} textAlign='center' gutterBottom>
                            Payment Form
                        </Typography>
                        <Stack flex='1 1 auto' display='flex' gap={2} pt={3} flexDirection='column'>
                            <Input
                                name='cardNumber'
                                label='Credit card number'
                                value={values.cardNumber}
                                onChange={handleChange}
                            />
                            <Stack direction='row' gap={2}>
                                <Input
                                    name='date'
                                    label='Expire Date'
                                    value={values.date}
                                    onChange={handleChange}
                                />
                                <Input
                                    name='cvc'
                                    label='CVC code'
                                    value={values.cvc}
                                    onChange={handleChange}
                                />
                            </Stack>
                            <Input
                                name='name'
                                label='Name on the card'
                                value={values.name}
                                onChange={handleChange}
                            />
                            <Input
                                label='Coupon'
                                name='coupon'
                                value={values.coupon}
                                onChange={handleChange}
                            />
                            <Divider sx={{ borderWidth: 2, mt: 1, color: '#000' }} />
                            <Stack direction='row' justifyContent='space-between'>
                                <Typography variant='h6' fontWeight={700}>
                                    Total
                                </Typography>
                                <Typography variant='h6' fontWeight={700}>
                                    €{getTotalPrice(products)}
                                </Typography>
                            </Stack>
                        </Stack>

                        <Button type='submit' variant='contained' sx={{ py: 1.5, mt: 1 }}>
                            Pay
                        </Button>
                    </Box>
                </>
            )}
        </Formik>
    );
};
