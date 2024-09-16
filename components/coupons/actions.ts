'use server';

export async function applyCouponCode(data: FormData) {
  console.log({
    code: data.get('code'),
    agreement: data.get('agreement'),
  });
}
