import { useMemo, useState } from 'react'
import { naira, computePromo } from './utils.js'
import CheckoutModal from './CheckoutModal.jsx'

export default function Calculator({ mode }) {
  // quantities keyed by product id: { 1: 2, 2: 14, ... }
  const [quantities, setQuantities] = useState({})
  const [showCheckout, setShowCheckout] = useState(false)

  function setQty(id, value) {
    const n = parseInt(value, 10)
    setQuantities((prev) => ({ ...prev, [id]: Number.isFinite(n) && n > 0 ? n : 0 }))
  }

  // Derived order data (recalculated on every keystroke)
  const { rows, selectedRows, totalAmount, totalUnits, promo } = useMemo(() => {
    const rows = mode.products.map((p) => {
      const qty = p.active ? Number(quantities[p.id]) || 0 : 0
      return { ...p, qty, amount: qty * p.price }
    })
    const selectedRows = rows.filter((r) => r.qty > 0)
    const totalAmount = selectedRows.reduce((s, r) => s + r.amount, 0)
    const totalUnits = selectedRows.reduce((s, r) => s + r.qty, 0)
    const promo = computePromo(mode, quantities)
    return { rows, selectedRows, totalAmount, totalUnits, promo }
  }, [mode, quantities])

  const hasSelection = selectedRows.length > 0

  // The mirrored promo message (wording matches the live Moxie app)
  const promoMessage = promo.eligible
    ? `LAUNCH PROMO: you are entitled to ${promo.freeUnits} free ${
        promo.freeUnits === 1 ? mode.unit : mode.unitPlural
      }`
    : null

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6">
      {/* Accent bar */}
      <div className="mx-auto mb-5 h-1 w-16 rounded bg-moxie-accent" />

      {/* Top summary line (matches #ordersummarytop in the live app) */}
      {hasSelection && (
        <p className="text-right text-base sm:text-lg italic text-gray-700 mb-2">
          Products selected ({selectedRows.length}). Total Amount: {naira(totalAmount)}
        </p>
      )}

      {/* ---------- Products table (desktop) ---------- */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="text-left font-bold px-4 py-3">Product</th>
              <th className="text-left font-bold px-4 py-3">Packaging</th>
              <th className="text-right font-bold px-4 py-3">Unit Price (₦)</th>
              <th className="text-center font-bold px-4 py-3">Quantity</th>
              <th className="text-right font-bold px-4 py-3">Amount (₦)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className={
                  'border-t border-gray-100 ' +
                  (r.active ? 'hover:bg-moxie-accent/10' : 'bg-gray-50 text-gray-400')
                }
              >
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{mode.packaging}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {naira(r.price).replace('₦', '')}
                </td>
                <td className="px-4 py-3 text-center">
                  <QtyInput
                    value={quantities[r.id] ?? ''}
                    disabled={!r.active}
                    onChange={(v) => setQty(r.id, v)}
                  />
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{naira(r.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- Products cards (mobile) ---------- */}
      <div className="md:hidden space-y-3">
        {rows.map((r) => (
          <div
            key={r.id}
            className={
              'rounded-lg border p-4 ' +
              (r.active
                ? 'border-gray-200 bg-white'
                : 'border-gray-200 bg-gray-50 text-gray-400')
            }
          >
            <div className="font-semibold mb-1">{r.name}</div>
            <div className="text-xs text-gray-500 mb-3">{mode.packaging}</div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm">
                <div className="text-gray-500">Unit Price</div>
                <div className="font-medium tabular-nums">{naira(r.price)}</div>
              </div>
              <QtyInput
                value={quantities[r.id] ?? ''}
                disabled={!r.active}
                onChange={(v) => setQty(r.id, v)}
              />
              <div className="text-sm text-right">
                <div className="text-gray-500">Amount</div>
                <div className="font-semibold tabular-nums">{naira(r.amount)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Order summary + promo (matches #ordersummary / #promoline) ---------- */}
      <div className="mt-5">
        {hasSelection && (
          <p className="text-right text-base sm:text-lg italic text-gray-700">
            Products selected ({selectedRows.length}). Total Amount: {naira(totalAmount)}
          </p>
        )}

        {/* Promo line — bold purple, right-aligned, just like the live app */}
        {promoMessage && (
          <p className="text-right text-moxie font-bold mt-1">{promoMessage}</p>
        )}
      </div>

      {/* ---------- Checkout button ---------- */}
      <div className="mt-5 text-right">
        <button
          onClick={() => setShowCheckout(true)}
          disabled={!hasSelection}
          className={
            'px-6 py-2.5 rounded-md text-white font-semibold transition ' +
            (hasSelection
              ? 'bg-moxie hover:opacity-90'
              : 'bg-gray-300 cursor-not-allowed')
          }
        >
          Checkout
        </button>
      </div>

      {/* ---------- Checkout popup (mirrors the real order dialog) ---------- */}
      {showCheckout && (
        <CheckoutModal
          mode={mode}
          items={selectedRows}
          totalAmount={totalAmount}
          totalUnits={totalUnits}
          promoMessage={promoMessage}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  )
}

/* Reusable quantity input */
function QtyInput({ value, disabled, onChange }) {
  return (
    <input
      type="number"
      min="0"
      inputMode="numeric"
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={
        'w-20 rounded-md border px-2 py-1.5 text-center outline-none ' +
        (disabled
          ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
          : 'border-gray-300 focus:border-moxie focus:ring-2 focus:ring-moxie-accent/40')
      }
    />
  )
}
