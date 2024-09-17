'use server';

export async function applyCouponCode(data: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const rawData = {
    code: data.get('code'),
    agreement: data.get('agreement'),
  };

  console.log('Applying coupon code:', rawData);
}
