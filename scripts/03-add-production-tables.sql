-- Production orders table
CREATE TABLE IF NOT EXISTS production_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    product_id INTEGER REFERENCES products(id),
    quantity_to_produce INTEGER NOT NULL,
    quantity_produced INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    start_date TIMESTAMP,
    completion_date TIMESTAMP,
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Raw materials table
CREATE TABLE IF NOT EXISTS raw_materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    unit_id INTEGER REFERENCES units(id),
    cost DECIMAL(10,2),
    current_stock DECIMAL(10,2) DEFAULT 0,
    min_stock DECIMAL(10,2) DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product recipes (BOM - Bill of Materials)
CREATE TABLE IF NOT EXISTS product_recipes (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    raw_material_id INTEGER REFERENCES raw_materials(id),
    quantity_needed DECIMAL(10,2) NOT NULL, -- quantity per unit of product
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, raw_material_id)
);

-- Production order materials (materials used in production)
CREATE TABLE IF NOT EXISTS production_order_materials (
    id SERIAL PRIMARY KEY,
    production_order_id INTEGER REFERENCES production_orders(id),
    raw_material_id INTEGER REFERENCES raw_materials(id),
    quantity_required DECIMAL(10,2) NOT NULL,
    quantity_used DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_production_orders_status ON production_orders(status);
CREATE INDEX IF NOT EXISTS idx_production_orders_product ON production_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_raw_materials_active ON raw_materials(active);
CREATE INDEX IF NOT EXISTS idx_product_recipes_product ON product_recipes(product_id);
