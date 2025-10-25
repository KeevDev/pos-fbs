-- ==========================================
-- SEED INITIAL DATA
-- ==========================================

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Detergentes', 'Productos de limpieza para ropa y superficies'),
('Desinfectantes', 'Productos para desinfección y eliminación de gérmenes'),
('Limpiadores', 'Productos para limpieza general del hogar'),
('Ambientadores', 'Productos para aromatizar espacios'),
('Cuidado Personal', 'Productos de higiene personal')
ON CONFLICT DO NOTHING;

-- Insert default units
INSERT INTO units (name, abbreviation) VALUES
('Unidad', 'und'),
('Litro', 'lt'),
('Kilogramo', 'kg'),
('Gramo', 'gr'),
('Mililitro', 'ml'),
('Caja', 'caja'),
('Paquete', 'paq')
ON CONFLICT DO NOTHING;

-- Insert default warehouse
INSERT INTO warehouses (name, address) VALUES
('Almacén Principal', 'Bodega central - Sede principal')
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO products (name, sku, description, category_id, unit_id, price, cost, min_stock) VALUES
('Detergente Ariel 1kg', 'DET-ARI-1KG', 'Detergente en polvo para ropa', 1, 3, 12500.00, 8500.00, 10),
('Desinfectante Lysol 500ml', 'DES-LYS-500ML', 'Desinfectante multiusos', 2, 5, 8900.00, 6200.00, 15),
('Limpiador Mr. Músculo 750ml', 'LIM-MRM-750ML', 'Limpiador desengrasante', 3, 5, 7800.00, 5400.00, 12),
('Ambientador Glade 300ml', 'AMB-GLA-300ML', 'Ambientador en aerosol', 4, 5, 6500.00, 4200.00, 20),
('Jabón Dove 90gr', 'JAB-DOV-90GR', 'Jabón de tocador', 5, 4, 3200.00, 2100.00, 25),
('Detergente Fab 2kg', 'DET-FAB-2KG', 'Detergente en polvo concentrado', 1, 3, 18900.00, 13500.00, 8),
('Desinfectante Pinesol 1lt', 'DES-PIN-1LT', 'Desinfectante con aroma a pino', 2, 2, 11200.00, 7800.00, 10),
('Limpiador Ajax 500ml', 'LIM-AJX-500ML', 'Limpiador cremoso multiusos', 3, 5, 4900.00, 3200.00, 18)
ON CONFLICT DO NOTHING;

-- Insert initial stock for products
INSERT INTO product_stock (product_id, warehouse_id, quantity) VALUES
(1, 1, 50),
(2, 1, 75),
(3, 1, 60),
(4, 1, 100),
(5, 1, 120),
(6, 1, 30),
(7, 1, 45),
(8, 1, 80)
ON CONFLICT DO NOTHING;

-- Insert sample customers
INSERT INTO customers (name, email, phone, document_type, document_number) VALUES
('Cliente General', NULL, NULL, NULL, NULL),
('María González', 'maria.gonzalez@email.com', '3001234567', 'CC', '12345678'),
('Juan Pérez', 'juan.perez@email.com', '3009876543', 'CC', '87654321'),
('Empresa ABC S.A.S.', 'contacto@empresaabc.com', '6012345678', 'NIT', '900123456-1')
ON CONFLICT DO NOTHING;

-- Insert default user (admin/cashier)
INSERT INTO users (name, email, password_hash, role) VALUES
('Administrador', 'admin@pos.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Cajero Principal', 'cajero@pos.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cashier')
ON CONFLICT DO NOTHING;
