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

      {/* ---------- Products table ----------
           Mirrors the live Moxie app: a single real table that scrolls
           horizontally on small screens (NO card layout), sticky header,
           1px #ddd cell borders, zebra striping, and purple row hover.
           Scroll container matches the live `overflow:auto; max-height:60vh`. */}
      <div
        className="overflow-auto rounded-md"
        style={{ maxHeight: '60vh', border: '1px solid #ddd' }}
      >
        <table
          className="w-full text-[12px] sm:text-[13px] md:text-sm"
          style={{ borderCollapse: 'collapse' }}
        >
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="text-left font-bold" style={cellHead}>Product</th>
              <th className="text-left font-bold" style={cellHead}>Packaging</th>
              <th className="text-right font-bold" style={cellHead}>Unit Price (₦)</th>
              <th className="text-center font-bold" style={cellHead}>Quantity</th>
              <th className="text-right font-bold" style={cellHead}>Amount (₦)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.id}
                className={r.active ? 'moxie-row' : 'text-gray-400'}
                style={{ backgroundColor: i % 2 === 1 ? '#fafafa' : '#fff' }}
              >
                <td style={cell}>{r.name}</td>
                <td style={cell}>{mode.packaging}</td>
                <td className="tabular-nums" style={{ ...cell, textAlign: 'right' }}>
                  {naira(r.price).replace('₦', '')}
                </td>
                <td style={{ ...cell, textAlign: 'center' }}>
                  <QtyInput
                    value={quantities[r.id] ?? ''}
                    disabled={!r.active}
                    onChange={(v) => setQty(r.id, v)}
                  />
                </td>
                <td className="tabular-nums" style={{ ...cell, textAlign: 'right' }}>
                  {naira(r.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

/* Cell styles that mirror the live app's table
   (1px #ddd borders, 8px 10px padding). Kept as inline styles so the exact
   look survives regardless of Tailwind resets. */
const cell = { border: '1px solid #ddd', padding: '8px 10px', verticalAlign: 'middle' }
const cellHead = { ...cell, backgroundColor: '#f0f0f0' }

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
