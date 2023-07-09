import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';
import Alert from './alert';
import { fetchWrapper } from './fetchWrapper';

/*
sb-hln5e26538619@business.example.com
vK&?00G[
*/

export const Paypal = ({
  amount,
  name,
  summary,
  userId,
  tourId,
  disabled,
  selectedDate,
}) => {
  const [orderId, setOrderId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({});

  const creatOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: summary,
            amount: {
              currency_code: 'USD',
              value: amount,
            },
          },
        ],
      })
      .then((orderId) => {
        setOrderId(orderId);
        return orderId;
      });
  };
  const onApprove = (data, actions) => {
    return actions.order
      .capture()
      .then(async function (details) {
        let { message, data, status, loading } = await fetchWrapper(
          '/bookings/addbooking',
          'POST',
          JSON.stringify({
            tour: tourId,
            user: userId,
            selectedDate,
            price: amount,
            paid: true,
          }),
          { 'Content-Type': 'Application/json' }
        );
        if (status === 'success') {
          setAlertInfo({
            severity: 'success',
            title: 'Message',
            message:
              'Your Payment has been done successfully, ENJOY HAPPY TOUR!',
          });
          setShowAlert(true);
        } else {
          if (message.startsWith('E11000 duplicate key')) {
            message = 'You Allready have booked it!';
          }
          setAlertInfo({
            severity: 'error',
            title: 'Message',
            message,
          });
          setShowAlert(true);
        }
      })
      .catch((error) => console.log(error));
  };
  const onError = (err) => {
    setAlertInfo({
      severity: 'error',
      title: 'Message',
      message: 'An error has occurred with your payment',
    });
    setShowAlert(true);
  };
  if (showAlert) {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }

  return (
    <div style={{ width: '490px ' }}>
      {showAlert && (
        <Alert 
          severity={alertInfo.severity}
          title={alertInfo.title}
          message={alertInfo.message}
        />
      )}
      <h3
        style={{
          textTransform: 'uppercase',
          color: '#6cdc95',
          textAlign: 'center',
        }}
      >
        Price is ONly{' '}
        <span style={{ fontWeight: 800, fontSize: '20px' }}>{amount}$</span>
      </h3>
      <PayPalScriptProvider
        key={`${userId}-${tourId}`}
        options={{
          clientId:
            'AVHzWAFCcOxSsvMZOojh30s2mEx9f_5aP3pJ4RbgDiHoDSgpTJjCJmNTeT9a3_kpJaFsJZ2zA06f-OVX',
        }}
      >
        <PayPalButtons
          forceReRender={[amount, selectedDate]}
          // key={`${userId}-${tourId}`}
          disabled={disabled}
          // style={{ layout: 'vertical' }}
          createOrder={creatOrder}
          onApprove={onApprove}
          onError={onError}
        />
      </PayPalScriptProvider>
    </div>
  );
};
