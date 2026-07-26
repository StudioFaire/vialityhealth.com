import Link from "next/link";

export default function CartPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-serif text-primary mb-4">Your Cart</h1>
      <p className="text-foreground/60 mb-8">
        Use the cart drawer to manage your items, or continue shopping.
      </p>
      <Link
        href="/shop"
        className="px-8 py-3 bg-primary text-white rounded-full font-medium tracking-wide uppercase text-sm"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
