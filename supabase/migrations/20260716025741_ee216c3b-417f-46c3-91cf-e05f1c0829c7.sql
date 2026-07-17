
CREATE POLICY "Staff can insert user notifications"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Users can insert own notifications"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (audience = 'user' AND user_id = auth.uid());
