export default function LotusSystemsUIReference() {
  const products = [
    {
      name: 'Smart POS',
      desc: 'Sell, manage inventory, sync orders, and connect optional Salesforce workflows.',
      price: 'From $49/mo',
      status: 'Live'
    },
    {
      name: 'Booking Platform',
      desc: 'Reservations, customer records, and operational dashboards for service businesses.',
      price: 'From $79/mo',
      status: 'Planned'
    },
    {
      name: 'Inventory Control',
      desc: 'Stock movement, supplier visibility, reorder levels, and reporting.',
      price: 'Custom',
      status: 'Planned'
    }
  ]

  const stats = [
    ['Products', '3'],
    ['Active Tenants', '128'],
    ['Provisioning Jobs', '12'],
    ['Monthly Revenue', '$18.4K']
  ]

  const provisioningSteps = [
    'Choose product and plan',
    'Select or connect domain',
    'Select dedicated database',
    'Complete billing',
    'Provision isolated environment',
    'Send launch access to customer'
  ]

  const jobs = [
    {
      customer: 'Cinnamon Retail',
      product: 'Smart POS',
      domain: 'pos.cinnamonretail.com',
      db: 'Dedicated PostgreSQL',
      status: 'Provisioning'
    },
    {
      customer: 'Lotus Mart',
      product: 'Smart POS',
      domain: 'lotusmartpos.com',
      db: 'Customer Managed DB',
      status: 'Domain Verification'
    },
    {
      customer: 'Blue Orchid Foods',
      product: 'Booking Platform',
      domain: 'app.blueorchidfoods.com',
      db: 'Dedicated PostgreSQL',
      status: 'Active'
    }
  ]

  const nav = ['Products', 'Plans', 'Provisioning', 'Admin', 'Support']

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Lotus Systems</div>
            <div className="text-2xl font-bold">Marketplace + Provisioning Platform</div>
          </div>
          <nav className="hidden gap-6 md:flex">
            {nav.map((item) => (
              <a key={item} className="text-sm font-medium text-slate-600 hover:text-slate-900" href="#">
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="mb-3 inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
              Main Marketplace Website
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight">
              Sell software products, let customers choose their domain and database, and launch isolated deployments.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              This reference UI gives GitHub Copilot clear direction for Lotus Systems: a product marketplace, a guided onboarding wizard,
              and an internal control dashboard for provisioning and support.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Start Free Demo</button>
              <button className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">View Products</button>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-sm text-slate-500">{label}</div>
                  <div className="mt-2 text-2xl font-bold">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Checkout Summary</div>
            <div className="mt-6 rounded-2xl bg-white/10 p-5">
              <div className="text-sm text-slate-300">Selected Product</div>
              <div className="mt-1 text-xl font-semibold">Smart POS · Growth Plan</div>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-200">
              <div className="flex justify-between"><span>Domain</span><span>Buy new domain</span></div>
              <div className="flex justify-between"><span>Database</span><span>Dedicated DB</span></div>
              <div className="flex justify-between"><span>Provisioning</span><span>Isolated deploy</span></div>
              <div className="flex justify-between border-t border-white/10 pt-3 font-semibold text-white"><span>Total</span><span>$149/mo</span></div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Products Section</div>
              <h2 className="mt-2 text-3xl font-bold">Product cards for the marketplace homepage</h2>
            </div>
            <button className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold">Manage Catalog</button>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.name} className="rounded-3xl border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{product.status}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{product.desc}</p>
                <div className="mt-6 text-lg font-bold">{product.price}</div>
                <button className="mt-5 w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800">View details</button>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Onboarding Wizard</div>
            <h2 className="mt-2 text-3xl font-bold">Customer signup and provisioning flow</h2>
            <div className="mt-6 space-y-4">
              {provisioningSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-4 rounded-2xl border border-slate-200 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{step}</div>
                    <div className="text-sm text-slate-500">Clear, sequential onboarding for customers buying their own environment.</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Admin Dashboard</div>
            <h2 className="mt-2 text-3xl font-bold">Provisioning jobs and tenant control view</h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Domain</th>
                    <th className="px-4 py-3 font-semibold">Database</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.customer} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium">{job.customer}</td>
                      <td className="px-4 py-3">{job.product}</td>
                      <td className="px-4 py-3">{job.domain}</td>
                      <td className="px-4 py-3">{job.db}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{job.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">UI Notes for Copilot</div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="font-semibold">Screen 1 · Marketplace</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Public-facing product pages, pricing, feature comparisons, call-to-action buttons, and checkout entry points.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="font-semibold">Screen 2 · Onboarding</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Wizard screens for plan selection, domain choice, database choice, billing, and provisioning progress.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="font-semibold">Screen 3 · Admin</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Internal dashboard for products, tenants, subscriptions, domains, databases, jobs, support, and audit logs.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
