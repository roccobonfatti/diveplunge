export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Impostazioni</h1>
      <section className="grid gap-2">
        <label className="flex items-center justify-between border p-3 rounded">
          <span>Riduci controlli mappa su mobile</span>
          <input type="checkbox" defaultChecked readOnly className="h-4 w-4" />
        </label>
        <label className="flex items-center justify-between border p-3 rounded">
          <span>Lingua</span>
          <select defaultValue="it" className="border p-2 rounded">
            <option value="it">Italiano</option>
            <option value="en">English</option>
          </select>
        </label>
      </section>
    </main>
  );
}
