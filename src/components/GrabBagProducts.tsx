import type { ExperimentProduct } from "@/db/schema";
import { grabBagRow } from "@/lib/grab-bag";

const linkClass =
  "font-semibold text-sage-800 underline-offset-2 hover:underline";

/**
 * Each buy-list row: material name, then its Amazon link on the same line.
 */
export function GrabBagProducts({
  products,
  className = "mt-4",
}: {
  products: ExperimentProduct[];
  className?: string;
}) {
  if (products.length === 0) return null;
  return (
    <ul className={`${className} space-y-3`}>
      {products.map((product) => {
        const row = grabBagRow(product);
        return (
          <li key={`${row.material}-${product.asin ?? product.amazonUrl ?? product.name}`}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <span className="font-semibold text-ink">{row.material}</span>
              {row.href && row.linkLabel && (
                <a
                  href={row.href}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className={linkClass}
                >
                  {row.linkLabel}
                </a>
              )}
            </div>
            {product.note && <p className="mt-0.5 text-sm text-ink-muted">{product.note}</p>}
          </li>
        );
      })}
    </ul>
  );
}
