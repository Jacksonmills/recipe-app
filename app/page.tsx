import ApplyCouponForm from "@/components/coupons/apply-coupon-form";
import RemoveCouponForm from "@/components/coupons/remove-coupon-form";

export default function Home() {
  return (
    <div className="grid">
      <img src="https://placeholdmon.vercel.app/1200x100" alt="" className="size-full object-contain col-start-1 row-start-1" />
      <div className="bg-gradient-to-tl from-transparent/0 to-transparent col-start-1 row-start-1 flex items-center justify-center p-4 font-bold">
        shadcn/ui {`<Form />`} Example with zod and react-hook-form
      </div>
      <div className="p-2 grid gap-2">
        <ApplyCouponForm />
        <RemoveCouponForm />
      </div>
    </div>
  );
}
