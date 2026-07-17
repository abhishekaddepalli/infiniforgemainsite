
CREATE POLICY "Anyone can log whatsapp orders" ON public.module_records
  FOR INSERT TO anon, authenticated
  WITH CHECK (module = 'whatsapp_orders');
