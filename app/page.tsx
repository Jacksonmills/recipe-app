import ApplyCouponForm from '@/components/coupons/apply-coupon-form';
import RemoveCouponForm from '@/components/coupons/remove-coupon-form';
import NewsletterSignupForm from '@/components/newsletter-signup-form';

export default function Home() {
  return (
    <div>
      <div className="grid min-h-28">
        <img
          src="https://placeholdmon.vercel.app/1200x100"
          alt=""
          className="size-full object-cover object-left-bottom col-start-1 row-start-1"
        />
        <div className="bg-gradient-to-tl from-transparent/0 to-transparent col-start-1 row-start-1 flex items-center justify-center p-4 font-bold">
          shadcn/ui {'<Form />'} Example with zod and react-hook-form
        </div>
      </div>

      <div className="p-2 grid gap-2 grid-cols-2 grid-rows-3">
        <div className="row-span-1">
          <ApplyCouponForm />
        </div>
        <div className="row-span-1">
          <NewsletterSignupForm />
        </div>
        <div className="col-span-full row-span-2">
          <RemoveCouponForm />
        </div>
      </div>
    </div>
  );
}
