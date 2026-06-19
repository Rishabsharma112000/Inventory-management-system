import os
import sys
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from decimal import Decimal
import time

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from app.config.database import engine, SessionLocal
from app.config.database import Base
from app.models import Category, Supplier, Product, Customer, Order, OrderItem

# Load environment variables
load_dotenv()

def seed_database():
    print("Starting database seeding...")
    
    # Create all tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Clear existing data
        print("Clearing existing data...")
        db.query(OrderItem).delete()
        db.query(Order).delete()
        db.query(Product).delete()
        db.query(Category).delete()
        db.query(Supplier).delete()
        db.query(Customer).delete()
        db.commit()
        
        # Seed Categories
        print("Seeding categories...")
        categories = [
            Category(name="Electronics", description="Electronic devices and accessories", icon="📱"),
            Category(name="Clothing", description="Apparel and fashion items", icon="👕"),
            Category(name="Home & Kitchen", description="Household items and kitchenware", icon="🏠"),
            Category(name="Books", description="Books and reading materials", icon="📚"),
            Category(name="Sports", description="Sports equipment and gear", icon="⚽"),
        ]
        db.add_all(categories)
        db.commit()
        for cat in categories:
            db.refresh(cat)
        
        # Seed Suppliers
        print("Seeding suppliers...")
        suppliers = [
            Supplier(name="Tech Suppliers Inc.", email="contact@techsuppliers.com", phone="+1-800-123-4567", address="123 Tech Park, San Francisco, CA", gstNumber="GST123456789"),
            Supplier(name="Fashion Hub", email="info@fashionhub.com", phone="+1-800-987-6543", address="456 Fashion Ave, New York, NY", gstNumber="GST987654321"),
            Supplier(name="Home Goods Co.", email="support@homegoods.com", phone="+1-800-456-7890", address="789 Home Blvd, Los Angeles, CA", gstNumber="GST456123789"),
        ]
        db.add_all(suppliers)
        db.commit()
        for sup in suppliers:
            db.refresh(sup)
        
        # Seed Products
        print("Seeding products...")
        products = [
            Product(
                name="Wireless Headphones",
                sku="ELEC-001",
                description="Noise-cancelling wireless headphones",
                categoryId=categories[0].id,
                supplierId=suppliers[0].id,
                price=Decimal("99.99"),
                quantity=50,
                minimumStock=10,
                imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
                status="ACTIVE"
            ),
            Product(
                name="Smartphone",
                sku="ELEC-002",
                description="Latest model smartphone",
                categoryId=categories[0].id,
                supplierId=suppliers[0].id,
                price=Decimal("699.99"),
                quantity=25,
                minimumStock=5,
                imageUrl="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
                status="ACTIVE"
            ),
            Product(
                name="T-Shirt",
                sku="CLOTH-001",
                description="Cotton casual t-shirt",
                categoryId=categories[1].id,
                supplierId=suppliers[1].id,
                price=Decimal("19.99"),
                quantity=100,
                minimumStock=20,
                imageUrl="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
                status="ACTIVE"
            ),
            Product(
                name="Jeans",
                sku="CLOTH-002",
                description="Denim jeans",
                categoryId=categories[1].id,
                supplierId=suppliers[1].id,
                price=Decimal("49.99"),
                quantity=75,
                minimumStock=15,
                imageUrl="https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
                status="ACTIVE"
            ),
            Product(
                name="Coffee Maker",
                sku="HOME-001",
                description="Automatic drip coffee maker",
                categoryId=categories[2].id,
                supplierId=suppliers[2].id,
                price=Decimal("39.99"),
                quantity=40,
                minimumStock=8,
                imageUrl="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
                status="ACTIVE"
            ),
            Product(
                name="Programming Book",
                sku="BOOK-001",
                description="Learn to program in JavaScript",
                categoryId=categories[3].id,
                supplierId=suppliers[2].id,
                price=Decimal("29.99"),
                quantity=60,
                minimumStock=12,
                imageUrl="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
                status="ACTIVE"
            ),
            Product(
                name="Yoga Mat",
                sku="SPORT-001",
                description="Non-slip yoga mat",
                categoryId=categories[4].id,
                supplierId=suppliers[0].id,
                price=Decimal("24.99"),
                quantity=5,
                minimumStock=10,
                imageUrl="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
                status="ACTIVE"
            ),
        ]
        db.add_all(products)
        db.commit()
        for prod in products:
            db.refresh(prod)
        
        # Seed Customers
        print("Seeding customers...")
        customers = [
            Customer(fullName="John Doe", email="john@example.com", phone="+1-555-123-4567", address="123 Main St, New York, NY"),
            Customer(fullName="Jane Smith", email="jane@example.com", phone="+1-555-987-6543", address="456 Oak Ave, Los Angeles, CA"),
        ]
        db.add_all(customers)
        db.commit()
        for cust in customers:
            db.refresh(cust)
        
        # Seed Orders
        print("Seeding orders...")
        # Order 1
        order1 = Order(
            orderNumber=f"ORD-{int(time.time())}",
            customerId=customers[0].id,
            totalAmount=products[0].price * 2,
            status="PENDING"
        )
        db.add(order1)
        db.commit()
        db.refresh(order1)
        
        order_item1 = OrderItem(
            orderId=order1.id,
            productId=products[0].id,
            quantity=2,
            price=products[0].price,
            subtotal=products[0].price * 2
        )
        db.add(order_item1)
        
        # Order 2
        order2 = Order(
            orderNumber=f"ORD-{int(time.time()) + 1}",
            customerId=customers[1].id,
            totalAmount=products[2].price * 3,
            status="COMPLETED"
        )
        db.add(order2)
        db.commit()
        db.refresh(order2)
        
        order_item2 = OrderItem(
            orderId=order2.id,
            productId=products[2].id,
            quantity=3,
            price=products[2].price,
            subtotal=products[2].price * 3
        )
        db.add(order_item2)
        
        db.commit()
        
        print("Database seeded successfully!")
        
    except Exception as e:
        print(f"Seeding failed: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
