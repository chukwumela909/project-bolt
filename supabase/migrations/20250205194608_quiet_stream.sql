-- Promote the first user to admin
UPDATE profiles
SET role = 'admin'
WHERE email = (
  SELECT email 
  FROM profiles 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- Log the promotion
INSERT INTO audit_logs (
  action,
  entity_type,
  entity_id,
  old_data,
  new_data
)
VALUES (
  'promote_to_admin',
  'profile',
  (SELECT email FROM profiles ORDER BY created_at ASC LIMIT 1),
  jsonb_build_object('role', 'user'),
  jsonb_build_object('role', 'admin')
);