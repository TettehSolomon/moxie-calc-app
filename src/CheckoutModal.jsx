import { useState } from 'react'
import { naira } from './utils.js'
import { CHECKOUT_CHANNELS } from './config.js'

/* ============================================================================
 *  CHECKOUT POPUP
 *  Mirrors the real order dialog from the live Moxie app so the boss can see
 *  exactly what an order would look like.
 *
 *  ⚠️ NO DATABASE / NO EMAIL is wired up yet (by design). Everything the
 *  customer types is collected and handed to placeOrder() below.
 *
 *  👉 WHEN YOU'RE READY TO ACTUALLY SUBMIT ORDERS, fill in placeOrder().
 *     That is the ONE place to add an API call / email / etc.
 * ==========================================================================*/
function placeOrder(order) {
  // `order` contains: customer details, channel, items, totals, promo, mode.
  console.log('[placeOrder] order ready to submit:', order)
  // TODO: send `order` to a backend / email service when the boss wants it.
  return true
}

export default function CheckoutModal({
  mode,
  items,
  totalAmount,
  totalUnits,
  promoMessage,
  onClose,
}) {
  const [form, setForm] = useState({
    customername: '',
    customeraddress: '',
    customerphone: '',
    customeremail: '',
    channel_option: '',
  })
  const [otherChannels, setOtherChannels] = useState(['']) // for the "Others" case
  const [placed, setPlaced] = useState(false)

  const showOthers = form.channel_option === 'Others'

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // Build the final channel string (mirrors the live app's buildChannelValue)
  function finalChannel() {
    if (showOthers) {
      const details = otherChannels.map((c) => c.trim()).filter(Boolean)
      return details.length ? `Others: ${details.join(', ')}` : 'Others'
    }
    return form.channel_option || ''
  }

  function handleSubmit(e) {
    e.preventDefault()
    const order = {
      mode: mode.label,
      customer: {
        name: form.customername,
        address: form.customeraddress,
        phone: form.customerphone,
        email: form.customeremail,
      },
      channel: finalChannel(),
      items: items.map((r) => ({
        product_id: r.id,
        name: r.name,
        quantity: r.qty,
        price: r.price,
        amount: r.amount,
      })),
      totalUnits,
      totalAmount,
      promo: promoMessage || null,
    }
    placeOrder(order)
    setPlaced(true)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4"
      onMouseDown={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl max-h-[92vh] overflow-y-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Titlebar */}
        <div className="flex items-center justify-between bg-moxie text-white px-4 py-3 rounded-t-xl sticky top-0">
          <h2 className="font-bold">Confirm your order</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none hover:opacity-80"
          >
            &times;
          </button>
        </div>

        {placed ? (
          /* Simple confirmation state (no DB — just acknowledges) */
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-lg font-semibold text-moxie">Order captured</p>
            <p className="text-sm text-gray-500 mt-1">
              (Demo only — nothing was saved or sent.)
            </p>
            <button
              onClick={onClose}
              className="mt-5 px-5 py-2 rounded-md bg-moxie text-white font-semibold hover:opacity-90"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Left: customer form */}
            <form onSubmit={handleSubmit} className="md:col-span-1 space-y-2">
              <input
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-moxie focus:ring-2 focus:ring-moxie-accent/40 outline-none"
                placeholder="Enter your name"
                value={form.customername}
                onChange={(e) => update('customername', e.target.value)}
              />
              <textarea
                required
                rows="3"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-moxie focus:ring-2 focus:ring-moxie-accent/40 outline-none"
                placeholder="Enter your delivery address"
                value={form.customeraddress}
                onChange={(e) => update('customeraddress', e.target.value)}
              />
              <input
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-moxie focus:ring-2 focus:ring-moxie-accent/40 outline-none"
                placeholder="Enter your phone number"
                value={form.customerphone}
                onChange={(e) => update('customerphone', e.target.value)}
              />
              <input
                required
                type="email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-moxie focus:ring-2 focus:ring-moxie-accent/40 outline-none"
                placeholder="Enter your email address"
                value={form.customeremail}
                onChange={(e) => update('customeremail', e.target.value)}
              />

              {/* Procurement channel */}
              <select
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-moxie focus:ring-2 focus:ring-moxie-accent/40 outline-none"
                value={form.channel_option}
                onChange={(e) => update('channel_option', e.target.value)}
              >
                <option value="">Select Procurement Channel⏷</option>
                {CHECKOUT_CHANNELS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* "Others" free-text rows */}
              {showOthers && (
                <div className="space-y-1.5">
                  {otherChannels.map((val, i) => (
                    <input
                      key={i}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-moxie"
                      value={val}
                      onChange={(e) => {
                        const next = [...otherChannels]
                        next[i] = e.target.value
                        setOtherChannels(next)
                      }}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setOtherChannels((p) => [...p, ''])}
                    className="text-xs rounded-full bg-gray-200 hover:bg-gray-300 px-3 py-1"
                  >
                    + click to add more channels
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-1 px-4 py-2 rounded-md bg-moxie text-white font-semibold hover:opacity-90"
              >
                Place Order
              </button>
            </form>

            {/* Right: order breakdown */}
            <div className="md:col-span-2">
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="text-left px-3 py-2">SN</th>
                      <th className="text-left px-3 py-2">Product</th>
                      <th className="text-right px-3 py-2">Price (₦)</th>
                      <th className="text-center px-3 py-2">Qty</th>
                      <th className="text-right px-3 py-2">Amount (₦)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((r, i) => (
                      <tr key={r.id} className="border-t border-gray-100">
                        <td className="px-3 py-2">{i + 1}</td>
                        <td className="px-3 py-2">{r.name}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{naira(r.price)}</td>
                        <td className="px-3 py-2 text-center">{r.qty}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{naira(r.amount)}</td>
                      </tr>
                    ))}

                    {/* Promo row inside the dialog (matches #promorow-dialog) */}
                    {promoMessage && (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-3 py-2 text-right font-bold text-moxie bg-moxie-accent/10"
                        >
                          {promoMessage}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <p className="text-right text-lg font-bold mt-3">
                Total Amount: {naira(totalAmount)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
